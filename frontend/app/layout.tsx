import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-on-surface`}>
        <div className="flex justify-center">
          <div className="w-full max-w-325 bg-background">
            <LayoutWrapper>{children}</LayoutWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
