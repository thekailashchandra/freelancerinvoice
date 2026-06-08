interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  /** @deprecated All pages use instant render for speed */
  instant?: boolean;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return <div className={className}>{children}</div>;
}
