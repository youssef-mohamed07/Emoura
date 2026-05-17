interface StarsProps {
  rating: number;
}

export default function Stars({ rating }: StarsProps) {
  return (
    <div className="text-sm text-gold" aria-label={`Rating ${rating} of 5`}>
      {"★".repeat(rating)}
      <span className="text-stone-300">{"★".repeat(5 - rating)}</span>
    </div>
  );
}
