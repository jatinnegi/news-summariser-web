"use client";
import { FC, PropsWithChildren, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/redux/store";
import { initUser } from "@/redux/actions";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) return;

        const { user: authUser } = await response.json();

        const user = {
          email: authUser.email || "",
          name: authUser.name || "",
          picture: authUser.picture || "",
        };

        store.dispatch(initUser({ token, user }));
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  return (
    <ReduxProvider store={store}>
      <GoogleOAuthProvider clientId="665297052167-9r4s6qdmkdj5f4adbmicm3utacj5hdt6.apps.googleusercontent.com">
        {children}
      </GoogleOAuthProvider>
    </ReduxProvider>
  );
};

export default Providers;
