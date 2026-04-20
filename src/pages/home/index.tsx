import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { SocialProof } from "./components/SocialProof";
import { Problem } from "./components/Problem";
import { Solution } from "./components/Solution";
import { DashboardPreview } from "./components/DashboardPreview";
import { HowItWorks } from "./components/HowItWorks";
import { Benefits } from "./components/Benefits";
import { BeforeAfter } from "./components/BeforeAfter";
import { WhyTrustUs } from "./components/WhyTrustUs";
import { Integrations } from "./components/Integrations";
import { BusinessModel } from "./components/BusinessModel";
import { CTA } from "./components/CTA";
import { ContactForm } from "./components/ContactForm";
import { Footer } from "./components/Footer";
import { ShippingPartners } from "./components/ShippingPartners";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      <Navigation />
      <Hero />
      <SocialProof />
      <div id="problem">
        <Problem />
      </div>
      <div id="solution">
        <Solution />
      </div>
      <DashboardPreview />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <Benefits />
      <BeforeAfter />
      <WhyTrustUs />
      <Integrations />
      <ShippingPartners />
      <BusinessModel />
      <CTA />
      <div id="contact">
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}
