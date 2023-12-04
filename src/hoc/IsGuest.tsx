import { RootState } from "@/redux/reducers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const IsGuest = (Component: any) => {
  const AuthenticatedComponent = () => {
    const { token, user } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    useEffect(() => {
      if (token && user) router.push("/dashboard");
    }, [token, user]);

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default IsGuest;
