export const HOTEL = {
  name: "Hotel Himalayan Shepherd",
  legalName: "Hotel Himalayan Shepherd Pvt. Ltd.",
  tagline: "Where Himalayan Serenity Meets Modern Elegance",
  kicker: "Boutique stay · Pokhara, Nepal",
  locationLine: "Pokhara · Fewa Lake · Annapurna trails",
  address: "15 street / Lakeside Road, Lakeside, Pokhara 33700, Nepal",
  email: "stay@himalayanshepherd.com",
  phoneDisplay: "+977 970-5451660",
  phoneHref: "tel:+9779705451660",
  whatsappNumber: "9779705451660",
  mapEmbed:
    "https://maps.google.com/maps?q=Lakeside%20Road%20Lakeside%20Pokhara%20Nepal&z=15&output=embed",
  mapLink: "https://maps.google.com/?q=Lakeside+Road+Lakeside+Pokhara+Nepal",
} as const;

export const whatsappHref = (message?: string) => {
  const text =
    message ??
    "Hello Himalayan Shepherd, I would like to inquire about a stay in Pokhara.";
  return `https://wa.me/${HOTEL.whatsappNumber}?text=${encodeURIComponent(text)}`;
};

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#rooms", label: "Rooms" },
  { href: "#dining", label: "Dining" },
  { href: "#gallery", label: "Gallery" },
  { href: "#explore", label: "Pokhara" },
  { href: "#forecast", label: "Live from Pokhara" },
  { href: "#contact", label: "Contact" },
] as const;
