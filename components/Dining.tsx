import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

const DINING = [
  {
    src: "/images/hotel/dining_and_food_court/cafe-seating-with-blue-cushioned-benches.jpg",
    alt: "Cafe booth seating with blue cushions",
    title: "Breakfast court",
  },
  {
    src: "/images/hotel/dining_and_food_court/cappuccino-with-heart-latte-art.jpg",
    alt: "Cappuccino with heart latte art",
    title: "Barista coffee",
  },
  {
    src: "/images/hotel/dining_and_food_court/restaurant-dining-room-with-colorful-chairs.jpg",
    alt: "Dining room with colorful chairs and timber tables",
    title: "Open dining",
  },
  {
    src: "/images/hotel/dining_and_food_court/hotel-breakfast-area-with-tables-chairs.jpg",
    alt: "Hotel breakfast tables in morning light",
    title: "Morning light",
  },
];

export function Dining() {
  return (
    <section id="dining" className="bg-ink px-5 py-24 text-cream md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="kicker !text-gold">Table</p>
            <div className="gold-rule mt-5" />
            <h2 className="mt-8 font-serif text-4xl md:text-5xl">
              Continental mornings, local plates, coffee with a view of the day beginning.
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-cream/75">
            The dining court is bright, informal, and close to the rooms. Start
            with barista coffee and a slow breakfast, then step out toward Fewa
            Lake — or stay an extra hour at the table. Nothing here is hurried.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-4">
          {DINING.map((item, index) => (
            <Reveal key={item.src} delay={index * 0.08} className={index === 0 ? "md:col-span-2" : ""}>
              <figure className={`relative overflow-hidden ${index === 0 ? "h-[420px]" : "h-[320px]"}`}>
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                  className="object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-ink/80 to-transparent p-5 font-serif text-xl">
                  {item.title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
