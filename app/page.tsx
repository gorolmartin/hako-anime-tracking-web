import { Hero } from "@/components/landing/Hero";
import { FeaturesSection } from "@/components/FeaturesSection/FeaturesSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-app text-text-primary font-sans touch-manipulation">
      <main id="main-content">
        <Hero />
        <FeaturesSection />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}
