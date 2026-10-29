import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

const MOSAIC = [
  {
    src: "/images/hotel/lobby_and_front_desk/hotel-reception-desk-with-illuminated-sign.jpg",
    alt: "Front desk with the illuminated Himalayan Shepherd emblem",
    className: "col-span-2 aspect-[3/2]",
    object: "object-center",
    sizes: "(max-width: 1024px) 92vw, 1200px",
  },
  {
    src: "/images/hotel/lounge_and_seating/cozy-armchairs-by-window-view.jpg",
    alt: "Yellow lounge chairs by the window looking onto Lakeside streets",
    className: "aspect-[4/3]",
    object: "object-[center_65%]",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 600px",
  },
  {
    src: "/images/hotel/patio_and_rooftop/outdoor-terrace-seating-with-street-view.jpg",
    alt: "Patio seating looking over Pokhara streets",
    className: "aspect-[4/3]",
    object: "object-center",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 600px",
  },
];

export function About() {
  return (
    <section id="about" className="bg-paper px-4 py-16 sm:px-5 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="kicker">The house</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-6 font-serif text-[2rem] leading-tight text-ink sm:mt-8 sm:text-4xl md:text-5xl">
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

        <Reveal delay={0.15} className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {MOSAIC.map((item) => (
            <div
              key={item.src}
              className={`relative overflow-hidden ${item.className}`}
            >
              <SmartImage
                src={item.src}
                alt={item.alt}
                fill
                sizes={item.sizes}
                quality={90}
                className={`object-cover transition duration-700 hover:scale-105 ${item.object}`}
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
