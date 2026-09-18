import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

export default function PageHeader({
  initialTitle = "Maps",
  iconName = "map",
  onTitleChange,
  onOptionsClick,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const trimmed = title.trim();
    if (trimmed) {
      setTitle(trimmed);
      if (onTitleChange) onTitleChange(trimmed);
    } else {
      setTitle(initialTitle);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  return (
    <header className="w-[801px] flex items-center justify-between select-none">
      {/* Map and map icon container */}
      <div className="flex items-center gap-[8px] min-w-0 flex-1">
        {/* Map icon (36px x 36px) */}
        <div className="w-[36px] h-[36px] flex items-center justify-center shrink-0 text-white">
          <Icon name={iconName} size={36} />
        </div>

        {/* Inline editable map text */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-white text-[36px] font-medium leading-[145%] border-b border-[#6c00eb] outline-none max-w-[650px] p-0"
          />
        ) : (
          <h1
            onClick={() => setIsEditing(true)}
            title="Click to rename"
            className="text-white text-[36px] font-medium leading-[145%] truncate cursor-pointer hover:opacity-80 transition-opacity"
          >
            {title}
          </h1>
        )}
      </div>

      {/* Three dot icon (24px x 24px, aspect-ratio: 1/1) */}
      <div className="relative group">
        <button
          onClick={onOptionsClick}
          className="w-[24px] h-[24px] shrink-0 aspect-square flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Icon name="dots-vertical" size={24} weight="bold" />
        </button>

        <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex items-center bg-[#1C1C1C] border border-[#2E2E2E] px-2 py-1 rounded-[6px] text-[10px] font-medium text-neutral-200 shadow-xl pointer-events-none whitespace-nowrap z-50">
          More Options
        </div>
      </div>
    </header>
  );
}
