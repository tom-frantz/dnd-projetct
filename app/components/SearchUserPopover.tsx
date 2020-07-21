import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import {
    MeDocument,
    MeQuery,
    MeQueryVariables,
    SearchByUsernameDocument,
    SearchByUsernameQuery,
    SearchByUsernameQueryVariables,
} from "../graph/graphql";
import { Autocomplete, AutocompleteItem, Card, Input, Popover } from "@ui-kitten/components";
import Text from "./Text";

interface SearchUserPopoverProps {
    onSubmit(value: { username: string; id: string }): void;
}

const SearchUserPopover: React.FC<SearchUserPopoverProps> = (props: SearchUserPopoverProps) => {
    const { onSubmit } = props;
    const [searchString, setSearchString] = useState("");
    const AutocompleteRef = useRef<Autocomplete | null>(null);

    const { data: meData } = useQuery<MeQuery, MeQueryVariables>(MeDocument);

    const { data, error, loading, refetch } = useQuery<
        SearchByUsernameQuery,
        SearchByUsernameQueryVariables
    >(SearchByUsernameDocument, {
        variables: {
            usernameContains: searchString,
            meID: meData?.me?.id as string,
        },
        skip: searchString == "" || meData?.me?.id == undefined,
    });

    // TODO implement some sort of cancelling for inflight requests.
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (meData?.me?.id)
                refetch({ usernameContains: searchString, meID: meData?.me?.id }).then(() => {
                    // Needed to make the autocomplete show ... probably.
                    if (AutocompleteRef.current) {
                        AutocompleteRef.current.blur();
                        AutocompleteRef.current.focus();
                    }
                });
        }, 250);
        return () => {
            clearTimeout(timeout);
        };
    }, [searchString]);

    return (
        <Autocomplete
            ref={AutocompleteRef}
            onChangeText={setSearchString}
            value={searchString}
            onSelect={(index) => {
                onSubmit(data?.users?.edges[index]?.node as { username: string; id: string });
            }}
            onSubmitEditing={() => {
                console.warn("Not Implemented");
            }}
            label={"Add New User"}
            placement={"bottom"}
        >
            {data?.users?.edges
                .filter((edge) => edge?.node != undefined)
                .map((edge) => (
                    //@ts-ignore
                    <AutocompleteItem key={edge.node.id} title={edge.node.username} />
                ))}
        </Autocomplete>
    );
};

export default SearchUserPopover;
