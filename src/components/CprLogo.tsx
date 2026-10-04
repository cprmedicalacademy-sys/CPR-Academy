import React from 'react';

interface CprLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
}

export const CprLogo: React.FC<CprLogoProps> = ({ className = '', size = 'md' }) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 54
      : size === 'lg'
      ? 100
      : size === 'xl'
      ? 130
      : 80;

  return (
    <div
      className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 400 400"
        width={pixelSize}
        height={pixelSize}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
        aria-label="CPR Medical Academy - Centre for Post-gRaduation (CPR) Logo"
      >
        {/* Outer Circular Badge */}
        <circle
          cx="200"
          cy="200"
          r="194"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="2.5"
        />

        {/* 1. STETHOSCOPE HEADSET (Royal Blue) */}
        {/* Left Ear Tip */}
        <ellipse cx="68" cy="88" rx="4.5" ry="3.5" fill="#0b4ea2" transform="rotate(-15 68 88)" />
        {/* Right Ear Tip */}
        <ellipse cx="124" cy="88" rx="4.5" ry="3.5" fill="#0b4ea2" transform="rotate(15 124 88)" />

        {/* Binaural Metallic Tubes in Royal Blue */}
        <path
          d="M 69 90 C 42 125, 45 168, 96 195"
          stroke="#0b4ea2"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 123 90 C 138 125, 130 168, 96 195"
          stroke="#0b4ea2"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Joint Connector Block */}
        <rect x="93" y="192" width="6.5" height="9" rx="1.5" fill="#0b4ea2" />

        {/* 2. FLEXIBLE TUBE & ECG HEARTBEAT (Bright Crimson Red) */}
        <path
          d="M 96.2 201 L 96.2 238 C 96.2 254, 106 254, 118 254 L 194 254 L 202 254 L 208 261 L 221 214 L 236 295 L 249 239 L 257 254 L 314 254"
          stroke="#e51b24"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 3. STETHOSCOPE BELL / CHEST PIECE (Royal Blue) */}
        <circle cx="330" cy="254" r="15" fill="#0b4ea2" />

        {/* 4. MAIN BOLD LETTERS: CPR */}
        {/* Letter C (Royal Blue) */}
        <path
          d="M 196 98 C 190 92, 180 87, 168 87 C 145 87, 126 106, 126 138 C 126 172, 146 192, 172 192 C 185 192, 194 186, 200 178 C 200 174, 195 170, 190 170 C 185 174, 179 177, 171 177 C 153 177, 140 162, 140 138 C 140 114, 153 102, 168 102 C 176 102, 182 105, 186 109 C 190 113, 194 113, 197 109 C 198 105, 198 100, 196 98 Z"
          fill="#0b4ea2"
        />

        {/* Letter P (Bright Crimson Red) */}
        <path
          d="M 224 87 C 215 87, 208 92, 204 97 C 203 98, 204 100, 206 100 C 209 97, 214 95, 219 95 L 219 178 C 219 184, 213 186, 208 186 C 206 186, 205 188, 205 190 C 205 192, 207 192, 211 192 L 235 192 C 239 192, 241 192, 241 190 C 241 188, 240 186, 238 186 C 233 186, 227 184, 227 178 L 227 151 L 238 151 C 258 151, 274 139, 274 119 C 274 99, 258 87, 238 87 L 224 87 Z M 227 101 L 237 101 C 250 101, 260 108, 260 119 C 260 130, 250 137, 237 137 L 227 137 L 227 101 Z"
          fill="#e51b24"
        />

        {/* Letter R (Royal Blue) */}
        <path
          d="M 298 87 C 289 87, 282 92, 278 97 C 277 98, 278 100, 280 100 C 283 97, 288 95, 293 95 L 293 178 C 293 184, 287 186, 282 186 C 280 186, 279 188, 279 190 C 279 192, 281 192, 285 192 L 309 192 C 313 192, 315 192, 315 190 C 315 188, 314 186, 312 186 C 307 186, 301 184, 301 178 L 301 149 L 313 149 C 322 149, 328 153, 332 163 L 340 182 C 343 189, 347 192, 355 192 C 359 192, 361 190, 361 188 C 361 185, 357 182, 354 180 C 347 174, 343 166, 338 156 C 334 148, 328 143, 320 141 C 334 137, 346 128, 346 114 C 346 97, 331 87, 312 87 L 298 87 Z M 301 99 L 311 99 C 323 99, 333 105, 333 114 C 333 123, 323 133, 311 133 L 301 133 L 301 99 Z"
          fill="#0b4ea2"
        />

        {/* 5. MEDICAL ACADEMY (Bold Cursive Script in Black) */}
        <text
          x="248"
          y="224"
          textAnchor="middle"
          fontFamily="'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', 'Caveat', cursive, sans-serif"
          fontSize="29"
          fontWeight="bold"
          fontStyle="italic"
          fill="#111827"
          letterSpacing="0.2"
        >
          Medical Academy
        </text>

        {/* 6. CENTRE FOR POST-GRADUATION (CPR) */}
        <text
          x="200"
          y="318"
          textAnchor="middle"
          fontFamily="'Times New Roman', Times, serif"
          fontSize="16.5"
          fontWeight="bold"
          letterSpacing="-0.2"
        >
          <tspan fill="#0b4ea2">Centre for </tspan>
          <tspan fill="#e51b24">Post-gRaduation</tspan>
          <tspan fill="#0b4ea2"> (CPR)</tspan>
        </text>
      </svg>
    </div>
  );
};
