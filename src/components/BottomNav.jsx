import React, { useState } from "react";
import Icon from "./Icon";

// Map Page Tools
const MAP_TOOLS = [
  { id: "move", name: "Move", shortcut: "V", icon: "move" },
  { id: "pin", name: "Pin", shortcut: "P", icon: "pin" },
  { id: "text", name: "Text", shortcut: "T", icon: "text" },
  { id: "pen", name: "Pen", shortcut: "B", icon: "pen" },
  { id: "ruler", name: "Ruler", shortcut: "R", icon: "ruler" },
  { id: "pan", name: "Pan", shortcut: "H", icon: "pan" },
  { id: "comment", name: "Comment", shortcut: "C", icon: "comment" },
];

// Entity Page Tools
const ENTITY_TOOLS = [
  { id: "comment", name: "Comment", shortcut: "C", icon: "comment" },
  { id: "plus", name: "Add Block", shortcut: "+", icon: "plus" },
  { id: "text", name: "Text", shortcut: "T", icon: "text" },
  { id: "at", name: "Mention", shortcut: "@", icon: "at" },
];

export default function BottomNav({
  mode = "map",
  activeTool = "move",
  onToolSelect,
  zoom = 25,
  onZoomChange,
}) {
  const [hoveredTool, setHoveredTool] = useState(null);

  // Switch tools based on active page mode
  const tools = mode === "map" ? MAP_TOOLS : ENTITY_TOOLS;

  // Zoom handlers (Broadcasts to the page canvas)
  const handleZoomIn = () => {
    const nextZoom = Math.min(zoom + 10, 200);
    onZoomChange?.(nextZoom);
  };

  const handleZoomOut = () => {
    const nextZoom = Math.max(zoom - 10, 10);
    onZoomChange?.(nextZoom);
  };

  const handleZoomReset = () => {
    onZoomChange?.(25); // Resets to 25% (matching Screenshot 1)
  };

  const handleToolClick = (toolId) => {
    onToolSelect?.(toolId);
  };

  return (
    /* Universal Bottom Nav Container */
    <div className="inline-flex items-center gap-[10px] p-[8px_10px] rounded-[16px] border border-[#2E2E2E] bg-[#1C1C1C] shadow-2xl backdrop-blur-md select-none">
      {/* 1. Tools Container */}
      <div className="flex items-center gap-[2px]">
        {tools.map((tool) => {
          // Direct sync with activeTool prop!
          const isSelected = activeTool === tool.id;
          const isHovered = hoveredTool === tool.id;

          return (
            <div key={tool.id} className="relative flex flex-col items-center">
              {/* Tooltip on hover */}
              {isHovered && !isSelected && (
                <div className="absolute -top-10 flex items-center gap-2 bg-[#1C1C1C] border border-[#2E2E2E] px-2.5 py-1 rounded-[6px] text-[11px] shadow-lg pointer-events-none whitespace-nowrap z-50">
                  <span className="font-medium text-white">{tool.name}</span>
                  <span className="text-neutral-400 font-mono text-[10px]">
                    {tool.shortcut}
                  </span>
                </div>
              )}

              {/* Tool Button with 3 states: Default, Hovered, Selected */}
              <button
                onClick={() => handleToolClick(tool.id)}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className={`flex items-center justify-center p-[8px] rounded-[10px] transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#6c00eb] text-white shadow-md shadow-purple-900/30"
                    : isHovered
                      ? "bg-[#2E2E2E] text-white"
                      : "bg-transparent text-white hover:bg-[#2E2E2E]"
                }`}
              >
                <Icon name={tool.icon} size={21} />
              </button>
            </div>
          );
        })}
      </div>

      {/* 2. Zoom Container (Only visible on Map page) */}
      {mode === "map" && (
        <div className="flex items-center gap-[10px] p-[4px_8px] rounded-[13px] bg-[#2E2E2E]">
          {/* Reset / Fit to Screen */}
          <button
            onClick={handleZoomReset}
            className="flex items-center justify-center p-[4px] rounded-[10px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Fit to Screen"
          >
            <Icon name="scan" size={18} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="flex items-center justify-center p-[4px] rounded-[10px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Icon name="zoom-out" size={18} />
          </button>

          {/* Zoom Percentage Display */}
          <span className="min-w-[34px] text-center text-xs font-mono font-medium text-neutral-200 select-none">
            {zoom}%
          </span>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="flex items-center justify-center p-[4px] rounded-[10px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Icon name="zoom-in" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
