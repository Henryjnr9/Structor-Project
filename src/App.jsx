import React, { useState } from "react";
import LeftNav from "./components/LeftNav";
import RightNav from "./components/RightNav";
import BottomNav from "./components/BottomNav";
import MapView from "./pages/MapView";
import EntityView from "./pages/EntityView";

export default function App() {
  const [entities, setEntities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Map Tools, Zoom & Pins state
  const [mapTool, setMapTool] = useState("move");
  const [mapZoom, setMapZoom] = useState(25);
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  // --- MAPS STATE & RENAME SYNC ---
  const [maps, setMaps] = useState(["Maps"]);
  const [activeMapName, setActiveMapName] = useState("Maps");

  // Robust rename handler: works with onRenameMap(newName) OR onRenameMap(oldName, newName)
  const handleRenameMap = (arg1, arg2) => {
    const oldName = (arg2 !== undefined ? arg1 : activeMapName) || "Maps";
    const newName = (arg2 !== undefined ? arg2 : arg1) || "";

    if (!newName.trim() || oldName === newName.trim()) return;
    const cleanNewName = newName.trim();

    // 1. Update map names array
    setMaps((prev) =>
      prev.includes(oldName)
        ? prev.map((m) => (m === oldName ? cleanNewName : m))
        : [...prev, cleanNewName],
    );

    // 2. Update active map name if the active one was renamed
    if (activeMapName === oldName || !maps.includes(activeMapName)) {
      setActiveMapName(cleanNewName);
    }

    // 3. Update all pins belonging to this map
    setPins((prev) =>
      prev.map((pin) => {
        const pinMap = pin.mapName || "Maps";
        return pinMap === oldName ? { ...pin, mapName: cleanNewName } : pin;
      }),
    );
  };

  const handleAddNewMap = (newMapName = "New Map") => {
    const uniqueName = maps.includes(newMapName)
      ? `${newMapName} ${maps.length + 1}`
      : newMapName;
    setMaps((prev) => [...prev, uniqueName]);
    setActiveMapName(uniqueName);
  };

  // --- ENTITY HANDLERS ---
  const handleCreateEntity = (newEntity) => {
    setEntities((prev) => [...prev, newEntity]);
    if (!groups.includes(newEntity.typeId)) {
      setGroups((prev) => [...prev, newEntity.typeId]);
    }
    setSelectedEntity(newEntity);
  };

  const handleUpdateEntity = (updated) => {
    setSelectedEntity(updated);
    setEntities((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleDuplicateEntity = (entity) => {
    const duplicated = {
      ...entity,
      id: `${entity.typeId}-${Date.now()}`,
      name: `${entity.name} (Copy)`,
    };
    setEntities((prev) => [...prev, duplicated]);
    setSelectedEntity(duplicated);
  };

  const handleDeleteEntity = (entityId) => {
    setEntities((prev) => prev.filter((item) => item.id !== entityId));
    if (selectedEntity?.id === entityId) {
      setSelectedEntity(null);
    }
  };

  const handleExportEntity = (entity) => {
    const exportData = {
      name: entity.name,
      type: entity.typeLabel,
      id: entity.id,
      exportedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "2026",
      }),
      description: "World building entity export",
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${entity.name.replace(/\s+/g, "_")}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // --- PIN HANDLERS ---
  const handleAddPin = (newPin) => {
    // Ensure every pin is guaranteed to be tagged with the active map name
    const pinWithMap = {
      ...newPin,
      mapName: newPin.mapName || activeMapName || "Maps",
    };
    setPins((prev) => [...prev, pinWithMap]);
    setSelectedPin(pinWithMap);
  };

  const handleUpdatePin = (updatedPin) => {
    setSelectedPin(updatedPin);
    setPins((prev) =>
      prev.map((p) => (p.id === updatedPin.id ? updatedPin : p)),
    );
  };

  const handleDeletePin = (pinId) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    if (selectedPin?.id === pinId) {
      setSelectedPin(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0e0e10] text-zinc-100">
      {/* 1. Left Navigation */}
      <LeftNav
        entities={entities}
        groups={groups}
        maps={maps}
        activeMapName={activeMapName}
        onRenameMap={handleRenameMap}
        pins={pins}
        selectedPinId={selectedPin?.id}
        onSelectPin={(pin) => {
          setSelectedPin(pin);
          setSelectedEntity(null);
        }}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
        onAddPin={handleAddPin}
        setGroups={setGroups}
        selectedEntity={selectedEntity}
        onCreateEntity={handleCreateEntity}
        onUpdateEntity={handleUpdateEntity}
        onDuplicateEntity={handleDuplicateEntity}
        onDeleteEntity={handleDeleteEntity}
        onExportEntity={handleExportEntity}
        onSelectEntity={(entity) => {
          setSelectedEntity(entity);
          setSelectedPin(null);
        }}
        onSelectMapTab={(mapName) => {
          if (mapName) setActiveMapName(mapName);
          setSelectedEntity(null);
          setSelectedPin(null);
        }}
      />

      {/* 2. Main Center Workspace */}
      <main className="flex-1 relative h-full overflow-hidden">
        {!selectedEntity ? (
          <>
            <MapView
              maps={maps}
              activeMapName={activeMapName}
              onRenameMap={handleRenameMap}
              onAddNewMap={handleAddNewMap}
              onSelectMapTab={(mapName) => setActiveMapName(mapName)}
              pins={pins}
              selectedPinId={selectedPin?.id}
              activeTool={mapTool}
              zoom={mapZoom}
              onZoomChange={(newZoom) => setMapZoom(newZoom)}
              onAddPin={handleAddPin}
              onSelectPin={(pin) => setSelectedPin(pin)}
              onDeselectPin={() => setSelectedPin(null)}
            />

            {/* Floating Bottom Nav */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
              <BottomNav
                mode="map"
                activeTool={mapTool}
                onToolSelect={(tool) => setMapTool(tool)}
                zoom={mapZoom}
                onZoomChange={(newZoom) => setMapZoom(newZoom)}
              />
            </div>
          </>
        ) : (
          <EntityView
            entity={selectedEntity}
            onUpdateEntity={handleUpdateEntity}
          />
        )}
      </main>

      {/* 3. Right Navigation */}
      <RightNav
        selectedEntity={selectedEntity}
        selectedPin={selectedPin}
        activeTool={mapTool}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
      />
    </div>
  );
}
