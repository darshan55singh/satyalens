import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AnalyzerCard from "@/components/AnalyzerCard";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header />
      <main>
        <HeroSection />
        <AnalyzerCard />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
