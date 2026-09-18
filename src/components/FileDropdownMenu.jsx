import React, { useEffect, useRef } from "react";

export default function FileDropdownMenu({
  isOpen = false,
  onClose,
  onRename,
  onVersionHistory,
  onPublish,
  onExport,
  onPermission,
  onFavourite,
  onMoveWorkspace,
  onMoveTrash,
  className = "",
}) {
  const menuRef = useRef(null);

  // Auto close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuSections = [
    // Section 1
    [
      {
        label: "Show Version History",
        shortcut: "⌘ Y",
        action: onVersionHistory,
      },
      { label: "Publish to Community", shortcut: "⌘ D", action: onPublish },
      { label: "Export", shortcut: "E", action: onExport },
    ],
    // Section 2
    [
      { label: "Permission", action: onPermission },
      { label: "Add to Favourite", action: onFavourite },
    ],
    // Section 3
    [
      { label: "Rename File", action: onRename },
      { label: "Move to Another Workspace", action: onMoveWorkspace },
      {
        label: "Move to Trash",
        shortcut: null,
        danger: true,
        action: onMoveTrash,
      },
    ],
  ];

  return (
    /* Dropdown Container: 239px width, #2E2E2E bg, 16px 8px padding, 8px radius */
    <div
      ref={menuRef}
      className={`flex flex-col items-center gap-[4px] w-[239px] p-[16px_8px] rounded-[8px] bg-[#2E2E2E] shadow-[0_4px_15.5px_0_rgba(0,0,0,0.09)] border border-[#3E3E3E] select-none z-50 animate-in fade-in zoom-in-95 duration-100 ${className}`}
    >
      {menuSections.map((section, sIndex) => (
        <React.Fragment key={sIndex}>
          {/* Items Container */}
          <div className="w-full flex flex-col gap-[2px]">
            {section.map((item, iIndex) => (
              <div
                key={iIndex}
                onClick={() => {
                  item.action?.();
                  onClose?.();
                }}
                className={`flex h-[36px] p-[8px] justify-between items-center self-stretch rounded-[6px] hover:bg-[#3A3A3A] transition-colors cursor-pointer ${
                  item.danger ? "text-red-500 hover:text-red-400" : "text-white"
                }`}
              >
                {/* Dropdown text */}
                <span className="text-[12px] font-medium leading-[145%] truncate">
                  {item.label}
                </span>

                {/* Command & Shortcut Key */}
                {item.shortcut && (
                  <span className="text-[12px] font-medium leading-[145%] text-[#575757] shrink-0">
                    {item.shortcut}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Divider: 223px width, 1px height, #4A4A4A bg */}
          {sIndex < menuSections.length - 1 && (
            <div className="w-full h-[1px] bg-[#4A4A4A] my-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
