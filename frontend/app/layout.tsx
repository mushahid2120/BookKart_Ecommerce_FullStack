import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";


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
          <div className="w-full max-w-325 bg-(--color-page-shell)">
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
