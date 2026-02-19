import "./landing.css";

import HeroSection from "./HeroSection";
import MarqueeStrip from "./MarqueeStrip";
import StatsSection from "./StatsSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturedFields from "./FeaturedFields";
import FeaturesSection from "./FeaturesSection";
import TestimonialSection from "./TestimonialSection";
import CtaBanner from "./CtaBanner";
import FooterSection from "./FooterSection";

// Glow divider reusable
const GlowDivider = () => (
  <div className="max-w-7xl mx-auto px-6 lg:px-12">
    <div className="lp-glow-line" />
  </div>
);

const LandingPage = () => {
  return (
    <div
      className="lp-body lp-grain"
      style={{ background: "var(--background)" }}
    >
      <HeroSection />
      <MarqueeStrip />
      <StatsSection />
      <GlowDivider />
      <HowItWorksSection />
      <GlowDivider />
      <FeaturedFields />
      <GlowDivider />
      <FeaturesSection />
      <GlowDivider />
      <TestimonialSection />
      <CtaBanner />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
