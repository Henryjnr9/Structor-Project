import React, { useState, useRef, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import Button from "../components/Button";
import ManageAssetModal from "../components/ManageAssetModal";

export default function MapView({
  maps = ["Maps"],
  activeMapName = "Maps",
  onRenameMap,
  onAddNewMap,
  onSelectMapTab,
  pins = [],
  selectedPinId = null,
  activeTool = "move",
  zoom = 25,
  onZoomChange,
  onAddPin,
  onSelectPin,
  onDeselectPin,
  onMapLoaded,
}) {
  const [mapImage, setMapImage] = useState(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  // Pan state: stores X & Y pixel offset
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const viewportRef = useRef(null);
  const mapContainerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const zoomScale = zoom / 25;

  // Reset pan whenever zoom resets to 25% (Fit to Screen)
  useEffect(() => {
    if (zoom === 25) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Track spacebar for quick canvas panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.code === "Space" &&
        !e.repeat &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA"
      ) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Pinch-to-zoom & two-finger scroll gestures
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !mapImage) return;

    const handleWheel = (e) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        const zoomDelta = -e.deltaY * 0.15;
        const nextZoom = Math.min(
          Math.max(Math.round(zoom + zoomDelta), 10),
          200,
        );
        onZoomChange?.(nextZoom);
      } else {
        setPan((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [zoom, onZoomChange, mapImage]);

  // Mouse drag panning
  const handleMouseDown = (e) => {
    const isPanTool = activeTool === "pan";
    const isMiddleClick = e.button === 1;

    if (isPanTool || isSpacePressed || isMiddleClick) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Drop a Pin tagged with activeMapName
  const handleMapClick = (e) => {
    if (isDragging) return;

    if (activeTool === "pin" && mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newPinNumber = pins.length + 1;
      const newPin = {
        id: `pin-${Date.now()}`,
        name: `Locations ${newPinNumber}`,
        description: "Capital district of Valerith Citadel",
        x,
        y,
        links: [],
        zoomMin: 0,
        zoomMax: 100,
        mapName: activeMapName || "Maps", // 👈 Automatically tags with active map
      };

      onAddPin?.(newPin);
    } else if (activeTool === "move") {
      onDeselectPin?.();
    }
  };

  const TOOL_HINTS = {
    pin: {
      text: "Click on any part of the map to pin or create a Location",
      shortcut: "P",
    },
    pen: { text: "Click to place first point", shortcut: "B" },
    ruler: { text: "Click two points to measure distance", shortcut: "R" },
    text: { text: "Click anywhere to place text", shortcut: "T" },
    comment: { text: "Click to add a comment pin", shortcut: "C" },
    pan: { text: "Click and drag to pan the map", shortcut: "H" },
  };

  const currentHint = TOOL_HINTS[activeTool];

  return (
    <div
      ref={viewportRef}
      onMouseDown={handleMouseDown}
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#0d0d10] select-none ${
        isSpacePressed || activeTool === "pan"
          ? isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : activeTool === "pin"
            ? "cursor-crosshair"
            : "cursor-default"
      }`}
    >
      {/* 1. Page Header & Sub-Tabs */}
      <div className="absolute top-[52px] z-20 w-[801px] max-w-full px-4 flex flex-col gap-2 pointer-events-auto">
        <PageHeader
          key={activeMapName} // Re-syncs header whenever renamed externally
          title={activeMapName}
          initialTitle={activeMapName}
          iconName="map"
          onTitleChange={(newTitle) => {
            if (newTitle && newTitle.trim()) {
              onRenameMap?.(activeMapName, newTitle.trim()); // 👈 Renames everywhere!
            }
          }}
          onOptionsClick={() => console.log("Options clicked")}
        />

        {mapImage && (
          <div className="flex items-center gap-3 pt-1">
            {maps.map((tab) => (
              <button
                key={tab}
                onClick={() => onSelectMapTab?.(tab)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  activeMapName === tab
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Icon name="map" size={14} />
                <span>{tab}</span>
              </button>
            ))}

            <button
              onClick={() => setIsAssetModalOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            >
              <Icon name="plus" size={12} />
              <span>Add New Map</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Canvas */}
      {!mapImage ? (
        <div className="flex flex-col items-center justify-center gap-[16px] w-[280px] select-none text-center z-10">
          <div className="w-[50px] h-[50px] aspect-square flex items-center justify-center text-white shrink-0">
            <Icon name="pin" size={50} />
          </div>

          <div className="flex flex-col gap-1 w-full self-stretch">
            <h2 className="text-white text-[24px] font-medium leading-[145%] tracking-[-0.48px] self-stretch">
              No map image here!
            </h2>
            <p className="text-white/80 text-[12px] font-normal leading-[145%] self-stretch">
              or drag an image from your asset library
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAssetModalOpen(true)}
          >
            Add Map
          </Button>
        </div>
      ) : (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <div
            ref={mapContainerRef}
            onClick={handleMapClick}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 100ms ease-out",
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src={mapImage}
              alt="World Map"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Render Location Pins for this map */}
            {pins
              .filter((p) => (p.mapName || "Maps") === activeMapName)
              .map((pin) => {
                const isSelected = selectedPinId === pin.id;

                return (
                  <div
                    key={pin.id}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPin?.(pin);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full z-20 cursor-pointer group"
                    title={pin.name}
                  >
                    <svg
                      viewBox="0 0 24 32"
                      className={`w-7 h-9 transition-transform group-hover:scale-125 drop-shadow-2xl ${
                        isSelected ? "scale-110" : ""
                      }`}
                    >
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z"
                        fill={isSelected ? "#6F01D0" : "#FFFFFF"}
                        stroke={isSelected ? "#FFFFFF" : "#1C1C1C"}
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="12"
                        cy="11"
                        r="4"
                        fill={isSelected ? "#FFFFFF" : "#1C1C1C"}
                      />
                    </svg>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 3. Floating Hint Banner */}
      {mapImage && currentHint && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#1C1C1C]/90 border border-[#2E2E2E] px-4 py-1.5 rounded-[8px] text-xs text-white shadow-xl backdrop-blur-md pointer-events-none animate-in fade-in">
          <span>{currentHint.text}</span>
          {currentHint.shortcut && (
            <span className="text-neutral-400 font-mono text-[10px]">
              {currentHint.shortcut}
            </span>
          )}
        </div>
      )}

      {/* 4. Asset Modal */}
      <ManageAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSelectMap={(mapUrl) => {
          setMapImage(mapUrl);
          onMapLoaded?.(activeMapName);
        }}
      />
    </div>
  );
}
