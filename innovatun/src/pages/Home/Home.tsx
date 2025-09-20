import HeroSection from "../../components/Home/HeroSection";
import FeatureSection from "../../components/Home/FeatureSection";
import PicingHeroSection from "../../components/Home/PicingHeroSection";
import PicingSection from "../../components/Home/PicingSection";
import FaQSection from "../../components/Home/FaQSection";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* picing section */}

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <PicingHeroSection />

        {/* Pricing Section */}
        <PicingSection />

        {/* FAQ Section */}
        <FaQSection />
      </div>
    </div>
  );
}
