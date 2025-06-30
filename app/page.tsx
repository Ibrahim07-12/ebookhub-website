import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { AboutSection } from "../components/AboutSection";
import { TestimonialSection } from "../components/TestimonialSection";
import { ContactSection } from "../components/ContactSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <TestimonialSection />
      <ContactSection />
    </main>
  );
}
