import Image from 'next/image';

interface LogoProps {
  /** Height in pixels — width scales proportionally (logo aspect ratio 5:1) */
  height?: number;
  className?: string;
}

export function Logo({ height = 32, className }: LogoProps) {
  // Cropped SVG viewBox is 800×160 → aspect ratio 5:1
  const width = Math.round(height * (800 / 160));

  return (
    <>
      {/* Dark logo — shown in light mode, hidden in dark mode */}
      <Image
        src="/logo-dark.svg"
        alt="MoveFox"
        width={width}
        height={height}
        className={`dark:hidden ${className ?? ''}`}
        priority
      />
      {/* Light logo — hidden in light mode, shown in dark mode */}
      <Image
        src="/logo-light.svg"
        alt="MoveFox"
        width={width}
        height={height}
        className={`hidden dark:block ${className ?? ''}`}
        priority
      />
    </>
  );
}
