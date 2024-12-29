import { Header } from "@/components/layout/header";

// user page
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      <div>{children}</div>
    </main>
  );
}
