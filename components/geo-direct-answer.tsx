type GeoDirectAnswerProps = {
  /** Two-to-three sentence direct answer for AI extraction and readers. */
  answer: string;
};

/**
 * Blockquote direct-answer block for generative engine optimization.
 * Matches the AI content template: > **Direct Answer:** [summary]
 */
export function GeoDirectAnswer({ answer }: GeoDirectAnswerProps) {
  return (
    <blockquote
      className="geo-direct-answer mt-6 border-l-4 border-primary/60 bg-muted/40 px-5 py-4 not-italic"
      cite="#contextual-architecture"
    >
      <p className="geo-direct-answer-text text-base font-semibold leading-relaxed text-foreground">
        <strong>Direct Answer:</strong> {answer}
      </p>
    </blockquote>
  );
}
