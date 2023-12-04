import { NextPage } from "next";
import { RootState } from "@/redux/reducers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const IsGuest = (Component: NextPage) => (props: any) => {
  const { token, user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (token && user) router.push("/dashboard");
  }, [token, user]);

  return <Component {...props} />;
};

export default IsGuest;
