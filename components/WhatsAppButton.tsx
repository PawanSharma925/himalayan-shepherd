import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/hotel";

type Props = {
  label?: string;
  message?: string;
  className?: string;
  variant?: "solid" | "ghost" | "gold";
};

export function WhatsAppButton({
  label = "Inquire on WhatsApp",
  message,
  className = "",
  variant = "solid",
}: Props) {
  const styles =
    variant === "ghost"
      ? "border border-white/50 bg-white/10 text-white hover:bg-white hover:text-ink"
      : variant === "gold"
        ? "bg-gold text-ink hover:bg-gold-deep hover:text-white"
        : "bg-whatsapp text-white hover:brightness-110";

  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium tracking-wide transition ${styles} ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
