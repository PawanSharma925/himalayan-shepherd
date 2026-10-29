export const HOTEL = {
  name: "Himalayan Shepherd",
  legalName: "Hotel Himalayan Shepherd Pvt. Ltd.",
  tagline: "Where Himalayan Serenity Meets Modern Elegance",
  kicker: "Boutique stay · Pokhara, Nepal",
  locationLine: "Pokhara · Fewa Lake · Annapurna trails",
  address: "Lakeside, Pokhara 33700, Nepal",
  email: "stay@himalayanshepherd.com",
  phoneDisplay: "+977 980-000-0000",
  phoneHref: "tel:+9779800000000",
  whatsappNumber: "9779800000000",
  mapEmbed:
    "https://maps.google.com/maps?q=Lakeside%20Pokhara%20Nepal&z=14&output=embed",
  mapLink: "https://maps.google.com/?q=Lakeside+Pokhara+Nepal",
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
  { href: "#amenities", label: "Amenities" },
  { href: "#dining", label: "Dining" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
] as const;
