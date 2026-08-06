"use client";
import store, { persistor } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import AuthCheckWrapper from "./AuthCheckWrapper";
import Loading from "./Loading";
// import AuthCheckWrapper from "./AuthCheckWrapper";

const PersistLoading = () => (
  <Loading />
);

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<PersistLoading />}>
        <AuthCheckWrapper>
          <Toaster />
          {children}
        </AuthCheckWrapper>
      </PersistGate>
    </Provider>
  );
}
