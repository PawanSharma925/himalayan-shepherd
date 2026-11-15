import { About } from "@/components/About";
import { Amenities } from "@/components/Amenities";
import { Dining } from "@/components/Dining";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { MobileActionBar } from "@/components/MobileActionBar";
import { MountainForecast } from "@/components/MountainForecast";
import { Navbar } from "@/components/Navbar";
import { Rooms } from "@/components/Rooms";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Hero />
        <MountainForecast />
        <About />
        <Rooms />
        <Amenities />
        <Dining />
        <Gallery />
        <Footer />
      </main>
      <MobileActionBar />
    </>
  );
}
