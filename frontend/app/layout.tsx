import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const roboto = Roboto_Mono({
  subsets: ["latin"],
  display: "swap"
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={roboto.className}
      >
        <div className="flex justify-center">
          <div className=" w-full max-w-325 bg-[#fffbeb]">
            <LayoutWrapper>
              <Header />
              {children}
              <Footer />
            </LayoutWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
