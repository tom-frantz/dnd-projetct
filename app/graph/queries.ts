import gql from "graphql-tag";

const meQuery = gql`
    query me {
        me {
            id
            username
            articles {
                edges {
                    node {
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
        }
    }
`;

const documentQuery = gql`
    query document($id: ID!) {
        document(id: $id) {
            id
            title
            description
            created
            contents {
                name
                description
                content
            }
        }
    }
`;
