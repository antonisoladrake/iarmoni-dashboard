// Hairline editorial iconography for each KPI.
// Spec from iArmoni DS: 0.9px stroke, square caps/joins, currentColor.

const KPI_ICON_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  vectorEffect: 'non-scaling-stroke',
};

function KpiIcon({ name, size = 32 }) {
  const p = KPI_ICON_PROPS;
  const vb = "0 0 32 32";
  switch (name) {
    case 'lost': // magnifying glass + scalpel
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M5 12 L17 12" />
            <path d="M11 6 L11 18" />
            <circle cx="22" cy="22" r="5" />
            <path d="M25.7 25.7 L29 29" />
            <path d="M19 22 L23 22" />
          </g>
        </svg>
      );
    case 'expire': // clock + arrow refresh
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <circle cx="16" cy="16" r="10" />
            <path d="M16 10 L16 16 L20 18" />
            <path d="M24 6 L28 6 L28 10" />
            <path d="M28 6 L24 10" />
          </g>
        </svg>
      );
    case 'collision': // two converging arrows
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M3 8 L14 16" />
            <path d="M11 7 L14 16 L5 12" />
            <path d="M29 24 L18 16" />
            <path d="M21 25 L18 16 L27 20" />
            <circle cx="16" cy="16" r="1.2" />
          </g>
        </svg>
      );
    case 'usage': // tray with stacked items
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M4 21 L28 21 L26 26 L6 26 Z" />
            <path d="M9 21 L9 14 L23 14 L23 21" />
            <path d="M12 14 L12 8 L20 8 L20 14" />
            <path d="M14 11 L18 11" />
          </g>
        </svg>
      );
    case 'request': // upward arrow + bell-like circle
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M16 28 L16 8" />
            <path d="M10 14 L16 8 L22 14" />
            <path d="M6 26 L26 26" />
            <circle cx="16" cy="5" r="1.3" />
          </g>
        </svg>
      );
    case 'shield': // shield with diagonal
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M16 4 L26 8 L26 17 C26 23 21 27 16 28 C11 27 6 23 6 17 L6 8 Z" />
            <path d="M11 16 L15 20 L22 12" />
          </g>
        </svg>
      );
    case 'trace': // dotted path with three nodes
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <circle cx="6" cy="9" r="2" />
            <circle cx="16" cy="16" r="2" />
            <circle cx="26" cy="23" r="2" />
            <path d="M8 10 L14 15" strokeDasharray="1 2" />
            <path d="M18 17 L24 22" strokeDasharray="1 2" />
            <path d="M4 13 L4 22 L14 22" />
          </g>
        </svg>
      );
    case 'checklist': // clipboard with rows
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M8 6 L24 6 L24 28 L8 28 Z" />
            <path d="M12 4 L20 4 L20 8 L12 8 Z" />
            <path d="M11 13 L13 15 L16 12" />
            <path d="M18 14 L22 14" />
            <path d="M11 19 L13 21 L16 18" />
            <path d="M18 20 L22 20" />
            <path d="M11 25 L22 25" />
          </g>
        </svg>
      );
    case 'pass': // stamp / checkmark in circle
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <circle cx="16" cy="16" r="10" />
            <path d="M10 16 L14 20 L22 12" />
          </g>
        </svg>
      );
    case 'paper': // leaf / document
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M9 5 L19 5 L23 9 L23 27 L9 27 Z" />
            <path d="M19 5 L19 9 L23 9" />
            <path d="M12 15 L20 15" />
            <path d="M12 19 L20 19" />
            <path d="M12 23 L17 23" />
          </g>
        </svg>
      );
    case 'resources': // droplet + lightning
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <path d="M10 4 C10 4 4 11 4 16 C4 19 6 22 10 22 C14 22 16 19 16 16 C16 11 10 4 10 4 Z" />
            <path d="M22 10 L18 18 L23 18 L20 28 L26 18 L21 18 Z" />
          </g>
        </svg>
      );
    default:
      return <svg width={size} height={size} viewBox={vb}><g {...p}><rect x="6" y="6" width="20" height="20" /></g></svg>;
  }
}

// Smaller utility icons
function UiIcon({ name, size = 16 }) {
  const p = KPI_ICON_PROPS;
  const vb = "0 0 24 24";
  switch (name) {
    case 'help':
      return (
        <svg width={size} height={size} viewBox={vb}>
          <g {...p}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9 C9 7 10.5 6 12 6 C13.5 6 15 7 15 9 C15 10.5 12 11 12 13" />
            <circle cx="12" cy="16.5" r="0.6" />
          </g>
        </svg>
      );
    case 'check':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M5 12 L10 17 L19 7" /></g></svg>);
    case 'cross':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M6 6 L18 18 M18 6 L6 18" /></g></svg>);
    case 'arrow-up':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M12 5 L12 19 M6 11 L12 5 L18 11" /></g></svg>);
    case 'arrow-down':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M12 5 L12 19 M6 13 L12 19 L18 13" /></g></svg>);
    case 'chevron-right':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M9 5 L16 12 L9 19" /></g></svg>);
    case 'filter':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M4 5 L20 5 L14 13 L14 20 L10 18 L10 13 Z" /></g></svg>);
    case 'edit':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M4 20 L4 16 L16 4 L20 8 L8 20 Z" /><path d="M14 6 L18 10" /></g></svg>);
    case 'refresh':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M4 12 A8 8 0 0 1 18 7" /><polyline points="13,7 18,7 18,2" /><path d="M20 12 A8 8 0 0 1 6 17" /><polyline points="11,17 6,17 6,22" /></g></svg>);
    case 'search':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><circle cx="11" cy="11" r="7" /><path d="M16 16 L21 21" /></g></svg>);
    case 'external':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M14 4 L20 4 L20 10" /><path d="M20 4 L11 13" /><path d="M14 12 L14 19 L5 19 L5 10 L12 10" /></g></svg>);
    case 'download':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M12 4 L12 16 M6 11 L12 17 L18 11" /><path d="M4 21 L20 21" /></g></svg>);
    case 'calendar':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><rect x="4" y="6" width="16" height="15" /><path d="M4 10 L20 10 M9 4 L9 8 M15 4 L15 8" /></g></svg>);
    case 'eye':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M2 12 C5 6 9 4 12 4 C15 4 19 6 22 12 C19 18 15 20 12 20 C9 20 5 18 2 12 Z" /><circle cx="12" cy="12" r="3" /></g></svg>);
    case 'refresh':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M20 12 C20 16 16 20 12 20 C8 20 5 18 4 14" /><path d="M4 12 C4 8 8 4 12 4 C16 4 19 6 20 10" /><polyline points="20,4 20,10 14,10" /><polyline points="4,20 4,14 10,14" /></g></svg>);
    case 'search':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><circle cx="11" cy="11" r="6" /><path d="M16 16 L21 21" /></g></svg>);
    case 'external':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M14 4 L20 4 L20 10" /><path d="M20 4 L11 13" /><path d="M18 14 L18 20 L4 20 L4 6 L10 6" /></g></svg>);
    case 'alert':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><path d="M12 4 L22 21 L2 21 Z" /><path d="M12 10 L12 15" /><circle cx="12" cy="18" r="0.6" /></g></svg>);
    case 'check-square':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><rect x="4" y="4" width="16" height="16" /><path d="M8 12 L11 15 L17 9" /></g></svg>);
    case 'square':
      return (<svg width={size} height={size} viewBox={vb}><g {...p}><rect x="4" y="4" width="16" height="16" /></g></svg>);
    default:
      return null;
  }
}

window.KpiIcon = KpiIcon;
window.UiIcon = UiIcon;
