import { from } from "apollo-link";
import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import introspectionQueryResultData from "../graph/graphql";
import { RefreshDocument, RefreshMutation, RefreshMutationVariables } from "../graph/graphql";
import { Platform } from "react-native";
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
export const uri =
    Platform.OS === "web" ? "http://localhost:5000/graphql" : "http://192.168.20.20:5000/graphql";

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
            graphQLErrors.map(({ message, locations, path }) => {
                console.warn(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                );

                if (message === "Signature has expired") {
                    console.warn(" ... Refreshing token ... ");

                    getRefreshToken().then((value) => {
                        if (value != null) {
                            getClient(values)
                                .mutate<RefreshMutation, RefreshMutationVariables>({
                                    mutation: RefreshDocument,
                                    variables: {
                                        refreshToken: value,
                                    },
                                })
                                .then(({ data }) => {
                                    console.log(" ... Refresh Query ... ");
                                    console.log(data);
                                    if (data?.refresh?.__typename === "Refresh") {
                                        console.log(" ... Token Refreshed ... ");
                                        const token = data.refresh.accessToken;
                                        setAccessToken(data.refresh.accessToken).then(() => {
                                            const oldHeaders = operation.getContext().headers;
                                            console.log("Old Headers", oldHeaders);
                                            operation.setContext({
                                                headers: {
                                                    ...oldHeaders,
                                                    authorization: `Bearer ${token}`,
                                                },
                                            });
                                            console.log(operation.getContext().headers);
                                            setTimeout(() => forward(operation), 0);
                                        });
                                    } else {
                                        removeRefreshToken();
                                        removeAccessToken();
                                    }
                                })
                                .catch(() => {
                                    removeRefreshToken();
                                    removeAccessToken();
                                });
                        } else {
                            removeRefreshToken();
                            removeAccessToken();
                        }
                    });
                }
                // showMessage({
                //     message: "GraphQL Error",
                //     description: `${message}, Location: ${locations}, Path: ${path}`,
                //     type: "danger",
                //     duration: 10000,
                // });
            });
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
    });

    async function clearClient(): Promise<any[]> {
        return await client.clearStore();
    }

    return client;
};
