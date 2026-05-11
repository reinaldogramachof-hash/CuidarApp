import type { ReactNode } from 'react';
import { typography } from '../../styles/theme';

export type BadgeProps = {
  children: ReactNode;
  color: string;
  background: string;
  fontSize?: number;
};

export const Badge = ({ children, color, background, fontSize = 11 }: BadgeProps) => (
  <span
    style={{
      background,
      color,
      borderRadius: 20,
      padding: '3px 10px',
      fontSize,
      fontFamily: typography.body,
      fontWeight: 600,
      letterSpacing: '0.3px',
    }}
  >
    {children}
  </span>
);
