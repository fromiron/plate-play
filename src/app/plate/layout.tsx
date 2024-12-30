import { Header } from "@/components/layout/header";
import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isWide />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
