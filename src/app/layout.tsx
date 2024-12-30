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
          <Header />
          <main className="mt-24 flex min-h-screen flex-col">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
