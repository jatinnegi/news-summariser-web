import { NextPage } from "next";
import { RootState } from "@/redux/reducers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const WithAuth = (Component: NextPage) => (props: any) => {
  const { token, user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!token || !user) router.push("/");
    else setMounted(true);
  }, [token, user]);

  if (!mounted) return <></>;

  return <Component {...props} />;
};

export default WithAuth;
