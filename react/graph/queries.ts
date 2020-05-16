import gql from "graphql-tag";

const meQuery = gql`
    query me {
        me {
            id
        }
    }
`;
