import React, { useState, useRef, useEffect, useMemo } from "react";
import Icon from "./Icon";
import Button from "./Button";
import FileDropdownMenu from "./FileDropdownMenu";
import SelectEntityMenu, { ENTITY_TYPES } from "./SelectEntityMenu";
import EntityContextMenu from "./EntityContextMenu";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function LeftNav({
  entities = [],
  groups = [],
  setGroups,
  selectedEntity = null,
  onCreateEntity,
  onUpdateEntity,
  onDuplicateEntity,
  onDeleteEntity,
  onExportEntity,
  onSelectEntity,
  onSelectMapTab,
  assets = [],
  onAddAsset,
  // --- MAP & PINS PROPS ---
  maps = [],
  activeMapName = "Maps",
  onRenameMap, // Synchronizes map renaming with App.jsx
  pins = [],
  selectedPinId = null,
  onSelectPin,
  onUpdatePin,
  onDeletePin,
  onAddPin,
}) {
  const [activeTab, setActiveTab] = useState("Maps");

  // Project Name & Renaming state
  const [projectName, setProjectName] = useState("HNG Stage 6 fiction");
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Entity Creation & Context Menu state
  const [isEntityMenuOpen, setIsEntityMenuOpen] = useState(false);
  const [entityMenuPosition, setEntityMenuPosition] = useState({
    top: 140,
    left: 293,
  });
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedMapGroups, setExpandedMapGroups] = useState({});

  // Active Context Menu positioning & item (Supports both Entities and Pins!)
  const [activeMenuEntity, setActiveMenuEntity] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 295 });

  // Delete modal state
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [pinToDelete, setPinToDelete] = useState(null);

  // Inline rename state for entity items
  const [renamingEntityId, setRenamingEntityId] = useState(null);
  const [tempEntityName, setTempEntityName] = useState("");

  // Inline rename state for location pins
  const [renamingPinId, setRenamingPinId] = useState(null);
  const [tempPinName, setTempPinName] = useState("");

  // Local assets fallback
  const [localAssets, setLocalAssets] = useState(assets);
  const currentAssets = assets.length > 0 ? assets : localAssets;

  const fileInputRef = useRef(null);
  const renameInputRef = useRef(null);
  const entityRenameInputRef = useRef(null);
  const pinRenameInputRef = useRef(null);

  // Renaming map title state
  const [renamingMapTitle, setRenamingMapTitle] = useState(null);
  const [tempMapInput, setTempMapInput] = useState("");
  const mapRenameInputRef = useRef(null);

  // Derive unique Map Group Names from props or pins
  const mapGroupNames = useMemo(() => {
    const names = new Set();
    if (Array.isArray(maps) && maps.length > 0) {
      maps.forEach((m) => names.add(typeof m === "string" ? m : m.name));
    }
    if (activeMapName) names.add(activeMapName);
    pins.forEach((p) => {
      if (p.mapName) names.add(p.mapName);
      else if (p.mapId) names.add(p.mapId);
    });
    if (names.size === 0) names.add("Maps");
    return Array.from(names);
  }, [maps, activeMapName, pins]);

  // Auto-expand all map groups so locations are visible by default
  useEffect(() => {
    setExpandedMapGroups((prev) => {
      const next = { ...prev };
      mapGroupNames.forEach((name) => {
        if (next[name] === undefined) next[name] = true;
      });
      return next;
    });
  }, [mapGroupNames]);

  // Tab auto-sync when a pin is selected
  useEffect(() => {
    if (selectedPinId) {
      setActiveTab("Maps");
    }
  }, [selectedPinId]);

  // Tab auto-sync when an entity is selected
  useEffect(() => {
    if (selectedEntity) {
      setActiveTab("Entities");
    }
  }, [selectedEntity]);

  // Focus on project rename input
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  // Focus on entity item rename input
  useEffect(() => {
    if (renamingEntityId && entityRenameInputRef.current) {
      entityRenameInputRef.current.focus();
      entityRenameInputRef.current.select();
    }
  }, [renamingEntityId]);

  // Focus on location pin rename input
  useEffect(() => {
    if (renamingPinId && pinRenameInputRef.current) {
      pinRenameInputRef.current.focus();
      pinRenameInputRef.current.select();
    }
  }, [renamingPinId]);

  // Focus on map group rename input
  useEffect(() => {
    if (renamingMapTitle && mapRenameInputRef.current) {
      mapRenameInputRef.current.focus();
      mapRenameInputRef.current.select();
    }
  }, [renamingMapTitle]);

  const handleSaveProjectRename = () => {
    setIsRenaming(false);
    if (tempName.trim()) {
      setProjectName(tempName.trim());
    } else {
      setTempName(projectName);
    }
  };

  const handleSaveEntityRename = (item) => {
    setRenamingEntityId(null);
    if (tempEntityName.trim()) {
      onUpdateEntity?.({ ...item, name: tempEntityName.trim() });
    }
  };

  const handleSavePinRename = (pin) => {
    setRenamingPinId(null);
    if (tempPinName.trim()) {
      onUpdatePin?.({
        ...pin,
        name: tempPinName.trim(),
        description: tempPinName.trim(),
      });
    }
  };

  const handleSaveMapGroupRename = (oldName) => {
    setRenamingMapTitle(null);
    if (tempMapInput.trim() && tempMapInput.trim() !== oldName) {
      onRenameMap?.(oldName, tempMapInput.trim());
    }
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleMapGroup = (mapName) => {
    setExpandedMapGroups((prev) => ({
      ...prev,
      [mapName]: !prev[mapName],
    }));
  };

  const handleCreateEntity = (entityType) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [entityType.id]: true,
    }));

    const existingCount = entities.filter(
      (e) => e.typeId === entityType.id,
    ).length;
    const newEntity = {
      id: `${entityType.id}-${Date.now()}`,
      typeId: entityType.id,
      typeLabel: entityType.label,
      name: `${entityType.label} ${existingCount + 1}`,
      icon: entityType.icon,
    };

    onCreateEntity?.(newEntity);
    setIsEntityMenuOpen(false);
  };

  // Open Context Menu for both Entities and Location Pins
  const handleOpenContextMenu = (e, item) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.top, left: 295 });
    setActiveMenuEntity(item);
  };

  return (
    <aside className="w-[285px] h-screen bg-[#1C1C1C] text-zinc-100 border-r border-[#2E2E2E] flex flex-col items-start gap-[24px] p-[0_16px_40px_16px] pt-4 select-none shrink-0 relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const newAsset = {
              id: Date.now().toString(),
              name: file.name,
              uploader: "Added by You",
              date: "16 May 2026",
              url: URL.createObjectURL(file),
            };
            onAddAsset
              ? onAddAsset(newAsset)
              : setLocalAssets((p) => [newAsset, ...p]);
          }
        }}
        className="hidden"
      />

      {/* 1. Header: Project Selector */}
      <div className="w-full flex items-center justify-between pb-1 border-b border-transparent shrink-0 relative">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <Icon name="home" size={16} className="text-neutral-400 shrink-0" />

          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSaveProjectRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveProjectRename();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              className="bg-transparent text-sm font-medium text-white border-b border-[#6c00eb] outline-none w-full p-0"
            />
          ) : (
            <span
              onDoubleClick={() => setIsRenaming(true)}
              title="Double click to rename"
              className="text-sm font-medium truncate text-neutral-200 hover:text-white cursor-pointer transition-colors"
            >
              {projectName}
            </span>
          )}

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-[#2E2E2E] transition-colors cursor-pointer shrink-0"
          >
            <Icon name="chevron-down" size={13} />
          </button>
        </div>

        <div className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1">
          <Icon name="wifi-off" size={18} />
        </div>

        <FileDropdownMenu
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          onRename={() => setIsRenaming(true)}
          className="absolute top-10 left-0"
        />
      </div>

      {/* 2. Search Bar */}
      <div className="w-full flex items-center gap-2 shrink-0">
        <div className="flex-1 flex items-center bg-transparent border border-[#2E2E2E] rounded-[10px] px-3 py-1.5 text-sm text-neutral-300 focus-within:border-neutral-500 transition-colors">
          <Icon
            name="search"
            size={16}
            className="text-neutral-500 mr-2 shrink-0"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none placeholder:text-neutral-500 text-xs text-white"
          />
          <span className="text-[10px] text-neutral-400 bg-[#2E2E2E] px-1.5 py-0.5 rounded font-mono shrink-0">
            ⌘ k
          </span>
        </div>

        <button className="bg-transparent border border-[#2E2E2E] hover:bg-[#2E2E2E] rounded-[10px] p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0">
          <Icon name="filter" size={15} />
        </button>
      </div>

      {/* 3. Tabs */}
      <div className="w-full flex items-center gap-[4px] p-[4px_6px] rounded-[8px] border border-[#2E2E2E] bg-[#1C1C1C] shrink-0">
        {["Maps", "Entities", "Assets"].map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "Maps") onSelectMapTab?.();
              }}
              className={`flex-1 flex items-center justify-center p-[3px_10px] rounded-[5px] text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#3B3B3B] text-white font-semibold"
                  : "bg-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Area */}
      <div className="w-full flex-1 flex flex-col min-h-0">
        {/* ================= MAPS TAB: GROUPED BY MAP NAME ================= */}
        {activeTab === "Maps" && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
            {mapGroupNames.map((mapName) => {
              const mapPins = pins.filter(
                (p) => (p.mapName || p.mapId || "Maps") === mapName,
              );
              const isExpanded = Boolean(expandedMapGroups[mapName]);

              return (
                <div key={mapName} className="flex flex-col w-full">
                  {/* Map Group Accordion Header */}
                  <div
                    onClick={() => toggleMapGroup(mapName)}
                    className="flex items-center justify-between w-full py-1.5 px-1 rounded-[6px] hover:bg-[#252528] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <Icon
                        name="map"
                        size={18}
                        className="text-white shrink-0"
                      />

                      {renamingMapTitle === mapName ? (
                        <input
                          ref={mapRenameInputRef}
                          type="text"
                          value={tempMapInput}
                          onChange={(e) => setTempMapInput(e.target.value)}
                          onBlur={() => handleSaveMapGroupRename(mapName)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSaveMapGroupRename(mapName);
                            if (e.key === "Escape") setRenamingMapTitle(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-transparent text-sm font-medium text-white border-b border-[#6c00eb] outline-none w-full p-0"
                        />
                      ) : (
                        <span
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setRenamingMapTitle(mapName);
                            setTempMapInput(mapName);
                          }}
                          title="Double click to rename"
                          className="text-sm font-medium text-white truncate cursor-pointer hover:text-purple-300 transition-colors"
                        >
                          {mapName}
                        </span>
                      )}

                      {mapPins.length > 0 && (
                        <span className="text-[10px] text-neutral-400 bg-[#2E2E2E] px-1.5 py-0.5 rounded-full shrink-0">
                          {mapPins.length}
                        </span>
                      )}
                    </div>

                    <Icon
                      name="chevron-right"
                      size={14}
                      className={`text-neutral-400 transition-transform duration-150 shrink-0 ${
                        isExpanded ? "rotate-90 text-white" : ""
                      }`}
                    />
                  </div>

                  {/* Indented Location Pins under this Map Group */}
                  {isExpanded && (
                    <div className="flex flex-col gap-1 pl-4 mt-0.5">
                      {mapPins.length === 0 ? (
                        <div className="flex items-center gap-2 text-neutral-500 text-xs py-1 px-2">
                          <Icon
                            name="pin"
                            size={13}
                            className="text-neutral-600 shrink-0"
                          />
                          <span>No pins on this map yet....</span>
                        </div>
                      ) : (
                        mapPins.map((pin) => {
                          const isSelected = selectedPinId === pin.id;
                          const isPinRenaming = renamingPinId === pin.id;

                          return (
                            <div
                              key={pin.id}
                              onClick={() => {
                                onSelectPin?.(pin);
                                onSelectMapTab?.(mapName);
                              }}
                              className={`flex items-center justify-between py-1.5 px-2.5 rounded-[8px] transition-colors cursor-pointer group relative ${
                                isSelected
                                  ? "bg-[#2E2E2E] text-white font-medium"
                                  : "text-neutral-300 hover:bg-[#2E2E2E]/60 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                                <Icon
                                  name="pin"
                                  size={15}
                                  className={`shrink-0 ${
                                    isSelected
                                      ? "text-purple-400"
                                      : "text-neutral-400 group-hover:text-white"
                                  }`}
                                />

                                {isPinRenaming ? (
                                  <input
                                    ref={pinRenameInputRef}
                                    type="text"
                                    value={tempPinName}
                                    onChange={(e) =>
                                      setTempPinName(e.target.value)
                                    }
                                    onBlur={() => handleSavePinRename(pin)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleSavePinRename(pin);
                                      if (e.key === "Escape")
                                        setRenamingPinId(null);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-transparent text-xs text-white border-b border-[#6c00eb] outline-none w-full p-0"
                                  />
                                ) : (
                                  <span className="text-xs truncate">
                                    {pin.name || "Untitled Location"}
                                  </span>
                                )}
                              </div>

                              {/* Three-dots Menu button -> CALLS ENTITY CONTEXT MENU! */}
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleOpenContextMenu(e, {
                                    ...pin,
                                    isPin: true,
                                  })
                                }
                                className="text-neutral-500 hover:text-white p-0.5 rounded transition-colors"
                              >
                                <Icon name="dots-horizontal" size={14} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ================= ENTITIES TAB ================= */}
        {activeTab === "Entities" && (
          <div className="w-full flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between w-full pb-3 shrink-0 relative z-30">
              <span className="text-xs font-semibold text-neutral-200">
                Entities
              </span>

              {/* Add Entity (+) button & Dropdown container */}
              <div className="relative group flex items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    // Accurately capture top of plus button and position at 293px (8px outside LeftNav)
                    setEntityMenuPosition({ top: rect.top, left: 293 });
                    setIsEntityMenuOpen((prev) => !prev);
                  }}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-[#2E2E2E] transition-colors cursor-pointer outline-none focus:outline-none"
                >
                  <Icon name="plus" size={16} />
                </button>

                {/* Hover Tooltip: Restored above the plus button */}
                {!isEntityMenuOpen && (
                  <div className="absolute right-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center bg-[#1C1C1C] border border-[#2E2E2E] px-2 py-1 rounded-[6px] text-[10px] font-medium text-neutral-200 shadow-xl pointer-events-none whitespace-nowrap z-50">
                    Add Entity
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1">
              {groups.map((groupId) => {
                const groupEntities = entities.filter(
                  (e) => e.typeId === groupId,
                );
                const isExpanded = Boolean(expandedGroups[groupId]);
                const groupMeta = ENTITY_TYPES.find(
                  (t) => t.id === groupId,
                ) || {
                  label: groupId.charAt(0).toUpperCase() + groupId.slice(1),
                  icon: groupId,
                };

                return (
                  <div key={groupId} className="flex flex-col w-full">
                    <div
                      onClick={() => toggleGroup(groupId)}
                      className="flex items-center justify-between w-full py-1.5 px-1 rounded-[6px] hover:bg-[#252528] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          name={groupMeta.icon}
                          size={18}
                          className="text-white"
                        />
                        <span className="text-sm font-medium text-white">
                          {groupMeta.label}
                        </span>
                      </div>
                      <Icon
                        name="chevron-right"
                        size={14}
                        className={`text-neutral-400 transition-transform duration-150 ${
                          isExpanded ? "rotate-90 text-white" : ""
                        }`}
                      />
                    </div>

                    {isExpanded && groupEntities.length > 0 && (
                      <div className="flex flex-col gap-1 pl-4 mt-0.5">
                        {groupEntities.map((item) => {
                          const isSelected = selectedEntity?.id === item.id;
                          const isItemRenaming = renamingEntityId === item.id;

                          return (
                            <div
                              key={item.id}
                              onClick={() => onSelectEntity?.(item)}
                              className={`flex items-center justify-between py-1.5 px-2.5 rounded-[8px] transition-colors cursor-pointer group/item relative ${
                                isSelected
                                  ? "bg-[#2E2E2E] text-white font-medium"
                                  : "text-neutral-300 hover:bg-[#2E2E2E]/60 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                                <Icon
                                  name={item.icon}
                                  size={16}
                                  className="shrink-0 text-white"
                                />
                                {isItemRenaming ? (
                                  <input
                                    ref={entityRenameInputRef}
                                    type="text"
                                    value={tempEntityName}
                                    onChange={(e) =>
                                      setTempEntityName(e.target.value)
                                    }
                                    onBlur={() => handleSaveEntityRename(item)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleSaveEntityRename(item);
                                      if (e.key === "Escape")
                                        setRenamingEntityId(null);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-transparent text-xs text-white border-b border-[#6c00eb] outline-none w-full p-0"
                                  />
                                ) : (
                                  <span className="text-xs truncate">
                                    {item.name}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(e) => handleOpenContextMenu(e, item)}
                                className="text-neutral-500 hover:text-white p-0.5 rounded transition-colors"
                              >
                                <Icon name="dots-horizontal" size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= ASSETS TAB ================= */}
        {activeTab === "Assets" && (
          <div className="w-full flex flex-col gap-4 overflow-y-auto pr-1 flex-1">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-neutral-200">
                Assets
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-neutral-400 hover:text-white p-1 rounded hover:bg-[#2E2E2E] transition-colors cursor-pointer"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>

            {currentAssets.length === 0 ? (
              <p className="text-xs text-neutral-400 font-medium">
                No Assets found
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {currentAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-2.5 p-1.5 rounded-[10px] bg-[#141416] border border-[#2E2E2E]/60 hover:border-neutral-500 transition-colors cursor-pointer"
                  >
                    <img
                      src={asset.url}
                      alt=""
                      className="w-9 h-9 rounded-[7px] object-cover"
                    />
                    <span className="text-xs font-medium text-white truncate flex-1">
                      {asset.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= FIXED SELECT ENTITY MENU (ALIGNED WITH PLUS ICON & 8px SPACING) ================= */}
      {isEntityMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: `${entityMenuPosition.top}px`,
            left: "293px",
            zIndex: 9999,
          }}
        >
          <SelectEntityMenu
            isOpen={isEntityMenuOpen}
            onClose={() => setIsEntityMenuOpen(false)}
            onSelectEntity={handleCreateEntity}
            className="!static !left-0 !top-0"
          />
        </div>
      )}

      {/* ================= SHARED ENTITY CONTEXT MENU (Handles Entities & Location Pins) ================= */}
      {activeMenuEntity && (
        <EntityContextMenu
          isOpen={Boolean(activeMenuEntity)}
          onClose={() => setActiveMenuEntity(null)}
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
          }}
          onRename={() => {
            if (activeMenuEntity.isPin) {
              setTempPinName(activeMenuEntity.name);
              setRenamingPinId(activeMenuEntity.id);
            } else {
              setTempEntityName(activeMenuEntity.name);
              setRenamingEntityId(activeMenuEntity.id);
            }
            setActiveMenuEntity(null);
          }}
          onDuplicate={() => {
            if (activeMenuEntity.isPin) {
              const duplicated = {
                ...activeMenuEntity,
                id: `pin-${Date.now()}`,
                name: `${activeMenuEntity.name} (Copy)`,
                x: Math.min(Number(activeMenuEntity.x) + 3, 95),
                y: Math.min(Number(activeMenuEntity.y) + 3, 95),
              };
              onAddPin?.(duplicated);
            } else {
              onDuplicateEntity?.(activeMenuEntity);
            }
            setActiveMenuEntity(null);
          }}
          onExport={() => {
            if (activeMenuEntity.isPin) {
              const exportData = {
                name: activeMenuEntity.name,
                type: "Location Pin",
                id: activeMenuEntity.id,
                map: activeMenuEntity.mapName || "Maps",
                coordinates: { x: activeMenuEntity.x, y: activeMenuEntity.y },
                description: activeMenuEntity.description || "",
                links: activeMenuEntity.links || [],
              };
              const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(exportData, null, 2));
              const a = document.createElement("a");
              a.setAttribute("href", dataStr);
              a.setAttribute(
                "download",
                `${activeMenuEntity.name.replace(/\s+/g, "_")}.json`,
              );
              document.body.appendChild(a);
              a.click();
              a.remove();
            } else {
              onExportEntity?.(activeMenuEntity);
            }
            setActiveMenuEntity(null);
          }}
          onDelete={() => {
            if (activeMenuEntity.isPin) {
              setPinToDelete(activeMenuEntity);
            } else {
              setEntityToDelete(activeMenuEntity);
            }
            setActiveMenuEntity(null);
          }}
          onPermission={() => {
            alert(`Permissions for ${activeMenuEntity.name}`);
            setActiveMenuEntity(null);
          }}
          onCopy={() => {
            navigator.clipboard?.writeText(window.location.href);
            alert(`Link to ${activeMenuEntity.name} copied!`);
            setActiveMenuEntity(null);
          }}
          onMove={() => {
            alert(`Move ${activeMenuEntity.name}`);
            setActiveMenuEntity(null);
          }}
        />
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <DeleteConfirmModal
        isOpen={Boolean(entityToDelete || pinToDelete)}
        onClose={() => {
          setEntityToDelete(null);
          setPinToDelete(null);
        }}
        onConfirm={() => {
          if (entityToDelete) {
            onDeleteEntity?.(entityToDelete.id);
            setEntityToDelete(null);
          } else if (pinToDelete) {
            onDeletePin?.(pinToDelete.id);
            setPinToDelete(null);
          }
        }}
        entityName={entityToDelete?.name || pinToDelete?.name}
      />
    </aside>
  );
}
