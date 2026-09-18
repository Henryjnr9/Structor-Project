import React, { useState } from "react";

const COMMUNITY_ASSETS = [
  {
    id: "comm-1",
    name: "Asset 1.jpg",
    uploader: "Added by Mathe",
    date: "Uploaded: 16 May 2026",
    format: "JPG",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1800&auto=format&fit=crop&q=90",
    description:
      "Aerial fantasy valley terrain map with rivers and settlements.",
  },
  {
    id: "comm-2",
    name: "Asset 2.jpg",
    uploader: "Added by Mathe",
    date: "Uploaded: 16 May 2026",
    format: "JPG",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&auto=format&fit=crop&q=90",
    description: "Volcanic ridge boundary with active molten flow.",
  },
  {
    id: "comm-3",
    name: "Asset 3.jpg",
    uploader: "Added by OBA",
    date: "Uploaded: 16 May 2026",
    format: "JPG",
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1800&auto=format&fit=crop&q=90",
    description: "Ancient dragon eye emblem relic.",
  },
];

export default function ManageAssetModal({
  isOpen = false,
  onClose,
  onSelectMap,
  onSelectAsset,
  title = "Manage Asset",
}) {
  const [assets, setAssets] = useState([]);
  const [draftAsset, setDraftAsset] = useState(null); // The newly uploaded file
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);

  // Active item in the right inspector: draft item OR clicked saved asset
  const selectedSavedAsset = assets.find((a) => a.id === selectedAssetId);
  const activeAsset = draftAsset || selectedSavedAsset;

  // STEP 1: Select File from Computer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    const fileUrl = URL.createObjectURL(file);

    // Creates the draft and shows the right sidebar (matches reference UI)
    setDraftAsset({
      id: `asset-${Date.now()}`,
      name: cleanName,
      description: "",
      uploader: "Added by You",
      date: "Uploaded: 16 May 2026",
      url: fileUrl,
    });

    setSelectedAssetId(null);
    e.target.value = ""; // Reset file input
  };

  // STEP 2: Save to Asset Library (+ Update button)
  const handleSaveToLibrary = () => {
    if (!activeAsset) return;

    if (draftAsset) {
      // Save new upload to library
      const newAsset = {
        ...draftAsset,
        name: draftAsset.name.trim() || "Untitled Asset",
      };
      setAssets((prev) => [newAsset, ...prev]);
      setSelectedAssetId(newAsset.id);
      setDraftAsset(null); // Transition from draft to saved library item
    } else if (selectedSavedAsset) {
      // Update existing item
      setAssets((prev) =>
        prev.map((item) =>
          item.id === selectedSavedAsset.id ? selectedSavedAsset : item,
        ),
      );
    }
  };

  // STEP 3: Upload to Canvas (Applies map to workspace & closes modal)
  const handleUploadToCanvas = (asset) => {
    const target = asset || activeAsset;
    if (!target) return;

    onSelectMap?.(target.url);
    onSelectAsset?.(target.url, target);
    onClose?.();
  };

  const handleClose = () => {
    setDraftAsset(null);
    setSelectedAssetId(null);
    onClose?.();
  };

  const handleLoadCommunity = () => {
    setAssets(COMMUNITY_ASSETS);
    setSelectedAssetId(COMMUNITY_ASSETS[0].id);
    setDraftAsset(null);
  };

  if (!isOpen) return null;

  const filteredAssets = assets.filter((asset) => {
    const matchSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.uploader.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      {/* Modal Dialog */}
      <div className="relative flex flex-col w-[1060px] max-w-[96vw] h-[670px] max-h-[92vh] rounded-[20px] bg-[#141416] border border-[#27272a] shadow-2xl overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
          <h2 className="text-[17px] font-semibold text-white tracking-tight">
            {title}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#343438] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M2 2L12 12M12 2L2 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL */}
          <div className="flex-1 flex flex-col px-6 pb-6 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1d] border border-[#2c2c30] rounded-[8px] text-xs text-neutral-300 w-[190px]">
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
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-white placeholder:text-neutral-500 outline-none text-xs"
                  />
                </div>

                {/* Format Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1d] border border-[#2c2c30] hover:border-neutral-500 rounded-[8px] text-xs text-neutral-300 transition-colors cursor-pointer"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 3v18M7 3l4 4M7 3L3 7M17 21V3M17 21l-4-4M17 21l4-4" />
                    </svg>
                    <span>
                      {selectedFormat === "All" ? "Format" : selectedFormat}
                    </span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="ml-0.5 opacity-60"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isFormatMenuOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-28 bg-[#1a1a1d] border border-[#2c2c30] rounded-[8px] py-1 shadow-xl z-30">
                      {["All", "PNG", "JPG", "WEBP"].map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => {
                            setSelectedFormat(fmt);
                            setIsFormatMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-[#2c2c30] cursor-pointer"
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-[#1a1a1d] border border-[#2c2c30] p-0.5 rounded-[8px]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-[6px] cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#2c2c30] text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <rect x="1" y="1" width="6" height="6" rx="1" />
                    <rect x="9" y="1" width="6" height="6" rx="1" />
                    <rect x="1" y="9" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-[6px] cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#2c2c30] text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="List View"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h12v2H2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* EMPTY STATE OR POPULATED ASSETS */}
            {assets.length === 0 ? (
              /* Center Empty State (Exact match to screenshot) */
              <div className="flex-1 flex flex-col items-center justify-center -mt-6 text-center">
                <div className="mb-3 text-neutral-500 flex items-center justify-center">
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 48 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-500"
                  >
                    <rect x="6" y="6" width="14" height="14" rx="3" />
                    <circle cx="35" cy="13" r="7" />
                    <rect
                      x="9"
                      y="32"
                      width="10"
                      height="10"
                      rx="1"
                      transform="rotate(45 14 37)"
                    />
                    <rect x="28" y="28" width="14" height="14" rx="4" />
                  </svg>
                </div>

                <h3 className="text-[20px] font-medium text-white mb-2 tracking-tight">
                  No Assets found
                </h3>

                <p className="text-[12px] text-neutral-400 leading-relaxed max-w-[310px] mb-6">
                  Add new assets by drag and dropping from your computer or you
                  can explore our community
                </p>

                <div className="flex flex-col gap-2.5 w-[230px]">
                  {/* Native HTML label file picker - 100% reliable, zero event bubbling bugs */}
                  <label className="w-full py-2.5 px-4 rounded-[10px] bg-[#6F01D0] hover:bg-[#6001b5] text-white text-[13px] font-semibold transition-all shadow-lg shadow-purple-950/30 cursor-pointer text-center block">
                    <span>New Asset</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleLoadCommunity}
                    className="w-full py-2.5 px-4 rounded-[10px] bg-[#262629] hover:bg-[#303035] text-neutral-200 text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    Search Community
                  </button>
                </div>
              </div>
            ) : (
              /* Populated Gallery */
              <div className="flex-1 overflow-y-auto pr-1">
                {viewMode === "list" ? (
                  <div className="flex flex-col gap-4">
                    {filteredAssets.map((asset) => {
                      const isSelected = selectedAssetId === asset.id;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setSelectedAssetId(asset.id);
                            setDraftAsset(null);
                          }}
                          onDoubleClick={() => handleUploadToCanvas(asset)}
                          className={`flex flex-col gap-2 rounded-[14px] p-2 bg-[#17171a] border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#6F01D0] bg-[#1e1728]"
                              : "border-[#2c2c30] hover:border-neutral-500"
                          }`}
                        >
                          <div className="relative w-full h-[150px] rounded-[10px] overflow-hidden bg-black/40">
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-[6px] bg-black/75 backdrop-blur-md text-[10.5px] font-medium text-white border border-white/10">
                              {asset.uploader}
                            </div>
                          </div>
                          <div className="flex items-center justify-between px-1 pt-0.5">
                            <span className="text-xs font-semibold text-white">
                              {asset.name}
                            </span>
                            <span className="text-neutral-500 hover:text-white p-1">
                              ⋮
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-500 px-1 -mt-1 pb-0.5">
                            {asset.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3.5">
                    {filteredAssets.map((asset) => {
                      const isSelected = selectedAssetId === asset.id;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setSelectedAssetId(asset.id);
                            setDraftAsset(null);
                          }}
                          onDoubleClick={() => handleUploadToCanvas(asset)}
                          className={`flex flex-col gap-1.5 p-2 rounded-[12px] bg-[#17171a] border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#6F01D0] bg-[#1e1728]"
                              : "border-[#2c2c30] hover:border-neutral-500"
                          }`}
                        >
                          <div className="relative w-full h-[105px] rounded-[8px] overflow-hidden bg-black/50">
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-[5px] bg-black/75 backdrop-blur-md text-[10px] font-medium text-white border border-white/10">
                              {asset.uploader}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-semibold text-white truncate">
                              {asset.name}
                            </span>
                            <span className="text-neutral-500 hover:text-white p-0.5">
                              ⋮
                            </span>
                          </div>
                          <span className="text-[10.5px] text-neutral-500 -mt-1">
                            {asset.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: INSPECTOR (Appears when file is selected or an asset is clicked) */}
          {activeAsset && (
            <div className="w-[330px] shrink-0 border-l border-[#27272a] px-6 pb-6 pt-1 flex flex-col justify-between overflow-y-auto">
              <div className="flex flex-col gap-4">
                {/* Thumbnail with "Added by You" Badge */}
                <div className="relative w-full h-[160px] rounded-[14px] overflow-hidden bg-black/40 border border-[#27272a]">
                  <img
                    src={activeAsset.url}
                    alt={activeAsset.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-[6px] bg-black/75 backdrop-blur-md text-[10.5px] font-medium text-white border border-white/10">
                    {activeAsset.uploader}
                  </div>
                </div>

                {/* Asset Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    value={activeAsset.name || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (draftAsset) {
                        setDraftAsset((prev) => ({ ...prev, name: val }));
                      } else if (selectedSavedAsset) {
                        setAssets((prev) =>
                          prev.map((item) =>
                            item.id === selectedSavedAsset.id
                              ? { ...item, name: val }
                              : item,
                          ),
                        );
                      }
                    }}
                    placeholder="Enter asset name..."
                    className="w-full bg-[#1a1a1d] border border-[#2c2c30] focus:border-[#6F01D0] rounded-[8px] px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 outline-none transition-colors"
                  />
                </div>

                {/* Asset Description Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Asset Description
                  </label>
                  <textarea
                    rows={4}
                    value={activeAsset.description || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (draftAsset) {
                        setDraftAsset((prev) => ({
                          ...prev,
                          description: val,
                        }));
                      } else if (selectedSavedAsset) {
                        setAssets((prev) =>
                          prev.map((item) =>
                            item.id === selectedSavedAsset.id
                              ? { ...item, description: val }
                              : item,
                          ),
                        );
                      }
                    }}
                    placeholder="Enter description..."
                    className="w-full bg-[#1a1a1d] border border-[#2c2c30] focus:border-[#6F01D0] rounded-[8px] p-3 text-xs text-white placeholder:text-neutral-600 outline-none resize-none transition-colors h-[120px]"
                  />
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 flex flex-col gap-2">
                {draftAsset ? (
                  /* While draft: + Update saves to library (Screenshot 1) */
                  <button
                    type="button"
                    onClick={handleSaveToLibrary}
                    className="w-full py-2.5 px-4 rounded-[10px] bg-[#6F01D0] hover:bg-[#6001b5] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-950/30 cursor-pointer"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M8 3V13M3 8H13" />
                    </svg>
                    <span>Update</span>
                  </button>
                ) : (
                  /* When saved in library: Upload to Canvas button appears */
                  <>
                    <button
                      type="button"
                      onClick={() => handleUploadToCanvas(selectedSavedAsset)}
                      className="w-full py-2.5 px-4 rounded-[10px] bg-[#6F01D0] hover:bg-[#6001b5] text-white text-[13px] font-semibold transition-all shadow-lg shadow-purple-950/30 cursor-pointer"
                    >
                      Upload to Canvas
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToLibrary}
                      className="w-full py-2 px-4 rounded-[10px] bg-[#262629] hover:bg-[#303035] text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
