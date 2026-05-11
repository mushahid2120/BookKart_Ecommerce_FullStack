"use client";
import { useLazyCheckUserQuery } from "@/store/api";
import { logout, setEmailVerified, setUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "lucide-react";

export default function AuthCheckWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [checkUser] = useLazyCheckUserQuery();
  const [isCheckingUser, setIsCheckingUser] = useState<boolean>(true);
  const dispatch = useDispatch();
  const user=useSelector((state:RootState)=>state.user.user)

  // async function checkingUser() {
  //   try {
  //     const response = await checkUser(null).unwrap();
  //     if (response.isSuccess) {
  //       dispatch(setUser(response.data));
  //       // console.log(response.data)
  //       // dispatch(setEmailVerified(response.data.isVerified))
  //     } else {
  //       dispatch(logout());
  //     }
  //   } catch (error) {
  //     dispatch(logout());
  //     console.log(error);
  //   } finally {
  //     setIsCheckingUser(false);
  //   }
  // }

  // useEffect(() => {
  //   checkingUser();
  // }, [checkUser, dispatch]);

  // if (isCheckingUser) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-(--color-page-shell) px-4">
  //       <div className="flex flex-col items-center gap-4 rounded-3xl border border-(--color-border) bg-(--color-card) p-8 text-center shadow-lg">
  //         <Loader className="h-12 w-12 text-(--color-button-yellow) animate-spin" />
  //         <div>
  //           <h1 className="text-xl font-semibold text-(--color-header-text)">
  //             Loading Please wait
  //           </h1>
  //           <p className="mt-2 text-(--color-text-muted)">
  //             Please wait, load the page!!!!!
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return children;
}
