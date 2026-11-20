import { About } from "@/components/About";
import { Dining } from "@/components/Dining";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { GettingHere } from "@/components/GettingHere";
import { Hero } from "@/components/Hero";
import { StayDock } from "@/components/StayDock";
import { MountainForecast } from "@/components/MountainForecast";
import { Navbar } from "@/components/Navbar";
import { PokharaMap } from "@/components/PokharaMap";
import { Rooms } from "@/components/Rooms";
import { TripCard } from "@/components/TripCard";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[100vw] overflow-x-clip pb-28 md:pb-0">
        <Hero />
        <About />
        <Rooms />
        <Dining />
        <Gallery />
        <PokharaMap />
        <GettingHere />
        <MountainForecast />
        <Footer />
      </main>
      <StayDock />
      <TripCard />
    </>
  );
}
