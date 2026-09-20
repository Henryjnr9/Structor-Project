import React, { useState } from "react";
import Icon from "./Icon";
import ShareDropdown from "./ShareDropdown";

export default function RightSidebar({
  selectedEntity = null,
  selectedPin = null,
  activeTool = "move",
  onUpdatePin,
  onDeletePin,
}) {
  // Share dropdown state
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Entity View Tabs & Rating (kept from your original code)
  const [activeTab, setActiveTab] = useState("Blocks");
  const [rating, setRating] = useState(1);

  // Location Pin Accordion States (Screenshots 1, 2 & 3)
  const [isLinksOpen, setIsLinksOpen] = useState(true);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isShapeOpen, setIsShapeOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [linkSearchQuery, setLinkSearchQuery] = useState("");

  const blockItems = [
    "Image",
    "Notes",
    "Tags",
    "Alias",
    "Links",
    "Backlinks",
    "Export",
  ];

  const metricItems = [
    "Appearance",
    "Role",
    "Reputation",
    "Wealth/price",
    "Influence",
    "Personality",
    "Status",
    "Strength",
    "Importance",
  ];

  // =========================================================
  // PIN PROPERTY HANDLERS
  // =========================================================
  const handlePinNameChange = (e) => {
    if (!selectedPin || !onUpdatePin) return;
    onUpdatePin({
      ...selectedPin,
      name: e.target.value,
      description: e.target.value,
    });
  };

  const handleRemoveLink = (linkIndex) => {
    if (!selectedPin || !onUpdatePin) return;
    const updatedLinks = (selectedPin.links || []).filter(
      (_, idx) => idx !== linkIndex,
    );
    onUpdatePin({
      ...selectedPin,
      links: updatedLinks,
    });
  };

  const handleAddLink = (newLinkName) => {
    if (!selectedPin || !onUpdatePin || !newLinkName.trim()) return;
    const currentLinks = selectedPin.links || [];
    onUpdatePin({
      ...selectedPin,
      links: [...currentLinks, { name: newLinkName.trim(), type: "location" }],
    });
    setLinkSearchQuery("");
  };

  const handleZoomMinChange = (e) => {
    if (!selectedPin || !onUpdatePin) return;
    onUpdatePin({
      ...selectedPin,
      zoomMin: Number(e.target.value) || 0,
    });
  };

  const handleZoomMaxChange = (e) => {
    if (!selectedPin || !onUpdatePin) return;
    onUpdatePin({
      ...selectedPin,
      zoomMax: Number(e.target.value) || 100,
    });
  };

  // Default mock links if pin has none yet (matching Screenshot 2 & 3)
  const pinLinks =
    selectedPin?.links && selectedPin.links.length > 0
      ? selectedPin.links
      : [{ name: "Valerith Citadel/Captial Val...", type: "pin" }];

  const isRegion = selectedPin?.isRegion || activeTool === "pen";

  return (
    <aside className="w-[305px] h-full bg-[#141416] text-zinc-100 border-l border-[#27272a] flex flex-col select-none shrink-0 relative">
      {/* 1. Header (Shared across Entity View & Map View) */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#27272a] relative shrink-0">
        {/* Avatar & Chevron */}
        <div className="relative group">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-emerald-500/40 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-teal-800 flex items-center justify-center p-0.5 shadow-inner">
              <div className="w-full h-full rounded-full bg-zinc-950/80 flex items-center justify-center text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
                👁️
              </div>
            </div>
            <Icon
              name="chevron-down"
              size={14}
              className="text-neutral-400 group-hover:text-white transition-colors"
            />
          </div>
        </div>

        {/* Action Buttons: Network Graph & Share */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="bg-[#1e1e22] border border-[#2e2e32] hover:border-neutral-500 rounded-lg p-2 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Relationship Graph"
          >
            <Icon name="network" size={16} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="bg-[#6c00eb] hover:bg-[#5b00c7] active:bg-[#52009e] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Share
            </button>

            <ShareDropdown
              isOpen={isShareOpen}
              onClose={() => setIsShareOpen(false)}
              className="absolute top-11 right-0 z-50"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* ========================================================= */}
        {/* STATE A: A PIN IS SELECTED ON MAP (Screenshots 1, 2 & 3)   */}
        {/* ========================================================= */}
        {selectedPin ? (
          <div className="p-4 flex flex-col gap-5 text-zinc-100">
            {/* Title: "Location Pin" or "Region" */}
            <h3 className="text-sm font-semibold text-white tracking-tight">
              {isRegion ? "Region" : "Location Pin"}
            </h3>

            {/* Pin / Region Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-400">
                {isRegion ? "Region Name" : "Pin Name"}
              </label>
              <textarea
                rows={2}
                value={selectedPin.name || selectedPin.description || ""}
                onChange={handlePinNameChange}
                placeholder="Enter pin or region name..."
                className="w-full bg-[#1a1a1d] border border-[#2c2c30] focus:border-[#6F01D0] rounded-[10px] p-3 text-xs text-white placeholder:text-neutral-600 outline-none resize-none transition-colors leading-relaxed"
              />
            </div>

            {/* Accordion 1: Links (Screenshot 2 & 3) */}
            <div className="border-t border-[#27272a] pt-3.5">
              <button
                type="button"
                onClick={() => setIsLinksOpen(!isLinksOpen)}
                className="w-full flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Links</span>
                <span className="text-neutral-400 text-sm font-bold">
                  {isLinksOpen ? "−" : "+"}
                </span>
              </button>

              {isLinksOpen && (
                <div className="flex flex-col gap-2 pt-2.5">
                  {/* Search Links Input */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1d] border border-[#2c2c30] rounded-[8px] text-xs text-neutral-300">
                    <div className="flex items-center gap-2 w-full">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        className="text-neutral-500 shrink-0"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21L16.65 16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search Links"
                        value={linkSearchQuery}
                        onChange={(e) => setLinkSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddLink(linkSearchQuery);
                        }}
                        className="w-full bg-transparent text-white placeholder:text-neutral-500 outline-none text-xs"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 border border-neutral-700/60 rounded px-1.5 py-0.5">
                      ⌘ k
                    </span>
                  </div>

                  {/* Linked Entities / Location Tags */}
                  <div className="flex flex-col gap-1.5">
                    {pinLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 bg-[#1a1a1d] border border-[#2c2c30] rounded-[8px] text-xs text-neutral-200 group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            className="text-neutral-400 shrink-0"
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                          <span className="truncate">{link.name || link}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(idx)}
                          className="text-neutral-500 hover:text-white transition-colors cursor-pointer ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Appearance */}
            <div className="border-t border-[#27272a] pt-3.5">
              <button
                type="button"
                onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                className="w-full flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Appearance</span>
                <span className="text-neutral-400 text-sm font-bold">
                  {isAppearanceOpen ? "−" : "+"}
                </span>
              </button>
              {isAppearanceOpen && (
                <div className="pt-2 text-xs text-neutral-400">
                  Color and icon styles for this pin.
                </div>
              )}
            </div>

            {/* Accordion 3: Shape */}
            <div className="border-t border-[#27272a] pt-3.5">
              <button
                type="button"
                onClick={() => setIsShapeOpen(!isShapeOpen)}
                className="w-full flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Shape</span>
                <span className="text-neutral-400 text-sm font-bold">
                  {isShapeOpen ? "−" : "+"}
                </span>
              </button>
              {isShapeOpen && (
                <div className="pt-2 text-xs text-neutral-400">
                  Custom pin marker shape options.
                </div>
              )}
            </div>

            {/* Accordion 4: State */}
            <div className="border-t border-[#27272a] pt-3.5">
              <button
                type="button"
                onClick={() => setIsStateOpen(!isStateOpen)}
                className="w-full flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>State</span>
                <span className="text-neutral-400 text-sm font-bold">
                  {isStateOpen ? "−" : "+"}
                </span>
              </button>
              {isStateOpen && (
                <div className="pt-2 text-xs text-neutral-400">
                  Active, explored, or hidden conditions.
                </div>
              )}
            </div>

            {/* Zoom Visibility Section (Exact match to screenshots) */}
            <div className="border-t border-[#27272a] pt-3.5 flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-400">
                Zoom Visibility
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center py-2 px-3 bg-[#1a1a1d] border border-[#2c2c30] rounded-[8px] text-xs font-mono text-neutral-300">
                  {selectedPin.zoomMin ?? 0}%
                </div>
                <div className="flex items-center justify-center py-2 px-3 bg-[#1a1a1d] border border-[#2c2c30] rounded-[8px] text-xs font-mono text-neutral-300">
                  {selectedPin.zoomMax ?? 100}%
                </div>
              </div>
            </div>
          </div>
        ) : selectedEntity ? (
          /* ========================================================= */
          /* STATE B: AN ENTITY IS SELECTED (Wiki / Character Profile) */
          /* ========================================================= */
          <div className="flex-1 flex flex-col pb-10">
            {/* Segmented Control (Tabs) */}
            <div className="px-4 pt-3 pb-1 shrink-0">
              <div className="grid grid-cols-2 bg-[#141416] border border-[#2E2E2E] p-1 rounded-lg text-xs font-medium">
                {["Blocks", "Metrics"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`py-1.5 rounded-md transition-all text-center cursor-pointer ${
                      activeTab === tab
                        ? "bg-[#2E2E2E] text-white shadow-sm font-semibold"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-[#2E2E2E]/60">
              {activeTab === "Blocks" && (
                <div>
                  {blockItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between py-3 cursor-pointer group text-neutral-200 hover:text-white transition-colors"
                    >
                      <span className="text-xs font-normal">{item}</span>
                      <Icon
                        name="plus"
                        size={14}
                        className="text-neutral-500 group-hover:text-white transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Metrics" && (
                <div>
                  <div className="py-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-normal text-neutral-200">
                        Rating
                      </span>
                      <Icon
                        name="plus"
                        size={14}
                        className="text-neutral-500 hover:text-white cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Icon
                            name="star"
                            size={20}
                            weight={star <= rating ? "fill" : "regular"}
                            className={
                              star <= rating
                                ? "text-amber-500"
                                : "text-neutral-700 hover:text-neutral-500"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-neutral-400 font-normal">
                        Rating
                      </span>
                      <span className="text-neutral-300 font-medium">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  {metricItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between py-3 cursor-pointer group text-neutral-200 hover:text-white transition-colors"
                    >
                      <span className="text-xs font-normal">{item}</span>
                      <Icon
                        name="plus"
                        size={14}
                        className="text-neutral-500 group-hover:text-white transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* STATE C: CLEAN EMPTY STATE                                 */
          /* ========================================================= */
          <div className="flex-1" />
        )}
      </div>
    </aside>
  );
}
