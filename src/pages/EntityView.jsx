import React, { useState, useRef, useEffect } from "react";
import Icon from "../components/Icon";
import useUndoRedo from "../hooks/useUndoRedo";

export default function EntityView({ entity, onUpdateEntity }) {
  const [docState, setDocState] = useUndoRedo({
    title: entity?.name || "Character 1",
    subTabs: ["Overview"],
    activeSubTab: "Overview",
    textBlocks: [],
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (entity && entity.name !== docState.title) {
      setDocState((prev) => ({
        ...prev,
        title: entity.name,
      }));
      setIsEditingTitle(false);
    }
  }, [entity]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = (newTitle) => {
    setIsEditingTitle(false);
    const trimmed = newTitle.trim();
    if (trimmed) {
      setDocState((prev) => ({ ...prev, title: trimmed }));
      onUpdateEntity?.({ ...entity, name: trimmed });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle(e.target.value);
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  const handleAddTab = () => {
    const newTabName = `Tab ${docState.subTabs.length + 1}`;
    setDocState((prev) => ({
      ...prev,
      subTabs: [...prev.subTabs, newTabName],
      activeSubTab: newTabName,
    }));
  };

  const handleAddTextBlock = () => {
    setDocState((prev) => ({
      ...prev,
      textBlocks: [...prev.textBlocks, { id: Date.now(), content: "" }],
    }));
  };

  const handleUpdateBlockContent = (id, newContent) => {
    setDocState((prev) => ({
      ...prev,
      textBlocks: prev.textBlocks.map((b) =>
        b.id === id ? { ...b, content: newContent } : b,
      ),
    }));
  };

  const handleDeleteBlock = (id) => {
    setDocState((prev) => ({
      ...prev,
      textBlocks: prev.textBlocks.filter((b) => b.id !== id),
    }));
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center bg-[#0d0d10] text-zinc-100 overflow-hidden select-none">
      {/* Subtle grid canvas background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #52525b 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Document Column: 801px width, 52px from top */}
      <div className="w-full max-w-[801px] flex flex-col gap-6 pt-[52px] z-10 px-4 h-full overflow-y-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-[10px] min-w-0 flex-1">
            <div className="w-[36px] h-[36px] flex items-center justify-center text-white shrink-0">
              <Icon name={entity?.icon || "character"} size={32} />
            </div>

            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                defaultValue={docState.title}
                onBlur={(e) => handleSaveTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                className="bg-transparent text-white text-[36px] font-medium leading-[145%] border-b border-[#6c00eb] outline-none max-w-[650px] p-0"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                title="Click to rename"
                className="text-white text-[36px] font-medium leading-[145%] truncate cursor-pointer hover:opacity-85 transition-opacity"
              >
                {docState.title}
              </h1>
            )}
          </div>

          <button
            title="Options"
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <Icon name="dots-vertical" size={24} weight="bold" />
          </button>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="flex items-center gap-3 border-b border-[#2E2E2E]/40 pb-2">
          {docState.subTabs.map((tab) => {
            const isActive = docState.activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() =>
                  setDocState((prev) => ({ ...prev, activeSubTab: tab }))
                }
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Icon name="manuscripts" size={16} />
                <span>{tab}</span>
              </button>
            );
          })}

          <button
            onClick={handleAddTab}
            className="flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer pl-1"
          >
            <Icon name="plus" size={14} />
            <span>Add New Tab</span>
          </button>
        </div>

        {/* Document Body */}
        <div className="flex-1 flex flex-col gap-4 pt-4 pb-28">
          {docState.textBlocks.map((block, index) => (
            <div
              key={block.id}
              className="w-full flex items-start gap-3 group relative"
            >
              <textarea
                autoFocus={index === docState.textBlocks.length - 1}
                placeholder="Type your lore, backstories, traits..."
                value={block.content}
                onChange={(e) =>
                  handleUpdateBlockContent(block.id, e.target.value)
                }
                rows={2}
                className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 outline-none resize-none leading-relaxed border-b border-transparent focus:border-[#2E2E2E] pb-2"
              />
              <button
                onClick={() => handleDeleteBlock(block.id)}
                className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 p-1 rounded transition-all cursor-pointer text-xs"
                title="Delete block"
              >
                ✕
              </button>
            </div>
          ))}

          {/* (+) Click to add Text */}
          <div
            onClick={handleAddTextBlock}
            className="flex items-center gap-3 cursor-pointer group py-2"
          >
            <div className="w-8 h-8 rounded-full bg-[#242428] border border-[#2E2E2E] group-hover:bg-[#2E2E2E] group-hover:border-neutral-500 flex items-center justify-center text-neutral-400 group-hover:text-white transition-all">
              <Icon name="plus" size={16} />
            </div>
            <span className="text-sm font-normal text-neutral-500 group-hover:text-neutral-300 transition-colors">
              Click to add Text
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
