import { ExternalLink } from "lucide-react";

const universeSites = [
  { label: "AURALIS", href: "https://auralis-eternal-light.lovable.app/" },
  { label: "EDU", href: "https://edu-eternal-dominion-universe.vercel.app" },
  { label: "E16 Portal", href: "https://e16super.netlify.app/" },
  { label: "Eureka Space", href: "https://eurekaspace.netlify.app/" },
  { label: "Iris Worlds", href: "https://irisworlds.netlify.app/" },
  { label: "Game of Mina", href: "https://game-of-mina.netlify.app/" },
  { label: "Orbital Eternity", href: "https://orbital-eternity.netlify.app/" },
  { label: "Genesis Vault", href: "https://note.com/gensnotes" },
];

const auralisMembers = [
  { label: "Kate Patton", href: "https://katepatton.lovable.app" },
  { label: "Lillie Ardent", href: "https://lillieardentsuper.lovable.app" },
  { label: "Ninny Offenbach", href: "https://ninnyoffenbach.lovable.app" },
  { label: "Kate Claudia", href: "https://kate1st.netlify.app/" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-white/50 transition-colors hover:text-pink-400"
    >
      <span className="text-[11px] leading-relaxed tracking-wide">{children}</span>
      <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-60" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0f]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
        {/* Universe Sites */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-500/70">
            Universe Sites
          </h3>
          <ul className="flex flex-col gap-1.5">
            {universeSites.map((site) => (
              <li key={site.href}>
                <FooterLink href={site.href}>{site.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* AURALIS Members */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-500/70">
            AURALIS Members
          </h3>
          <ul className="flex flex-col gap-1.5">
            {auralisMembers.map((member) => (
              <li key={member.href}>
                <FooterLink href={member.href}>{member.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <p className="mx-auto max-w-5xl px-6 py-4 text-center text-[10px] tracking-wider text-white/20">
          &copy; {new Date().getFullYear()} Laylaland &mdash; Pink Voltage
        </p>
      </div>
    </footer>
  );
}
