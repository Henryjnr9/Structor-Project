import React, { useEffect, useRef } from "react";
import Icon from "./Icon";

export default function EntityContextMenu({
  isOpen = false,
  onClose,
  onRename,
  onDuplicate,
  onExport,
  onDelete,
  onPermission,
  onCopy,
  onMove,
  style = {},
  className = "",
}) {
  const menuRef = useRef(null);

  // Auto close on click outside with safe listener attachment
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    // Delay listener by 1 tick so the button click itself doesn't close it immediately
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuSections = [
    // Section 1
    [
      {
        id: "rename",
        label: "Rename",
        icon: "pencil",
        shortcut: "Ret",
        action: onRename,
      },
      {
        id: "duplicate",
        label: "Duplicate",
        icon: "duplicate",
        shortcut: "⌘ D",
        action: onDuplicate,
      },
      {
        id: "export",
        label: "Export",
        icon: "export",
        shortcut: "E",
        action: onExport,
      },
      {
        id: "delete",
        label: "Delete",
        icon: "trash",
        shortcut: "Del",
        danger: true,
        action: onDelete,
      },
    ],
    // Section 2
    [
      {
        id: "permission",
        label: "Permission",
        icon: "shield",
        shortcut: null,
        action: onPermission,
      },
      {
        id: "copy",
        label: "Copy",
        icon: "copy",
        shortcut: "⌘ C",
        action: onCopy,
      },
      {
        id: "move",
        label: "Move",
        icon: "folder",
        shortcut: "⌘ M",
        action: onMove,
      },
    ],
  ];

  return (
    <div
      ref={menuRef}
      style={style}
      className={`inline-flex flex-col items-center gap-[4px] p-[16px_8px] rounded-[8px] bg-[#1C1C1C] shadow-[0_4px_15.5px_0_rgba(0,0,0,0.09)] border border-[#2E2E2E] select-none z-50 animate-in fade-in zoom-in-95 duration-100 ${className}`}
    >
      {menuSections.map((section, sIndex) => (
        <React.Fragment key={sIndex}>
          <div className="flex flex-col gap-[2px] w-full">
            {section.map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  item.action?.();
                  onClose?.();
                }}
                className={`flex w-[253px] h-[36px] p-[8px] justify-between items-center rounded-[8px] bg-[#1C1C1C] hover:bg-[#3B3B3B] transition-colors cursor-pointer group ${
                  item.danger ? "text-red-500 hover:text-red-400" : "text-white"
                }`}
              >
                {/* Left: Icon and Label */}
                <div className="flex items-center gap-[8px] min-w-0">
                  <div
                    className={`w-[18px] h-[18px] aspect-square flex items-center justify-center shrink-0 ${
                      item.danger
                        ? "text-red-500 group-hover:text-red-400"
                        : "text-white"
                    }`}
                  >
                    <Icon name={item.icon} size={18} />
                  </div>

                  <span className="text-[14px] font-medium leading-[145%] truncate">
                    {item.label}
                  </span>
                </div>

                {/* Right: Shortcut text */}
                {item.shortcut && (
                  <span
                    className={`text-[12px] font-medium leading-[145%] shrink-0 pl-2 ${
                      item.danger ? "text-red-500/80" : "text-[#575757]"
                    }`}
                  >
                    {item.shortcut}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          {sIndex < menuSections.length - 1 && (
            <div className="w-[253px] h-[1px] bg-[#2E2E2E] my-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
