import AsyncStorage from "@react-native-community/async-storage";
import React from "react";

export async function getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem("token");
}

export async function setAccessToken(token: string): Promise<void> {
    return await AsyncStorage.setItem("token", token);
}

export async function removeAccessToken(): Promise<void> {
    return await AsyncStorage.removeItem("token");
}

export async function getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem("refreshToken");
}

export async function setRefreshToken(token: string): Promise<void> {
    return await AsyncStorage.setItem("refreshToken", token);
}

export async function removeRefreshToken(): Promise<void> {
    return await AsyncStorage.removeItem("refreshToken");
}

interface AuthValues {
    token: string | undefined;
    setTokens(accessToken: string, refreshToken: string): Promise<void>;
    clearTokens(): Promise<void>;
}

export const AuthContext = React.createContext<AuthValues>({
    token: undefined,
    setTokens: async (token: string) => {
        console.warn(
            "AuthContext.setToken is being called from outside the context. Have to initialized a AuthContext.Provider?"
        );
    },
    clearTokens: async () => {
        console.warn(
            "AuthContext.clearToken is being called from outside the context. Have to initialized a AuthContext.Provider?"
        );
    },
});
