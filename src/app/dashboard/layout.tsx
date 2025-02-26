import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
