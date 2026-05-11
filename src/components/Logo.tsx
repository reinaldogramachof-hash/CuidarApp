import { colors } from '../styles/theme';

export type LogoProps = {
  size?: number;
};

export const Logo = ({ size = 80 }: LogoProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="24" fill="url(#paint0_linear)" />
    <path
      d="M50 72C50 72 26 54 26 38.5C26 29.94 32.94 23 41.5 23C46.3 23 50 25.8 50 25.8C50 25.8 53.7 23 58.5 23C67.06 23 74 29.94 74 38.5C74 54 50 72 50 72Z"
      fill="white"
    />
    <path
      d="M50 72C50 72 26 54 26 38.5C26 29.94 32.94 23 41.5 23C46.3 23 50 25.8 50 25.8L50 72Z"
      fill="white"
      fillOpacity="0.7"
    />
    <path
      d="M43 45H57M50 38V52"
      stroke={colors.accent}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor={colors.primary} />
        <stop offset="1" stopColor={colors.primaryDark} />
      </linearGradient>
    </defs>
  </svg>
);
