import Features from "@/components/sections/features";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Performance from "@/components/sections/performance";
import Samples from "@/components/sections/sample";
import Testimonials from "@/components/sections/testimonials";
import { Header } from "@/components/layout/header";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Samples />
      <Testimonials />
      <Performance />
      <Footer />
    </>
  );
}
