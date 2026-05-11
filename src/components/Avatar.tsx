import { colors, typography } from '../styles/theme';

export type AvatarProps = {
  src?: string;
  size?: number;
  initials?: string;
  alt?: string;
};

export const Avatar = ({ src, size = 40, initials = '?', alt = '' }: AvatarProps) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      background: colors.primaryLight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: typography.display,
      fontWeight: 800,
      fontSize: size * 0.35,
      color: colors.primary,
    }}
  >
    {src ? <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
  </div>
);
