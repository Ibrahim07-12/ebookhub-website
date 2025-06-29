import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CategoriesSection />
    </main>
  );
}
