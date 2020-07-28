import gql from "graphql-tag";

const meQuery = gql`
    query me {
        me {
            __typename
            id
            username
            articles {
                edges {
                    node {
                        __typename
                        id
                        created
                        title
                        description
                        contents {
                            name
                            content
                            description
                            template {
                                name
                                renderType
                            }
                        }
                    }
                }
            }
            sharedArticles {
                edges {
                    node {
                        __typename
                        id
                        created
                        title
                        description
                        author {
                            __typename
                            id
                            username
                        }
                        contents {
                            name
                            content
                            description
                            template {
                                name
                                renderType
                            }
                        }
                    }
                }
            }
        }
    }
`;

const documentQuery = gql`
    query document($id: ID!) {
        document(id: $id) {
            __typename
            id
            title
            description
            created
            author {
                __typename
                id
                username
            }
            isAuthor
            accessPermission
            privacySettings {
                visibility
                publicAccessType
                usersAccess {
                    user {
                        __typename
                        id
                        username
                    }
                    accessType
                }
            }
            contents {
                name
                description
                content
            }
        }
    }
`;

const searchByUsername = gql`
    query searchByUsername($usernameContains: String!, $meID: ID!) {
        users(username_Icontains: $usernameContains, first: 5, id_Ne: $meID) {
            edges {
                node {
                    __typename
                    username
                    id
                }
            }
        }
    }
`;

const getMyDocuments = gql`
    query getMyDocuments {
        me {
            articles {
                edges {
                    node {
                        id
                        title
                        description
                    }
                }
            }
        }
    }
`;
