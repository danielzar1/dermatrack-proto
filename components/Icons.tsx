/**
 * Inline SVG icons — kept here so we don't pull a runtime icon dep into
 * the client bundle. 1em-sized, stroke-based, follow currentColor.
 */
type IconProps = { className?: string; size?: number; strokeWidth?: number };

function I({ children, className = "", size = 18, strokeWidth = 1.7 }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Home: (p: IconProps) => (<I {...p}><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /></I>),
  Patients: (p: IconProps) => (<I {...p}><circle cx="9" cy="8" r="3.4" /><path d="M2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5" /><circle cx="17" cy="9" r="2.6" /><path d="M22 18c-.4-2.4-2-3.8-4-4" /></I>),
  Code: (p: IconProps) => (<I {...p}><path d="M5 3h14v18l-7-4-7 4z" /></I>),
  Protocol: (p: IconProps) => (<I {...p}><path d="M4 5h16v14H4z" /><path d="M4 9h16M9 13h7M9 17h5" /></I>),
  Audit: (p: IconProps) => (<I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>),
  Add: (p: IconProps) => (<I {...p}><path d="M12 5v14M5 12h14" /></I>),
  Search: (p: IconProps) => (<I {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></I>),
  Bell: (p: IconProps) => (<I {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 21a2 2 0 0 0 4 0" /></I>),
  Lock: (p: IconProps) => (<I {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></I>),
  Camera: (p: IconProps) => (<I {...p}><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><circle cx="12" cy="13" r="3.6" /></I>),
  Pill: (p: IconProps) => (<I {...p}><path d="M9 3h6v4l4 9a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-9z" /></I>),
  ChevronRight: (p: IconProps) => (<I {...p}><path d="m9 6 6 6-6 6" /></I>),
  ChevronLeft: (p: IconProps) => (<I {...p}><path d="m15 18-6-6 6-6" /></I>),
  X: (p: IconProps) => (<I {...p}><path d="M18 6 6 18M6 6l12 12" /></I>),
  Check: (p: IconProps) => (<I {...p}><path d="M5 12l5 5L20 7" /></I>),
  Alert: (p: IconProps) => (<I {...p}><path d="M12 8v5M12 16.5v.5" /><path d="M10.3 3.8 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z" /></I>),
  Heart: (p: IconProps) => (<I {...p}><path d="M12 21s-7-4.5-9-9.5C1.5 7 4.5 4 8 4c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.5 0 6.5 3 5 7.5-2 5-9 9.5-9 9.5z" /><circle cx="12" cy="11" r="2.3" /></I>),
  Calendar: (p: IconProps) => (<I {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></I>),
  Eye: (p: IconProps) => (<I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></I>),
  Body: (p: IconProps) => (<I {...p}><circle cx="12" cy="5" r="2.6" /><path d="M12 7.6V15M12 15l-4 6M12 15l4 6M6 10l6 1.5L18 10" /></I>),
  Logout: (p: IconProps) => (<I {...p}><path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></I>),
  Sparkle: (p: IconProps) => (<I {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></I>),
  Trend: (p: IconProps) => (<I {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></I>),
  ZoomIn: (p: IconProps) => (<I {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" /></I>),
  Send: (p: IconProps) => (<I {...p}><path d="m22 2-11 11" /><path d="M22 2 15 22l-4-9-9-4z" /></I>),
};
