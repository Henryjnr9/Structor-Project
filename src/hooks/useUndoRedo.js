import { useState, useRef, useEffect, useCallback } from "react";

export default function useUndoRedo(initialState) {
  const [state, setState] = useState(initialState);

  // Use refs so undo and redo never get stale or out-of-sync
  const historyRef = useRef({
    past: [],
    present: initialState,
    future: [],
  });

  // Keep present in sync
  historyRef.current.present = state;

  // Set new state and record snapshot in history
  const set = useCallback((newPresent) => {
    const resolved =
      typeof newPresent === "function"
        ? newPresent(historyRef.current.present)
        : newPresent;

    historyRef.current.past.push(historyRef.current.present);
    historyRef.current.present = resolved;
    historyRef.current.future = []; // Clear redo stack on new action
    setState(resolved);
  }, []);

  // 1. Undo
  const undo = useCallback(() => {
    const { past, present, future } = historyRef.current;
    if (past.length === 0) return;

    const previous = past.pop();
    future.unshift(present);
    historyRef.current.present = previous;
    setState(previous);
  }, []);

  // 2. Redo
  const redo = useCallback(() => {
    const { past, present, future } = historyRef.current;
    if (future.length === 0) return;

    const next = future.shift();
    past.push(present);
    historyRef.current.present = next;
    setState(next);
  }, []);

  // 3. Global Keyboard Shortcuts Listener (Cmd+Z, Ctrl+Z, Cmd+Shift+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Trigger on either Mac Command key (metaKey) or Windows Control key (ctrlKey)
      const isModifier = e.metaKey || e.ctrlKey;
      if (!isModifier) return;

      const key = e.key.toLowerCase();

      // Undo: Cmd + Z or Ctrl + Z (without Shift)
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Cmd + Shift + Z or Ctrl + Shift + Z or Ctrl + Y
      if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [undo, redo]);

  return [state, set, { undo, redo }];
}
