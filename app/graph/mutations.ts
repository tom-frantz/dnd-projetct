import gql from "graphql-tag";

const login = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ... on Login {
                refreshToken
                accessToken
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
