import { Header } from "@/components/layout/header";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <TRPCReactProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
            <Header />
            {children}
          </div>
        </TRPCReactProvider>
        <Footer />
      </body>
    </html>
  );
}

const Footer = () => {
  return (
    <footer className="bg-muted py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Plate Play. All rights reserved.</p>
      </div>
    </footer>
  );
};
