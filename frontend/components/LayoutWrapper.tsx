"use client"
import store, { persistor } from "@/store/store";
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from 'react-hot-toast';


export default function LayoutWrapper({children}:{children:React.ReactNode}) {
  return (
        <Provider store={store}>
    <PersistGate persistor={persistor} loading={<h2>Loading Please wait...</h2>}>
        <Toaster/>
        {children}
    </PersistGate>
        </Provider>
  )
}
