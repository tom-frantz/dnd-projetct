from collections import defaultdict

from graph.subscriptions.utils import filter_out_stopped

document_observers = defaultdict(lambda: [])


def document_update_on_subscribe(root, info, doc_id):
    def observer_func(observer):
        document_observers[str(doc_id)].append(observer)

    return observer_func


def update_document_subscribers(document):
    global document_observers

    filtered = filter_out_stopped(document_observers[str(document.pk)])

    for document_observer in filtered:
        document_observer.on_next(document)

    document_observers[str(document.pk)] = filtered
