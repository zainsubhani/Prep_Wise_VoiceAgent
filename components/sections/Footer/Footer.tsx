import { finalCtaContent } from "@/constants/final-cta";

export default function Footer() {
  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-6 py-5 text-sm text-white/30 sm:flex-row">
      <p>{finalCtaContent.footer.copyright}</p>

      <div className="flex items-center gap-4">
        {finalCtaContent.footer.links.map((link) => (
          <button
            key={link}
            className="transition hover:text-white/60"
            type="button"
          >
            {link}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-cyan-400">
        <span className="h-2 w-2 rounded-full bg-cyan-400" />
        <span>{finalCtaContent.footer.status}</span>
      </div>
    </footer>
  );
}