import { MapPin, Phone, Mail } from "lucide-react";
import { HOTEL } from "@/lib/hotel";
import { MessageTheHouse } from "./MessageTheHouse";

export function Footer() {
  return (
    <footer id="contact" className="bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-5 md:px-8 md:py-24 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10">
        <div>
          <p className="kicker !text-gold">Arrive</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-6 font-serif text-[2.1rem] leading-tight sm:mt-8 sm:text-5xl">
            Your message is ready.
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-8 text-cream/70">
            No booking engine, no platform fees — just a conversation. Your note to
            the hotel fills itself in as you plan your stay. Change anything you
            like, then send it straight to reception.
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <MessageTheHouse />
        </div>

        <div>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-gold" />
              <a href={HOTEL.mapLink} target="_blank" rel="noreferrer" className="hover:text-gold">
                {HOTEL.address}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-gold" />
              <a href={HOTEL.phoneHref} className="hover:text-gold">
                {HOTEL.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-gold" />
              <a href={`mailto:${HOTEL.email}`} className="hover:text-gold">
                {HOTEL.email}
              </a>
            </li>
          </ul>
          <div className="mt-8 h-56 overflow-hidden rounded-2xl bg-ink-soft md:h-64">
            <iframe
              title="Map of Himalayan Shepherd, Pokhara"
              src={HOTEL.mapEmbed}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs tracking-[0.16em] text-cream/45 uppercase sm:flex-row sm:justify-between">
          <span>{HOTEL.legalName}</span>
          <span>Pokhara · Nepal</span>
        </div>
      </div>
    </footer>
  );
}
