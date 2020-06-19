import React from "react";

export const EditingContext = React.createContext<{ editing: boolean }>({
    editing: false,
});
