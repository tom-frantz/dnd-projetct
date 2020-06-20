import { Alert, AlertButton, AlertOptions } from "react-native";

console.log("Not web?");

export interface AlertParams {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    options?: AlertOptions;
}

export const messageAlert = ({ title, message, buttons, options }: AlertParams): void => {
    Alert.alert(title, message, buttons, options);
};
