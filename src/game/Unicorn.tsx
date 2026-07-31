interface UnicornProps {
  row: number;
  col: number;
  dir: 1 | -1;
  cols: number;
  rows: number;
}

export function Unicorn({ row, col, dir, cols, rows }: UnicornProps) {
  const left = ((col + 0.5) / cols) * 100;
  const top = ((row + 0.5) / rows) * 100;
  return (
    <div
      className="unicorn"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: `translate(-50%, -86%) scaleX(${dir})`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <defs>
          <linearGradient id="mane" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="40%" stopColor="#34d399" />
            <stop offset="75%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        <path
          d="M18 40 C16 30 22 22 32 22 C40 22 46 26 48 32 L54 30 L54 36 L48 38 C47 46 40 52 32 52 C24 52 18 48 18 40 Z"
          fill="url(#body)"
          stroke="#cbd5e1"
          strokeWidth="1.2"
        />
        <path
          d="M30 22 C28 14 30 8 34 6 C33 12 36 16 40 16 C44 16 47 12 46 6 C50 9 51 15 48 20 Z"
          fill="url(#mane)"
        />
        <path d="M44 18 L48 6 L50 19 Z" fill="#fbbf24" />
        <circle cx="40" cy="34" r="2.1" fill="#0f172a" />
        <circle cx="40.7" cy="33.4" r="0.7" fill="#fff" />
        <path d="M48 36 L54 33 L54 39 Z" fill="url(#body)" stroke="#cbd5e1" strokeWidth="0.8" />
        <path d="M22 50 L24 58 M30 52 L31 58 M38 52 L39 58 M45 50 L47 58"
          stroke="#e2e8f0" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M50 24 Q56 22 58 16 Q54 20 52 22 Z" fill="url(#mane)" opacity="0.9" />
      </svg>
    </div>
  );
}
