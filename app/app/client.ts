import { from, Observable, fromPromise } from "apollo-link";
import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import introspectionQueryResultData from "../graph/graphql";
import { RefreshDocument, RefreshMutation, RefreshMutationVariables } from "../graph/graphql";
import { Platform } from "react-native";
import { load } from "dotenv";
// import { showMessage, hideMessage } from "react-native-flash-message";

interface ClientValues {
    setAccessToken(token: string): Promise<void>;
    setRefreshToken(token: string): Promise<void>;

    getAccessToken(): Promise<string | null>;
    getRefreshToken(): Promise<string | null>;
    removeAccessToken(): Promise<void>;
    removeRefreshToken(): Promise<void>;
}

// const { endpoint } = getEnvVars();
// TODO CHANGE FOR IOS SUPPORT TOO.
export const uri = "https://c29rm8ehti.execute-api.us-east-1.amazonaws.com/prod/graphql";

console.log(uri);

let client: ApolloClient<any> | undefined = undefined;

export const getClient = (values: ClientValues) => {
    if (client != undefined) {
        return client;
    } else {
        client = createClient(values);
        return client;
    }
};

const createClient = (values: ClientValues): ApolloClient<any> => {
    const {
        getAccessToken,
        getRefreshToken,
        setAccessToken,
        removeAccessToken,
        removeRefreshToken,
    } = values;

    const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
        if (graphQLErrors) {
            for (const error of graphQLErrors) {
                const { message, locations, path } = error;
                console.warn(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                );

                if (message === "Signature has expired") {
                    console.warn(" ... Refreshing token ... ");

                    return new Observable((observer) => {
                        const refreshAccessToken = async () => {
                            const removeBothTokens = async () => {
                                await Promise.all([removeRefreshToken(), removeAccessToken()]);
                            };

                            try {
                                const refreshToken = await getRefreshToken();
                                if (refreshToken === null) {
                                    return await removeBothTokens();
                                }

                                const { data } = await getClient(values).mutate<
                                    RefreshMutation,
                                    RefreshMutationVariables
                                >({
                                    mutation: RefreshDocument,
                                    variables: {
                                        refreshToken,
                                    },
                                });

                                if (data?.refresh?.__typename === "Refresh") {
                                    await setAccessToken(data.refresh.accessToken);

                                    const oldHeaders = operation.getContext().headers;
                                    operation.setContext({
                                        headers: {
                                            ...oldHeaders,
                                            authorization: `Bearer ${data.refresh.accessToken}`,
                                        },
                                    });

                                    const subscriber = {
                                        next: observer.next.bind(observer),
                                        error: observer.error.bind(observer),
                                        complete: observer.complete.bind(observer),
                                    };

                                    // Retry last failed request
                                    forward(operation).subscribe(subscriber);
                                    return;
                                } else {
                                    return await removeBothTokens();
                                }
                            } catch (e) {
                                return await removeBothTokens();
                            }
                        };

                        refreshAccessToken();
                    });
                }
                // showMessage({
                //     message: "GraphQL Error",
                //     description: `${message}, Location: ${locations}, Path: ${path}`,
                //     type: "danger",
                //     duration: 10000,
                // });
            }
        }

        if (networkError) {
            console.warn(`[Network error]: ${networkError}`);
            // showMessage({
            //     message: "Network Error",
            //     description: `${networkError.message}`,
            //     type: "danger",
            //     duration: 10000,
            // });
        }
    });

    const httpLink = createUploadLink({
        uri,
    });

    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData,
    });

    const cache = new InMemoryCache({
        fragmentMatcher,
    });

    const authLink = setContext(async (_, { headers }) => {
        const token = await getAccessToken();

        if (token == null) {
            return { headers };
        }

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            },
        };
    });

    const client = new ApolloClient<any>({
        link: from([authLink, errorLink, httpLink]),
        cache,
        queryDeduplication: false,
    });

    async function clearClient(): Promise<any[]> {
        return await client.clearStore();
    }

    return client;
};
