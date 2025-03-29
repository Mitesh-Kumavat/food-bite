import Hero from "@/components/_landing/hero"
import FeaturesSection from "@/components/_landing/feature-section"
import Cta from "@/components/_landing/cta"
import Footer from "@/components/_landing/footer"
import Header from "@/components/_landing/header"
import AiInsightsSection from "@/components/_landing/aiInsightsSection"
import HowItWorks from "@/components/_landing/how-it-works"

export default function Home() {
  return (
    <div className="w-auto mx-auto flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto md:px-8">
        <Hero />
        <FeaturesSection />
        <AiInsightsSection/>
        <HowItWorks/>
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
