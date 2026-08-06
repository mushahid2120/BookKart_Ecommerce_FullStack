"use client";
import { useLazyCheckUserQuery } from "@/store/api";
import { logout, setEmailVerified, setUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "lucide-react";
import Loading from "./Loading";

export default function AuthCheckWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [checkUser] = useLazyCheckUserQuery();
  const [isCheckingUser, setIsCheckingUser] = useState<boolean>(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user)

  async function checkingUser() {
    try {
      const response = await checkUser(null).unwrap();
      if (response.isSuccess) {
        dispatch(setUser(response.data));
        // console.log(response.data)
        // dispatch(setEmailVerified(response.data.isVerified))
      } else {
        dispatch(logout());
      }
    } catch (error) {
      dispatch(logout());
      console.log(error);
    } finally {
      setIsCheckingUser(false);
    }
  }

  useEffect(() => {
    checkingUser();
  }, [checkUser, dispatch]);

  if (isCheckingUser) {
    return (
      <Loading />
    );
  }

  return children;
}
