import { Reveal } from "./Reveal";

const MOSAIC = [
  {
    src: "/images/hotel/lobby_and_front_desk/hotel-reception-desk-with-logo-signage.jpg",
    alt: "Illuminated Himalayan Shepherd emblem above the reception desk",
    className: "md:col-span-2 md:row-span-2 min-h-[280px]",
  },
  {
    src: "/images/hotel/lounge_and_seating/two-yellow-armchairs-round-table.jpg",
    alt: "Yellow lounge chairs beside a round timber table",
    className: "min-h-[180px]",
  },
  {
    src: "/images/hotel/patio_and_rooftop/outdoor-terrace-seating-with-street-view.jpg",
    alt: "Rooftop terrace seating looking over Pokhara streets",
    className: "min-h-[180px]",
  },
  {
    src: "/images/hotel/closets_and_details/wooden-wardrobe-with-rattan-detailing.jpg",
    alt: "Timber wardrobe with rattan panel detailing",
    className: "md:col-span-2 min-h-[200px]",
  },
];

export function About() {
  return (
    <section id="about" className="bg-paper px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="kicker">The house</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-8 font-serif text-4xl leading-tight text-ink md:text-5xl">
            A pause between Fewa Lake and the Annapurna trail.
          </h2>
          <div className="mt-8 space-y-5 text-[17px] leading-8 text-ink-soft">
            <p>
              Himalayan Shepherd is a small, considered hotel in Pokhara — close
              enough to the lake for an evening walk, close enough to the hills
              for a dawn start, and quiet enough that neither has to rush you.
            </p>
            <p>
              The rooms are timber, linen, and soft light. The lounge opens to
              the street breeze. Breakfast is unhurried. We keep the house
              personal on purpose: no platforms, no booking engine — just a
              conversation, then a key.
            </p>
            <p>
              Come for the mountains. Stay for the still hour after you arrive.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="grid grid-cols-2 gap-3 md:gap-4">
          {MOSAIC.map((item) => (
            <div
              key={item.src}
              className={`relative overflow-hidden ${item.className}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
