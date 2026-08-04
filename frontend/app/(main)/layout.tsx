import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-325 bg-background">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
