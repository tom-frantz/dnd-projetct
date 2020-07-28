# https://medium.com/better-programming/implement-graphql-subscriptions-with-flask-7fa16e8b188d
from flask_graphql import GraphQLView
from functools import partial

from flask import Response, request
from graphql import GraphQLCoreBackend
from graphql_server import HttpQueryError, run_http_query, FormattedResult
from graphql_ws.gevent import GeventSubscriptionServer, SubscriptionObserver
from rx import AnonymousObservable, Observable
from graphql_server import default_format_error


def format_execution_result(
    execution_result, format_error,
):
    # type: (...) -> GraphQLResponse
    status_code = 200
    if execution_result:
        target_result = None

        def override_target_result(value):
            nonlocal target_result
            target_result = value

        if isinstance(execution_result, AnonymousObservable):
            target = execution_result.subscribe(
                on_next=lambda value: override_target_result(value)
            )
            target.dispose()
            response = target_result
        elif execution_result.invalid:
            status_code = 400
            response = execution_result.to_dict(format_error=format_error)
        else:
            response = execution_result.to_dict(format_error=format_error)
    else:
        response = None
    return FormattedResult(response, status_code)


def encode_execution_results(
    execution_results,  # type: List[Optional[ExecutionResult]]
    format_error,  # type: Callable[[Exception], Dict]
    is_batch,  # type: bool
    encode,  # type: Callable[[Dict], Any]
):
    # type: (...) -> Tuple[Any, int]
    responses = [
        format_execution_result(execution_result, format_error)
        for execution_result in execution_results
    ]
    result, status_codes = zip(*responses)
    status_code = max(status_codes)

    if not is_batch:
        result = result[0]

    return encode(result), status_code


class OverriddenView(GraphQLView):
    def dispatch_request(self):
        try:
            request_method = request.method.lower()
            data = self.parse_body()

            show_graphiql = request_method == 'get' and self.should_display_graphiql()
            catch = show_graphiql

            pretty = self.pretty or show_graphiql or request.args.get('pretty')

            extra_options = {}
            executor = self.get_executor()
            if executor:
                # We only include it optionally since
                # executor is not a valid argument in all backends
                extra_options['executor'] = executor

            execution_results, all_params = run_http_query(
                self.schema,
                request_method,
                data,
                query_data=request.args,
                batch_enabled=self.batch,
                catch=catch,
                backend=self.get_backend(),
                # Execute options
                root=self.get_root_value(),
                context=self.get_context(),
                middleware=self.get_middleware(),
                **extra_options
            )

            result, status_code = encode_execution_results(
                execution_results,
                is_batch=isinstance(data, list),
                format_error=self.format_error,
                encode=partial(self.encode, pretty=pretty),
            )

            if show_graphiql:
                return self.render_graphiql(params=all_params[0], result=result)

            return Response(
                result, status=status_code, content_type='application/expoAppJson'
            )

        except HttpQueryError as e:
            return Response(
                self.encode({'errors': [self.format_error(e)]}),
                status=e.status_code,
                headers=e.headers,
                content_type='application/expoAppJson',
            )


class CustomBackend(GraphQLCoreBackend):
    def __init__(self, executor=None):
        super().__init__(executor)
        self.execute_params['allow_subscriptions'] = True


class GeventSubscriptionServerOverride(GeventSubscriptionServer):
    def on_stop(self, connection_context, op_id):
        connection_context.observer.dispose()
        return super(GeventSubscriptionServerOverride, self).on_stop(
            connection_context, op_id
        )

    def on_start(self, connection_context, op_id, params):
        try:
            execution_result = self.execute(connection_context.request_context, params)
            assert isinstance(
                execution_result, Observable
            ), "A subscription must return an observable"
            observer = SubscriptionObserver(
                connection_context,
                op_id,
                self.send_execution_result,
                self.send_error,
                self.on_close,
            )
            anon_disposable = execution_result.subscribe(observer)
            setattr(connection_context, "observer", anon_disposable)
        except Exception as e:
            self.send_error(connection_context, op_id, str(e))
