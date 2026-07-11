import Image from "next/image";
import Link from "next/link";
import { founder } from "@/data/founder";

export function FounderSection() {
  return (
    <section
      className="mt-12 rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8"
      aria-labelledby="founder-heading"
    >
      <h2 id="founder-heading" className="text-xl font-bold tracking-tight">
        Who built Invoice for Freelance?
      </h2>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        {founder.photo ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={founder.photo}
              alt={founder.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/40 text-2xl font-semibold text-muted-foreground"
            aria-hidden
          >
            {founder.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{founder.name}</p>
          <p className="text-sm text-primary">{founder.role}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {founder.bio}
          </p>
          {founder.website ? (
            <p className="mt-3 text-sm">
              <Link
                href={founder.website}
                className="font-medium text-foreground hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more about {founder.name}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
