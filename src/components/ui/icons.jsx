import React from "react";



// Central dictionary of SVG paths (Lucide-style equivalents, 24x24 viewBox, stroke 1.75)

    // eslint-disable-next-line react-refresh/only-export-components

export const PATHS = {

  check: "M20 6 9 17l-5-5",

  x: "M18 6 6 18M6 6l12 12",

  "chevron-down": "m6 9 6 6 6-6",

  "chevron-right": "m9 18 6-6-6-6",

  "arrow-right": "M5 12h14M12 5l7 7-7 7",

  menu: "M4 12h16M4 6h16M4 18h16",

  search: "circle cx=11 cy=11 r=8|path d=M21 21l-4.35-4.35",

  cart: "circle cx=9 cy=21 r=1|circle cx=20 cy=21 r=1|M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",

  user: "path d=M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2|circle cx=12 cy=7 r=4",

  settings: "circle cx=12 cy=12 r=3|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",

  dashboard: "rect x=3 y=3 width=7 height=9 rx=1|rect x=14 y=3 width=7 height=5 rx=1|rect x=14 y=12 width=7 height=9 rx=1|rect x=3 y=16 width=7 height=5 rx=1",

  key: "path d=m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4|path d=m21 2-9.6 9.6|circle cx=7.5 cy=15.5 r=5.5",

  download: "path d=M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|polyline points=7 10 12 15 17 10|line x1=12 x2=12 y1=15 y2=3",

  bell: "path d=M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9|path d=M10.3 21a1.94 1.94 0 0 0 3.4 0",

  plus: "M12 5v14M5 12h14",

  minus: "M5 12h14",

  edit: "path d=M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|path d=M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",

  trash: "path d=M3 6h18|path d=M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6|path d=M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2|line x1=10 y1=11 x2=10 y2=17|line x1=14 y1=11 x2=14 y2=17",

  eye: "path d=M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z|circle cx=12 cy=12 r=3",

  "eye-off": "path d=M9.88 9.88a3 3 0 1 0 4.24 4.24|path d=M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68|path d=M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61|line x1=2 y1=2 x2=22 y2=22",

  "external-link": "path d=M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6|polyline points=15 3 21 3 21 9|line x1=10 y1=14 x2=21 y2=3",

  copy: "rect width=14 height=14 x=8 y=8 rx=2 ry=2|path d=M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",

  info: "circle cx=12 cy=12 r=10|line x1=12 y1=16 x2=12 y2=12|line x1=12 y1=8 x2=12.01 y2=8",

  warning: "path d=m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z|line x1=12 y1=9 x2=12 y2=13|line x1=12 y1=17 x2=12.01 y2=17",

  success: "path d=M22 11.08V12a10 10 0 1 1-5.93-9.14|polyline points=22 4 12 14.01 9 11.01",

  danger: "circle cx=12 cy=12 r=10|line x1=15 y1=9 x2=9 y2=15|line x1=9 y1=9 x2=15 y2=15",

  sun: "circle cx=12 cy=12 r=4|M12 2v2|M12 20v2|M4.93 4.93l1.41 1.41|M17.66 17.66l1.41 1.41|M2 12h2|M20 12h2|M6.34 17.66l-1.41 1.41|M19.07 4.93l-1.41 1.41",

  moon: "path d=M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",

  monitor: "rect x=2 y=3 width=20 height=14 rx=2 ry=2|line x1=8 y1=21 x2=16 y2=21|line x1=12 y1=17 x2=12 y2=21",

  home: "path d=m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|polyline points=9 22 9 12 15 12 15 22",

  grid: "rect x=3 y=3 width=7 height=7|rect x=14 y=3 width=7 height=7|rect x=14 y=14 width=7 height=7|rect x=3 y=14 width=7 height=7",

  layers: "polygon points=12 2 2 7 12 12 22 7 12 2|polyline points=2 17 12 22 22 17|polyline points=2 12 12 17 22 12",

  bolt: "polygon points=13 2 3 14 12 14 11 22 21 10 12 10 13 2",

  zap: "polygon points=13 2 3 14 12 14 11 22 21 10 12 10 13 2",

  spark: "path d=M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",

  cpu: "rect x=4 y=4 width=16 height=16 rx=2|M9 9h6v6H9z|M9 1v3|M15 1v3|M9 20v3|M15 20v3|M20 9h3|M20 15h3|M1 9h3|M1 15h3",

  server: "rect x=2 y=2 width=20 height=8 rx=2 ry=2|rect x=2 y=14 width=20 height=8 rx=2 ry=2|line x1=6 y1=6 x2=6.01 y2=6|line x1=6 y1=18 x2=6.01 y2=18",

  network: "rect x=16 y=16 width=6 height=6 rx=1|rect x=2 y=16 width=6 height=6 rx=1|rect x=9 y=2 width=6 height=6 rx=1|path d=M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3|M12 11V8",

  coins: "circle cx=8 cy=8 r=6|path d=M18.09 10.37A6 6 0 1 1 10.34 18|path d=M7 6h1v4|path d=M17.31 14.9a2 2 0 1 1-2.6-2.6",

  wallet: "path d=M21 12V7H5a2 2 0 0 1 0-4h14v4|path d=M3 5v14a2 2 0 0 0 2 2h16v-5|path d=M18 12a2 2 0 0 0 0 4h4v-4Z",

  "credit-card": "rect width=20 height=14 x=2 y=5 rx=2|line x1=2 x2=22 y1=10 y2=10",

  "file-text": "path d=M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z|path d=M14 2v4a2 2 0 0 0 2 2h4|line x1=10 x2=14 y1=13 y2=13|line x1=10 x2=14 y1=17 y2=17|line x1=8 x2=8.01 y1=13 y2=13|line x1=8 x2=8.01 y1=17 y2=17",

  book: "path d=M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",

  headset: "path d=M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z|path d=M21 16v2a4 4 0 0 1-4 4h-5",

  "log-out": "path d=M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|polyline points=16 17 21 12 16 7|line x1=21 y1=12 x2=9 y2=12",

  shield: "path d=M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",

  loader: "line x1=12 y1=2 x2=12 y2=6|line x1=12 y1=18 x2=12 y2=22|line x1=4.93 y1=4.93 x2=7.76 y2=7.76|line x1=16.24 y1=16.24 x2=19.07 y2=19.07|line x1=2 y1=12 x2=6 y2=12|line x1=18 y1=12 x2=22 y2=12|line x1=4.93 y1=19.07 x2=7.76 y2=16.24|line x1=16.24 y1=7.76 x2=19.07 y2=4.93",

  mail: "rect width=20 height=16 x=2 y=4 rx=2|path d=m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",

  calendar: "rect width=18 height=18 x=3 y=4 rx=2 ry=2|line x1=16 y1=2 x2=16 y2=6|line x1=8 y1=2 x2=8 y2=6|line x1=3 y1=10 x2=21 y2=10",

  github: "path d=M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",

  zalo: "M.521 21.018C.24 21.605.1 22.253.1 22.9c0 1.988 1.344 3.6 3 3.6 1.053 0 1.98-.653 2.518-1.636a4.425 4.425 0 0 0 4.14 2.871c2.196 0 4.093-1.666 4.733-4.004.83.67 1.87 1.069 3 1.069 2.54 0 4.6-2.06 4.6-4.6 0-1.13-.408-2.164-1.085-2.964.67-.798 1.085-1.83 1.085-2.96 0-2.54-2.06-4.6-4.6-4.6-1.13 0-2.164.408-2.964 1.085C13.73 3.12 12.06 1.7 10.1 1.7c-2.43 0-4.4 2.238-4.4 5 0 .584.085 1.144.243 1.663C4.85 7.64 3.5 9.01 3.5 10.6c0 1.258.85 2.333 2.022 2.74C5.11 14.54 3.5 16.54 3.5 18.9c0 1.134.408 2.164 1.085 2.964C3.89 22.68 2.5 24.7 2.5 27.1c0 .546.096 1.066.27 1.545.626 1.75 2.274 3 4.23 3 1.808 0 3.364-1.06 4.076-2.6C12.44 29.86 14.06 31.1 15.9 31.1c2.43 0 4.4-2.238 4.4-5 0-.584-.085-1.144-.243-1.663 1.093.723 2.443 1.163 3.843 1.163 3.645 0 6.6-2.955 6.6-6.6 0-1.63-.59-3.12-1.567-4.275C29.91 13.57 30.5 12.08 30.5 10.5c0-3.645-2.955-6.6-6.6-6.6-1.63 0-3.12.59-4.275 1.567-1.155-.978-2.645-1.567-4.275-1.567-3.645 0-6.6 2.955-6.6 6.6 0 1.13.284 2.19.78 3.118C8.892 12.63 8.1 11.7 7.1 11.7c-1.134 0-2.164.408-2.964 1.085C3.338 12.12 1.668 10.7.1 10.7",

  "message-square": "path d=M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",

  pi: "M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z",

};



// Simple parser to support multiple nodes or basic path strings

const renderPaths = (pathString) => {

  if (!pathString) return null;

  return pathString.split("|").map((segment, index) => {

    if (segment.startsWith("circle ")) {

      const match = segment.match(/cx=([\d.]+) cy=([\d.]+) r=([\d.]+)/);

      if (match) return <circle key={index} cx={match[1]} cy={match[2]} r={match[3]} />;

    }

    if (segment.startsWith("rect ")) {

      const x = segment.match(/x=([\d.]+)/)?.[1];

      const y = segment.match(/y=([\d.]+)/)?.[1];

      const w = segment.match(/width=([\d.]+)/)?.[1];

      const h = segment.match(/height=([\d.]+)/)?.[1];

      const rx = segment.match(/rx=([\d.]+)/)?.[1];

      const ry = segment.match(/ry=([\d.]+)/)?.[1];

      return <rect key={index} x={x} y={y} width={w} height={h} rx={rx} ry={ry} />;

    }

    if (segment.startsWith("line ")) {

      const x1 = segment.match(/x1=([\d.]+)/)?.[1];

      const y1 = segment.match(/y1=([\d.]+)/)?.[1];

      const x2 = segment.match(/x2=([\d.]+)/)?.[1];

      const y2 = segment.match(/y2=([\d.]+)/)?.[1];

      return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;

    }

    if (segment.startsWith("polyline ")) {

      const points = segment.match(/points=(.+)/)?.[1];

      return <polyline key={index} points={points} />;

    }

    if (segment.startsWith("polygon ")) {

      const points = segment.match(/points=(.+)/)?.[1];

      return <polygon key={index} points={points} />;

    }

    if (segment.startsWith("path d=")) {

      const d = segment.match(/path d=(.+)/)?.[1];

      return <path key={index} d={d} />;

    }

    

    // Default is a simple `<path d="..." />`

    return <path key={index} d={segment} />;

  });

};



export function Icon({ name, size = 16, title, className, viewBox, ...rest }) {

  const pathData = PATHS[name];

  

  if (!pathData) {

    const IS_DEV = import.meta.env.DEV;

    if (IS_DEV) {

      console.warn(`Icon "${name}" not found.`);

    }

    return null;

  }



  // Handle custom viewBox for specific icons like 'pi'

  const finalViewBox = viewBox || (name === "pi" ? "0 0 48 46" : "0 0 24 24");



  return (

    <svg

      width={size}

      height={size}

      viewBox={finalViewBox}

      fill="none"

      stroke="currentColor"

      strokeWidth={name === "pi" ? "3" : "1.75"}

      strokeLinecap="round"

      strokeLinejoin="round"

      role={title ? "img" : "presentation"}

      aria-label={title}

      className={className}

      {...rest}

    >

      {title && <title>{title}</title>}

      {renderPaths(pathData)}

    </svg>

  );

}



export default Icon;

