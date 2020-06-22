import gql from "graphql-tag";

const login = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ... on Login {
                refreshToken
                accessToken
                user {
                    id
                }
            }
            ... on MutationFail {
                errors {
                    message
                    path
                }
            }
        }
    }
`;

const refresh = gql`
    mutation refresh($refreshToken: String!) {
        refresh(refreshToken: $refreshToken) {
            ... on Refresh {
                accessToken
            }
        }
    }
`;

const documentUpdate = gql`
    mutation documentUpdate($id: ID!, $input: DocumentInput!) {
        documentUpdate(id: $id, input: $input) {
            __typename
            ... on DocumentUpdate {
                document {
                    id
                    title
                    description
                    created
                    author {
                        id
                    }
                    contents {
                        name
                        description
                        content
                    }
                }
            }
        }
    }
`;

const register = gql`
    mutation register($password: String!, $username: String!) {
        userCreate(password: $password, username: $username) {
            ... on UserCreate {
                accessToken
                refreshToken
            }
            ... on MutationFail {
                errors {
                    message
                    path
                }
            }
        }
    }
`;

const createNewDocument = gql`
    mutation createNewDocument {
        documentCreate(input: { title: "Untitled Document" }) {
            __typename
            ... on DocumentCreate {
                document {
                    id
                }
            }
        }
    }
`;
