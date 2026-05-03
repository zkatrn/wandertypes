import { Star, StarHalf } from "lucide-react";

type StarRatingProps = {
  score: number; // 0-10
};

export function StarRating({ score }: StarRatingProps) {
  // Convert 0-10 to 0-5 stars
  const stars = score / 2;
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-amber-400 text-amber-400" />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <StarHalf className="w-5 h-5 fill-amber-400 text-amber-400" />
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-stone-300" />
      ))}
      
      <span className="text-sm text-stone-600 ml-2">
        {stars.toFixed(1)}/5
      </span>
    </div>
  );
}
