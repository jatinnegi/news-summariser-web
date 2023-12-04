"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { initUser } from "@/redux/actions";
import { useRouter } from "next/navigation";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import GoogleLogin from "@/components/GoogleLogin";
import PasswordInput from "@/components/PasswordInput";
import IsGuest from "@/hoc/IsGuest";

const App = () => {
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<boolean>(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) => {
      const { access_token } = tokenResponse;
      if (typeof access_token === "string" && access_token.length)
        setGoogleAccessToken(access_token);
    },
    onError: () => {
      console.log("Something went wrong!");
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const body = JSON.stringify({
        password,
        googleAccessToken,
      });

      const response = await fetch("/api/auth", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body,
      });

      if (response.status !== 200) throw new Error("Something went wrong");

      const { token, user } = await response.json();

      if (!token || !user) return;

      setAuthError(false);
      setPassword("");

      localStorage.setItem("token", token);
      dispatch(initUser({ token, user }));
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setAuthError(true);
    }
  }

  const displayPasswordForm = googleAccessToken.length > 0;

  return (
    <div
      className="w-11/12 my-4 mx-auto max-w-6xl h-[40svh] min-h-[250px]
      flex items-center justify-center"
    >
      <div className="w-full max-w-sm mx-auto">
        <p className="text-2xl font-medium mb-10 text-center">
          Hi, Welcome back
        </p>
        {displayPasswordForm ? (
          <form onSubmit={handleSubmit}>
            <PasswordInput
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
              error={authError}
            />
            <button
              type="submit"
              className="py-3 w-full text-white font-medium text-sm bg-blue-500 rounded-[3px] mt-4"
            >
              Sign In
            </button>
            <button
              type="button"
              className="py-3 w-full text-zinc-700 font-medium text-sm bg-gray-300 rounded-[3px] mt-1"
              onClick={() => {
                setGoogleAccessToken("");
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <GoogleLogin handleClick={login} />
        )}
      </div>
    </div>
  );
};

export default IsGuest(App);
