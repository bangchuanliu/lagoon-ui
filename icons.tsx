// Lagoon UI - 线条图标（接近 SF Symbols），来自 Cine 的 src/ui.tsx。
// 用法：<Icon name="search" />。颜色跟随文字颜色（currentColor）。
import type { CSSProperties, ReactNode } from "react";

const paths = {
  list: <><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  heart: <path d="M12 20s-7.2-4.4-9.3-9.1A5.1 5.1 0 0112 5.7a5.1 5.1 0 019.3 5.2C19.2 15.6 12 20 12 20z" />,
  heartFill: <path d="M12 20s-7.2-4.4-9.3-9.1A5.1 5.1 0 0112 5.7a5.1 5.1 0 019.3 5.2C19.2 15.6 12 20 12 20z" fill="currentColor" />,
  film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
  people: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.6" /><path d="M16 14.2c2.8.3 5 2.6 5 5.8" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  grid3: <><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="10" y="3" width="5" height="5" rx="1" /><rect x="17" y="3" width="4" height="5" rx="1" /><rect x="3" y="10" width="5" height="5" rx="1" /><rect x="10" y="10" width="5" height="5" rx="1" /><rect x="17" y="10" width="4" height="5" rx="1" /><rect x="3" y="17" width="5" height="4" rx="1" /><rect x="10" y="17" width="5" height="4" rx="1" /><rect x="17" y="17" width="4" height="4" rx="1" /></>,
  tag: <><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="8.5" r="1.3" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></>,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  sidebarLeft: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16M5.5 8h1.5M5.5 11h1.5" /></>,
  sidebarRight: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M15 4v16M17 8h1.5M17 11h1.5" /></>,
  sort: <path d="M7 4v16M3.5 7.5L7 4l3.5 3.5M17 20V4M13.5 16.5L17 20l3.5-3.5" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></>,
  play: <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none" />,
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  folder: <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronDown: <path d="M5 9l7 7 7-7" />,
  clapper: <><path d="M4 10h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z" /><path d="M4 10l-.6-3.2 15-2.8.6 3.2L4 10z" /><path d="M8.5 6.3l2 3M13.4 5.4l2 3" /></>,
  flame: <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.4 3.6-8 .6 1.6 1.4 2.7 2.6 3.4.2-2.6 1.5-5 3.5-6.7-.3 2.6.7 4.5 2.1 6.3 1.2 1.6 1.7 3.1 1.7 5 0 3.6-3.1 6.2-7 6.2z" />,
  download: <><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" /><path d="M5 19.5h14" /></>,
  bell: <><path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16z" /><path d="M10 20.5a2.2 2.2 0 004 0" /></>,
  person: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  calendarDot: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  refresh: <path d="M20 12a8 8 0 11-2.3-5.6M20 4v5h-5" />,
  pulse: <path d="M3 12h4l2.5-6 5 12 2.5-6H21" />,
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8z" />,
  hash: <path d="M9 4L7 20M17 4l-2 16M4 9h16M3.5 15h16" />,
  palette: <><circle cx="12" cy="12" r="9" /><circle cx="8" cy="10" r="1.2" fill="currentColor" /><circle cx="12" cy="7.5" r="1.2" fill="currentColor" /><circle cx="16" cy="10" r="1.2" fill="currentColor" /><path d="M12 21c-1.5 0-2-1-2-2s1-2 2-2h2a3 3 0 003-3" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></>,
  // 状态图标：和 .status / .notice 一起用
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.8 2.8L16 9.8" /></>,
  warn: <><path d="M12 3.5L2.5 20h19L12 3.5z" /><path d="M12 10v4.5M12 17.2v.3" /></>,
  xCircle: <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  inbox: <><path d="M3 13l3-8h12l3 8v6H3v-6z" /><path d="M3 13h5l1.5 2.5h5L16 13h5" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 16, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
      {paths[name]}
    </svg>
  );
}
