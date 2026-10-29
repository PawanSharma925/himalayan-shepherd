import { Phone } from "lucide-react";
import { HOTEL, whatsappHref } from "@/lib/hotel";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white/92 px-3 py-3 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={HOTEL.phoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-cream"
        >
          <Phone className="h-4 w-4" />
          Call now
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp py-3 text-sm font-medium text-white"
        >
          WhatsApp inquiry
        </a>
      </div>
    </div>
  );
}
