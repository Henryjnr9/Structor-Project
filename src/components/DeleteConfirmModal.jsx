import React, { useEffect } from "react";
import Icon from "./Icon";
import Button from "./Button";

export default function DeleteConfirmModal({
  isOpen = false,
  onClose,
  onConfirm,
  entityName = "this entity",
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-5 w-[420px] max-w-full p-6 rounded-[16px] bg-[#1C1C1C] border border-[#2E2E2E] shadow-2xl"
      >
        {/* Header Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
            <Icon name="trash" size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Delete Entity?
            </h3>
            <p className="text-xs text-neutral-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Description Body */}
        <p className="text-xs text-neutral-300 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">"{entityName}"</span>? All
          associated notes, tabs, and blocks will be permanently removed.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#2E2E2E]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className="px-4 py-2 rounded-[8px] bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
