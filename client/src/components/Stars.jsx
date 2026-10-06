export default function Stars({ value = 5 }) {
  const full = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      <span>{"★".repeat(full)}</span>
      <span className="dim">{"★".repeat(5 - full)}</span>
    </span>
  );
}
