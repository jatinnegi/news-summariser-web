import { RootState } from "@/redux/reducers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const WithAuth = (Component: any) => {
  const AuthenticatedComponent = () => {
    const { token, user } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
      if (!token || !user) router.push("/");
      else setMounted(true);
    }, [token, user]);

    if (!mounted) return <></>;

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default WithAuth;
