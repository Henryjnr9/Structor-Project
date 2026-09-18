import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import GettingStartedModal from "./GettingStartedModal";

export const ENTITY_TYPES = [
  {
    id: "manuscripts",
    label: "Manuscripts",
    icon: "manuscripts",
    shortcut: "⌘ M",
  },
  { id: "scene", label: "Scene", icon: "scene", shortcut: "S" },
  { id: "maps", label: "Maps", icon: "maps", shortcut: "M" },
  { id: "character", label: "Character", icon: "character", shortcut: "C" },
  {
    id: "organization",
    label: "Organization",
    icon: "organization",
    shortcut: "W",
  },
  { id: "locations", label: "Locations", icon: "locations", shortcut: "L" },
  { id: "race", label: "Race", icon: "race", shortcut: "R" },
  { id: "artifacts", label: "Artifacts", icon: "artifacts", shortcut: "A" },
  { id: "creature", label: "Creature", icon: "creature", shortcut: "⌘ Q" },
  { id: "technology", label: "Technology", icon: "technology", shortcut: "O" },
  { id: "timeline", label: "Timeline", icon: "timeline", shortcut: "⌘ O" },
];

export default function SelectEntityMenu({
  isOpen = false,
  onClose,
  onSelectEntity,
  className = "",
}) {
  const containerRef = useRef(null);

  // 1. Starts as null so it is NOT visible until mouse enters an item
  const [hoveredEntity, setHoveredEntity] = useState(null);

  // Auto close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Reset to null whenever the menu opens or closes
  useEffect(() => {
    setHoveredEntity(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /* Outer wrapper that encompasses both the menu and the hover card */
    <div
      ref={containerRef}
      onMouseLeave={() => setHoveredEntity(null)}
      className={`absolute left-[calc(100%+24px)] top-0 z-50 flex items-start select-none ${className}`}
    >
      {/* Left Column: Entity Menu Items */}
      <div className="flex flex-col items-center gap-[4px] p-[16px_8px] rounded-[8px] bg-[#1C1C1C] shadow-[0_4px_15.5px_0_rgba(0,0,0,0.09)] border border-[#2E2E2E]">
        {ENTITY_TYPES.map((entity) => {
          const isHovered = hoveredEntity?.id === entity.id;

          return (
            <div
              key={entity.id}
              onMouseEnter={() => setHoveredEntity(entity)}
              onClick={() => {
                onSelectEntity?.(entity);
                onClose?.();
              }}
              className={`flex w-[253px] h-[36px] p-[8px] justify-between items-center rounded-[8px] transition-colors cursor-pointer ${
                isHovered ? "bg-[#3B3B3B]" : "bg-[#1C1C1C] hover:bg-[#3B3B3B]"
              }`}
            >
              {/* Left: Icon & Label */}
              <div className="flex items-center gap-[8px] min-w-0">
                <div className="w-[18px] h-[18px] aspect-square flex items-center justify-center text-white shrink-0">
                  <Icon name={entity.icon} size={18} />
                </div>

                <span className="text-white text-[14px] font-medium leading-[145%] truncate">
                  {entity.label}
                </span>
              </div>

              {/* Right: Shortcut text */}
              {entity.shortcut && (
                <span className="text-[#575757] text-[12px] font-medium leading-[145%] shrink-0 pl-2">
                  {entity.shortcut}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Column: Getting Started Card with GIF (ONLY appears on hover) */}
      {hoveredEntity && (
        <div className="pl-[12px] animate-in fade-in duration-100">
          <GettingStartedModal
            isOpen={Boolean(hoveredEntity)}
            entity={hoveredEntity}
          />
        </div>
      )}
    </div>
  );
}
