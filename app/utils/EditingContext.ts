import React from "react";

export const EditingContext = React.createContext<{
    startUpdate: () => void;
}>({
    startUpdate: () => console.warn("This function hasn't been set."),
});
