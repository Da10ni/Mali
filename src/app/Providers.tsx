"use client";

import { SessionProvider } from "next-auth/react";
import store from "@/src/store/store";
import { Provider } from "react-redux";
import { AuthProvider } from "../context/AuthContext";



export function Providers({ children }: { children: React.ReactNode }) {
  return (

   <SessionProvider>

      <Provider store={store}>
        <AuthProvider>
    {children}
        </AuthProvider>
    </Provider>

    </SessionProvider>
    );
}
