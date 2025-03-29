import Hero from "@/components/_landing/hero"
import FeaturesSection from "@/components/_landing/feature-section"
import FaqSection from "@/components/_landing/faq"
import Cta from "@/components/_landing/cta"
import Footer from "@/components/_landing/footer"
import Header from "@/components/_landing/header"

export default function Home() {
  return (
    <div className="w-auto mx-auto flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto md:px-8">
        <Hero />
        <FeaturesSection />
        <FaqSection />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
