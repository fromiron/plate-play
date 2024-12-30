import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="text-stone-800">
        <TRPCReactProvider>
          <main className="flex min-h-screen flex-col">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
