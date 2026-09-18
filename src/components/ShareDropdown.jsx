import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

export default function ShareDropdown({
  isOpen = false,
  onClose,
  className = "",
}) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("View Only");
  const [isCopied, setIsCopied] = useState(false);

  const dropdownRef = useRef(null);

  // Auto close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    /* Main Share Container (Exact Figma Specs) */
    <div
      ref={dropdownRef}
      className={`flex flex-col items-start gap-[10px] w-[343px] p-[16px] rounded-[8px] bg-[#1C1C1C] shadow-[0_4px_15.5px_0_rgba(0,0,0,0.09)] border border-[#2E2E2E] select-none z-50 animate-in fade-in zoom-in-95 duration-100 ${className}`}
    >
      {/* 1. Share Header */}
      <h3 className="text-white text-[14px] font-semibold leading-[145%]">
        Share
      </h3>

      {/* 2. Email Input Field */}
      <div className="flex items-center gap-[8px] w-full h-[36px] p-[8px_15px] rounded-[8px] bg-[#2E2E2E] focus-within:border focus-within:border-neutral-500 transition-colors">
        <input
          type="email"
          placeholder="name@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent text-[14px] font-semibold leading-[145%] text-white placeholder:text-[#B0B0B0] outline-none"
        />
      </div>

      {/* 3. View Only Dropdown Field */}
      <div
        onClick={() =>
          setPermission(permission === "View Only" ? "Can Edit" : "View Only")
        }
        className="flex items-center justify-between w-full h-[36px] p-[8px_15px] rounded-[8px] bg-[#2E2E2E] hover:bg-[#353535] cursor-pointer transition-colors"
      >
        <span className="text-white text-[14px] font-semibold leading-[145%]">
          {permission}
        </span>
        <Icon name="chevron-down" size={14} className="text-neutral-400" />
      </div>

      {/* 4. Workspace Row */}
      <div className="flex items-center gap-3 w-full py-1">
        {/* Workspace Purple Icon Badge */}
        <div className="w-8 h-8 rounded-[8px] bg-[#6F01D0] flex items-center justify-center text-white shrink-0 shadow-sm">
          <Icon name="workspace-badge" size={18} />
        </div>

        {/* Workspace Text & Subtext */}
        <div className="flex flex-col items-start gap-[4px] flex-1 min-w-0">
          <span className="text-white text-[14px] font-semibold leading-[145%] truncate w-full">
            My Workspace
          </span>
          <span className="text-[#989898] text-[12px] font-normal leading-normal truncate w-full">
            All workspace members can access
          </span>
        </div>
      </div>

      {/* 5. Divider (311px width, 1px height, #2E2E2E) */}
      <div className="w-full h-[1px] bg-[#2E2E2E] my-0.5" />

      {/* 6. Project Link Row */}
      <div className="flex items-center gap-[16px] w-full">
        {/* 24px Link Icon */}
        <div className="w-[24px] h-[24px] aspect-square flex items-center justify-center text-white shrink-0">
          <Icon name="link" size={20} />
        </div>

        {/* Project Link Text & Anyone Can View */}
        <div className="flex flex-col items-start gap-[2px] flex-1 min-w-0">
          <span className="text-white text-[14px] font-semibold leading-[145%] truncate w-full">
            Project link
          </span>
          <div className="flex items-center gap-[4px] cursor-pointer text-[#989898] hover:text-white transition-colors">
            <span className="text-[12px] font-normal leading-normal">
              Anyone can view
            </span>
            <Icon name="chevron-down" size={12} className="w-[16px] h-[16px]" />
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-[8px] p-[6px_8px] rounded-[8px] bg-[#2E2E2E] hover:bg-[#383838] active:bg-[#252525] text-white text-[12px] font-semibold leading-[145%] transition-colors cursor-pointer shrink-0"
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* 7. Owner Row */}
      <div className="flex items-center gap-[8px] w-full pt-1">
        {/* Owner Avatar */}
        <div className="w-8 h-8 rounded-full border border-neutral-700/60 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-teal-800 flex items-center justify-center p-0.5 shrink-0">
          <div className="w-full h-full rounded-full bg-zinc-950/80 flex items-center justify-center text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
            👁️
          </div>
        </div>

        {/* Owner Name & Access Dropdown */}
        <div className="flex flex-col items-start gap-[2px] flex-1 min-w-0">
          <span className="text-white text-[14px] font-semibold leading-[145%] truncate w-full">
            Henry Osuji
          </span>
          <div className="flex items-center gap-[4px] cursor-pointer text-[#989898] hover:text-white transition-colors">
            <span className="text-[12px] font-normal leading-normal">
              Owner
            </span>
            <Icon name="chevron-down" size={12} className="w-[16px] h-[16px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
