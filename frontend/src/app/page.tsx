import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { CodeDemo } from "@/components/sections/code-demo";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Extensions } from "@/components/sections/extensions";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { HomeJsonLd } from "@/components/site/structured-data";

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <Features />
        <CodeDemo />
        <HowItWorks />
        <Extensions />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
