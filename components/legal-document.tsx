import type { ReactNode } from "react";

type LegalDocumentProps = {
  title: string;
  children: ReactNode;
};

export function LegalDocument({ title, children }: LegalDocumentProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-sm leading-relaxed dark:prose-invert">
        {children}
      </div>
    </div>
  );
}
