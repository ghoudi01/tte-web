import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { Problem } from "./components/Problem";
import { Solution } from "./components/Solution";
import { Process } from "./components/Process";
import { Features } from "./components/Features";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { CTA } from "./components/CTA";
import { Contact } from "./components/Contact";
import { useState, useEffect } from "react";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-accent/60 via-accent to-accent/60 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function Home() {
  const { dir } = useLanguage();

  useEffect(() => {
    const handleAnchor = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    handleAnchor();
    window.addEventListener("hashchange", handleAnchor);
    return () => window.removeEventListener("hashchange", handleAnchor);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-accent" dir={dir}>
      <ScrollProgress />
      <Navigation />
      <main className="relative pt-16 md:pt-20">
        <Hero />
        <TrustBar />
        <div id="problem">
          <Problem />
        </div>
        <div id="solution">
          <Solution />
        </div>
        <div id="how-it-works">
          <Process />
        </div>
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
