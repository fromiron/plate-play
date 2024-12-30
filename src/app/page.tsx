import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import Performance from "@/components/sections/performance";
import Samples from "@/components/sections/sample";
import Testimonials from "@/components/sections/testimonials";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Samples />
      <Testimonials />
      <Performance />
      <Footer />
    </>
  );
}
