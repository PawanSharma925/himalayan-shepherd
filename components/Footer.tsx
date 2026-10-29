import { MapPin, Phone, Mail } from "lucide-react";
import { HOTEL } from "@/lib/hotel";
import { WhatsAppButton } from "./WhatsAppButton";
import { SmartImage } from "./SmartImage";

export function Footer() {
  return (
    <footer id="contact" className="bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2">
        <div>
          <div className="relative mb-8 h-16 w-16 overflow-hidden rounded-full bg-cream ring-1 ring-white/15">
            <SmartImage
              src="/brand/logo.jpg"
              alt={`${HOTEL.name} emblem`}
              fill
              sizes="64px"
              quality={80}
              className="object-cover"
            />
          </div>
          <p className="kicker !text-gold">Arrive</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-8 font-serif text-4xl">Write, call, or find us in Pokhara.</h2>
          <p className="mt-5 max-w-md text-cream/70">
            We do not take online reservations. Tell us the dates you have in
            mind and we will answer personally.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
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
          <div className="mt-8">
            <WhatsAppButton label="WhatsApp the house" />
          </div>
        </div>
        <div className="min-h-[320px] overflow-hidden bg-ink-soft">
          <iframe
            title="Map of Himalayan Shepherd, Pokhara"
            src={HOTEL.mapEmbed}
            className="h-full min-h-[320px] w-full border-0 grayscale contrast-125"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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
