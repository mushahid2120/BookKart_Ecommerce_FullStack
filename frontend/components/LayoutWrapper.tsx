"use client"
import { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from 'react-hot-toast';


export default function LayoutWrapper({children}:{children:React.ReactNode}) {
  return (
    <PersistGate persistor={persistor} loading={<h2>Loading Please wait...</h2>}>
        <Toaster/>
        {children}
    </PersistGate>
  )
}
