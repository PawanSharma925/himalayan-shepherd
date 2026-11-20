import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

const DINING = [
  {
    src: "/images/hotel/dining/sunlit-himalayan-shepherd-dining-room-2.jpg",
    alt: "Sunlit dining room at Himalayan Shepherd",
    className: "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[28rem]",
    sizes: "(max-width: 640px) 100vw, 66vw",
  },
  {
    src: "/images/hotel/dining/himalayan-shepherd-hotel-interior-1.jpg",
    alt: "Dining corridor and seating at Himalayan Shepherd",
    className: "aspect-[4/5] sm:aspect-auto sm:min-h-[13.5rem]",
    sizes: "(max-width: 640px) 100vw, 33vw",
  },
  {
    src: "/images/hotel/dining/bright-himalayan-shepherd-dining-room-3.jpg",
    alt: "Bright dining court by the window at Himalayan Shepherd",
    className: "aspect-[4/5] sm:aspect-auto sm:min-h-[13.5rem]",
    sizes: "(max-width: 640px) 100vw, 33vw",
  },
  {
    src: "/images/hotel/dining/warm-taupe-interior-with-glazed-partition.jpg",
    alt: "Warm taupe dining interior at Himalayan Shepherd",
    className: "sm:col-span-3 aspect-[16/7] sm:aspect-[21/7] sm:min-h-[14rem]",
    sizes: "(max-width: 640px) 100vw, 100vw",
  },
];

export function Dining() {
  return (
    <section id="dining" className="bg-ink px-4 py-16 text-cream sm:px-5 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="kicker !text-gold">Table</p>
            <div className="gold-rule mt-5" />
            <h2 className="mt-6 font-serif text-[2rem] leading-tight sm:mt-8 sm:text-4xl md:text-5xl">
              Continental mornings, local plates, coffee with a view of the day beginning.
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-cream/75">
            The dining court is bright, informal, and close to the rooms. Start
            with barista coffee and a slow breakfast, then step out toward Fewa
            Lake — or stay an extra hour at the table. Nothing here is hurried.
          </p>
        </Reveal>

        <div className="mt-12 grid min-w-0 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4">
          {DINING.map((item, index) => (
            <Reveal key={item.src} delay={index * 0.08} className={`min-w-0 ${item.className}`}>
              <div className="group relative h-full min-h-[14rem] overflow-hidden">
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={item.sizes}
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
