interface BrandLogoProps {
  compact?: boolean;
  dark?: boolean;
}

export default function BrandLogo({ compact = false, dark = false }: BrandLogoProps) {
  const textMain = dark ? "text-white" : "text-rosedark";
  const textSub = dark ? "text-[#f2d39a]" : "text-rosebrand";
  const size = compact ? "h-9 w-9 sm:h-11 sm:w-11" : "h-12 w-12 sm:h-14 sm:w-14";
  const svgSize = compact ? "h-6 w-6 sm:h-8 sm:w-8" : "h-7 w-7 sm:h-9 sm:w-9";
  return (
    <span className="flex items-center gap-2 text-start sm:gap-3">
      <span
        className={`relative grid ${size} place-items-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#f4dca8,#d6b15f_50%,#a9783d)] shadow-gold`}
      >
        <svg viewBox="0 0 64 64" className={svgSize} aria-hidden="true">
          <path
            d="M32 8C29 18 18 24 18 36c0 8 6 14 14 14s14-6 14-14C46 24 35 18 32 8z"
            fill="#fffaf2"
          />
          <path
            d="M32 16c-3 7-10 11-10 19 0 6 4 10 10 10 4 0 8-2 9-6-2 2-4 3-7 3-5 0-8-3-8-8 0-7 4-12 6-18z"
            fill="#c79a83"
            opacity=".7"
          />
          <path
            d="M22 14l2-5 2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3z"
            fill="#fffaf2"
          />
        </svg>
      </span>
      <span>
        <span
          className={`block text-2xl font-bold leading-none display-font sm:text-3xl ${textMain}`}
        >
          Emoura
        </span>
        <span className={`block text-[10px] font-bold tracking-[.12em] sm:text-[11px] ${textSub}`}>
          NATURAL BEAUTY
        </span>
      </span>
    </span>
  );
}
