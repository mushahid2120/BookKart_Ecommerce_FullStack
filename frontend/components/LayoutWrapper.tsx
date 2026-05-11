"use client";
import store, { persistor } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
// import AuthCheckWrapper from "./AuthCheckWrapper";

const PersistLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-(--color-page-shell) px-4">
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-(--color-border) bg-(--color-card) p-8 text-center shadow-lg">
      <Loader className="h-12 w-12 text-(--color-button-yellow) animate-spin" />
      <div>
        <h1 className="text-xl font-semibold text-(--color-header-text)">
          Loading Please wait
        </h1>
        <p className="mt-2 text-(--color-text-muted)">
          Please wait, load the page!!!!!
        </p>
      </div>
    </div>
  </div>
);

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<PersistLoading />}>
        {/* <AuthCheckWrapper> */}
          <Toaster />
          {children}
        {/* </AuthCheckWrapper> */}
      </PersistGate>
    </Provider>
  );
}
