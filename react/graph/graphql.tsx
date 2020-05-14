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
};

export type Query = {
    __typename?: "Query";
    me?: Maybe<Scalars["String"]>;
};

export type Mutation = {
    __typename?: "Mutation";
    userCreate?: Maybe<Scalars["String"]>;
};

export type MeQueryVariables = {};

export type MeQuery = { __typename?: "Query" } & Pick<Query, "me">;

export const MeDocument = gql`
    query me {
        me
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
        types: [],
    },
};
export default result;
