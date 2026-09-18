import React from "react";
import {
  House,
  CaretDown,
  CaretRight,
  WifiSlash,
  MagnifyingGlass,
  Faders,
  Plus,
  MapPin,
  TextT,
  PenNib,
  Ruler,
  ArrowsOutCardinal,
  ChatCircle,
  CornersOut,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ShareNetwork,
  Star,
  MapTrifold,
  DotsThreeVertical,
  DotsThree,
  X,
  ArrowsDownUp,
  SquaresFour,
  List,
  LinkSimple,
  Check,
  FileText,
  Play,
  User,
  Globe,
  Users,
  Diamond,
  Bug,
  VirtualReality,
  Calendar,
  At,
  PencilSimple,
  CopySimple,
  Export,
  Trash,
  Shield,
  FolderSimple,
} from "@phosphor-icons/react";

// Custom rounded cursor arrow
function MoveArrow({ className, size = 21, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3.5L18.5 19.5C18.5 19.5 15 17 12 17C9 17 5.5 19.5 5.5 19.5L12 3.5Z" />
    </svg>
  );
}

// Custom 4-shapes empty state icon
function AssetShapesIcon({ className, size = 48, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="6" y="6" width="14" height="14" rx="4" />
      <circle cx="35" cy="13" r="7" />
      <path d="M13 26L20 33L13 40L6 33Z" />
      <rect x="28" y="28" width="14" height="14" rx="4" />
    </svg>
  );
}

// Double pill workspace badge icon
function WorkspacePillsIcon({ className, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="5" width="18" height="6" rx="3" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <rect x="3" y="13" width="18" height="6" rx="3" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  );
}

/**
 * MASTER ICON REGISTRY
 */
export const ICONS = {
  // Navigation & Workspace
  home: House,
  "chevron-down": CaretDown,
  "chevron-right": CaretRight,
  "wifi-off": WifiSlash,
  search: MagnifyingGlass,
  filter: Faders,
  plus: Plus,

  // Page Header
  map: MapTrifold,
  "dots-vertical": DotsThreeVertical,
  "dots-horizontal": DotsThree,

  // Entity Context Menu Actions
  pencil: PencilSimple,
  duplicate: CopySimple,
  export: Export,
  trash: Trash,
  shield: Shield,
  copy: CopySimple,
  folder: FolderSimple,

  // Modals & Menus
  close: X,
  "sort-format": ArrowsDownUp,
  grid: SquaresFour,
  list: List,
  "asset-shapes": AssetShapesIcon,
  link: LinkSimple,
  check: Check,
  "workspace-badge": WorkspacePillsIcon,

  // Entity Types
  manuscripts: FileText,
  scene: Play,
  maps: MapTrifold,
  character: User,
  organization: Globe,
  locations: MapPin,
  race: Users,
  artifacts: Diamond,
  creature: Bug,
  technology: VirtualReality,
  timeline: Calendar,

  // Document Editor Toolbar
  at: At,

  // Canvas / Bottom Toolbar Tools
  move: MoveArrow,
  pin: MapPin,
  text: TextT,
  pen: PenNib,
  ruler: Ruler,
  pan: ArrowsOutCardinal,
  comment: ChatCircle,

  // Zoom & View
  scan: CornersOut,
  "zoom-in": MagnifyingGlassPlus,
  "zoom-out": MagnifyingGlassMinus,

  // Right Inspector
  network: ShareNetwork,
  star: Star,
};

export default function Icon({
  name,
  size = 20,
  weight = "regular",
  className = "",
  ...props
}) {
  const Component = ICONS[name];

  if (!Component) {
    console.warn(`Icon "${name}" does not exist in Icon registry.`);
    return null;
  }

  return (
    <Component size={size} weight={weight} className={className} {...props} />
  );
}
