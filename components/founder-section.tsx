import Image from "next/image";
import Link from "next/link";
import { founder } from "@/data/founder";

export function FounderSection() {
  return (
    <section className="mt-12 border-t border-border/40 pt-10" aria-labelledby="founder-heading">
      <h2 id="founder-heading" className="text-lg font-semibold tracking-tight">
        Built by {founder.name}
      </h2>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        {founder.photo ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border/50 bg-muted">
            <Image
              src={founder.photo}
              alt={founder.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ) : (
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground"
            aria-hidden
          >
            {founder.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{founder.role}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {founder.bio}
          </p>
          {founder.website ? (
            <p className="mt-3 text-sm">
              <Link
                href={founder.website}
                className="font-medium text-foreground underline-offset-4 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
