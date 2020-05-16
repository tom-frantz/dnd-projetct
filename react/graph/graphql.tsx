import gql from "graphql-tag";
import * as React from "react";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactComponents from "@apollo/react-components";
import * as ApolloReactHoc from "@apollo/react-hoc";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /**
     * The `DateTime` scalar type represents a DateTime
     * value as specified by
     * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
     */
    DateTime: any;
    /**
     * Allows use of a JSON String for input / output from the GraphQL schema.
     *
     * Use of this type is *not recommended* as you lose the benefits of having a defined, static
     * schema (one of the key benefits of GraphQL).
     */
    JSONString: any;
};

export type Query = {
    __typename?: "Query";
    me?: Maybe<User>;
    user?: Maybe<User>;
    users?: Maybe<UserConnection>;
    templates?: Maybe<TemplateConnection>;
    documents?: Maybe<DocumentConnection>;
};

export type QueryUserArgs = {
    id: Scalars["ID"];
};

export type QueryUsersArgs = {
    before?: Maybe<Scalars["String"]>;
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    id?: Maybe<Scalars["ID"]>;
    roles?: Maybe<Scalars["String"]>;
    username?: Maybe<Scalars["String"]>;
};

export type QueryTemplatesArgs = {
    before?: Maybe<Scalars["String"]>;
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    created?: Maybe<Scalars["DateTime"]>;
    id?: Maybe<Scalars["ID"]>;
};

export type QueryDocumentsArgs = {
    before?: Maybe<Scalars["String"]>;
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    created?: Maybe<Scalars["DateTime"]>;
    id?: Maybe<Scalars["ID"]>;
    values?: Maybe<Scalars["JSONString"]>;
    author?: Maybe<Scalars["ID"]>;
    template?: Maybe<Scalars["ID"]>;
};

export type User = Node & {
    __typename?: "User";
    articles?: Maybe<DocumentConnection>;
    /** The ID of the object. */
    id: Scalars["ID"];
    roles?: Maybe<Array<Maybe<Scalars["String"]>>>;
    username: Scalars["String"];
};

export type UserArticlesArgs = {
    before?: Maybe<Scalars["String"]>;
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    created?: Maybe<Scalars["DateTime"]>;
    id?: Maybe<Scalars["ID"]>;
    values?: Maybe<Scalars["JSONString"]>;
    author?: Maybe<Scalars["ID"]>;
    template?: Maybe<Scalars["ID"]>;
};

/** An object with an ID */
export type Node = {
    /** The ID of the object. */
    id: Scalars["ID"];
};

export type DocumentConnection = {
    __typename?: "DocumentConnection";
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** Contains the nodes in this connection. */
    edges: Array<Maybe<DocumentEdge>>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
    __typename?: "PageInfo";
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars["Boolean"];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars["Boolean"];
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<Scalars["String"]>;
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<Scalars["String"]>;
};

/** A Relay edge containing a `Document` and its cursor. */
export type DocumentEdge = {
    __typename?: "DocumentEdge";
    /** The item at the end of the edge */
    node?: Maybe<Document>;
    /** A cursor for use in pagination */
    cursor: Scalars["String"];
};

export type Document = Node & {
    __typename?: "Document";
    author?: Maybe<User>;
    created: Scalars["DateTime"];
    /** The ID of the object. */
    id: Scalars["ID"];
    template?: Maybe<Template>;
    values: Scalars["JSONString"];
    contents?: Maybe<Array<Maybe<DocumentSection>>>;
};

export type Template = Node & {
    __typename?: "Template";
    created: Scalars["DateTime"];
    /** The ID of the object. */
    id: Scalars["ID"];
    contents: Array<Maybe<TemplateSection>>;
};

export type TemplateSection = {
    __typename?: "TemplateSection";
    defaultParams?: Maybe<Scalars["JSONString"]>;
    name: Scalars["String"];
    renderType: Scalars["String"];
};

export type DocumentSection = {
    __typename?: "DocumentSection";
    content?: Maybe<Scalars["String"]>;
    name: Scalars["String"];
    params?: Maybe<Scalars["JSONString"]>;
};

export type UserConnection = {
    __typename?: "UserConnection";
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** Contains the nodes in this connection. */
    edges: Array<Maybe<UserEdge>>;
};

/** A Relay edge containing a `User` and its cursor. */
export type UserEdge = {
    __typename?: "UserEdge";
    /** The item at the end of the edge */
    node?: Maybe<User>;
    /** A cursor for use in pagination */
    cursor: Scalars["String"];
};

export type TemplateConnection = {
    __typename?: "TemplateConnection";
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** Contains the nodes in this connection. */
    edges: Array<Maybe<TemplateEdge>>;
};

/** A Relay edge containing a `Template` and its cursor. */
export type TemplateEdge = {
    __typename?: "TemplateEdge";
    /** The item at the end of the edge */
    node?: Maybe<Template>;
    /** A cursor for use in pagination */
    cursor: Scalars["String"];
};

export type Mutation = {
    __typename?: "Mutation";
    login?: Maybe<LoginMutationResult>;
    userCreate?: Maybe<UserCreateMutationResult>;
    documentCreate?: Maybe<DocumentCreateMutationResult>;
};

export type MutationLoginArgs = {
    password: Scalars["String"];
    username: Scalars["String"];
};

export type MutationUserCreateArgs = {
    password: Scalars["String"];
    username: Scalars["String"];
};

export type LoginMutationResult = MutationFail | Login;

export type MutationFail = {
    __typename?: "MutationFail";
    errors?: Maybe<Array<Error>>;
};

export type Error = {
    __typename?: "Error";
    message: Scalars["String"];
    path: Array<Scalars["String"]>;
};

export type Login = {
    __typename?: "Login";
    refreshToken?: Maybe<Scalars["String"]>;
    accessToken?: Maybe<Scalars["String"]>;
};

export type UserCreateMutationResult = MutationFail | UserCreate;

export type UserCreate = {
    __typename?: "UserCreate";
    user?: Maybe<User>;
};

export type DocumentCreateMutationResult = MutationFail | DocumentCreate;

export type DocumentCreate = {
    __typename?: "DocumentCreate";
    document?: Maybe<Document>;
};

export type MeQueryVariables = {};

export type MeQuery = { __typename?: "Query" } & {
    me?: Maybe<{ __typename?: "User" } & Pick<User, "id">>;
};

export const MeDocument = gql`
    query me {
        me {
            id
        }
    }
`;
export type MeComponentProps = Omit<
    ApolloReactComponents.QueryComponentOptions<MeQuery, MeQueryVariables>,
    "query"
>;

export const MeComponent = (props: MeComponentProps) => (
    <ApolloReactComponents.Query<MeQuery, MeQueryVariables> query={MeDocument} {...props} />
);

export type MeProps<TChildProps = {}, TDataName extends string = "data"> = {
    [key in TDataName]: ApolloReactHoc.DataValue<MeQuery, MeQueryVariables>;
} &
    TChildProps;
export function withMe<TProps, TChildProps = {}, TDataName extends string = "data">(
    operationOptions?: ApolloReactHoc.OperationOption<
        TProps,
        MeQuery,
        MeQueryVariables,
        MeProps<TChildProps, TDataName>
    >
) {
    return ApolloReactHoc.withQuery<
        TProps,
        MeQuery,
        MeQueryVariables,
        MeProps<TChildProps, TDataName>
    >(MeDocument, {
        alias: "me",
        ...operationOptions,
    });
}
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;

export interface IntrospectionResultData {
    __schema: {
        types: {
            kind: string;
            name: string;
            possibleTypes: {
                name: string;
            }[];
        }[];
    };
}
const result: IntrospectionResultData = {
    __schema: {
        types: [
            {
                kind: "INTERFACE",
                name: "Node",
                possibleTypes: [
                    {
                        name: "User",
                    },
                    {
                        name: "Document",
                    },
                    {
                        name: "Template",
                    },
                ],
            },
            {
                kind: "UNION",
                name: "LoginMutationResult",
                possibleTypes: [
                    {
                        name: "MutationFail",
                    },
                    {
                        name: "Login",
                    },
                ],
            },
            {
                kind: "UNION",
                name: "UserCreateMutationResult",
                possibleTypes: [
                    {
                        name: "MutationFail",
                    },
                    {
                        name: "UserCreate",
                    },
                ],
            },
            {
                kind: "UNION",
                name: "DocumentCreateMutationResult",
                possibleTypes: [
                    {
                        name: "MutationFail",
                    },
                    {
                        name: "DocumentCreate",
                    },
                ],
            },
        ],
    },
};
export default result;
