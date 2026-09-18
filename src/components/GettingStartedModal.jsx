import React, { useState } from "react";
import Icon from "./Icon";

// Animated GIF / video visual presets for each entity type
const ENTITY_GIFS = {
  manuscripts: "https://media.giphy.com/media/xUPJPdxiUorIHaA9C8/giphy.gif",
  scene:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/2022-01-15_eruption_of_Hunga_Tonga.gif/600px-2022-01-15_eruption_of_Hunga_Tonga.gif",
  maps: "https://upload.wikimedia.org/wikipedia/commons/2/22/World_War_II_alliances_animated_map.gif",
  character:
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&auto=format&fit=crop&q=80",
  organization:
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif",
  locations:
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&auto=format&fit=crop&q=80",
  race: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=80",
  artifacts:
    "https://upload.wikimedia.org/wikipedia/commons/1/12/Writing_star.gif",
  creature: "https://media.giphy.com/media/jlNAjVbGY9Hws/giphy.gif",
  technology:
    "https://upload.wikimedia.org/wikipedia/commons/0/0d/Local_galaxy_filaments.gif",
  timeline:
    "https://upload.wikimedia.org/wikipedia/commons/0/03/Keck-UCLA_Galactic_Center_Group_Sagittarius_A%2A_2022.gif",
};

// Descriptions for each entity type
const ENTITY_DESCRIPTIONS = {
  manuscripts:
    "You're here to write, right? Use the Manuscript module to craft your novel or short story, all while referencing the other elements in your project.",
  scene:
    "Outline individual beats, cinematic moments, and chapter sequences to structure your narrative flow.",
  maps: "Build interactive world maps, pin key regions, and track geographical borders for your lore.",
  character:
    "Track character motivations, traits, backstories, and relationships across your story arcs.",
  organization:
    "Define factions, guilds, political powers, and secret societies shaping your world.",
  locations:
    "Detail landmarks, cities, ancient ruins, and realms where pivotal events unfold.",
  race: "Document species, lineages, customs, and physiological traits of your world's inhabitants.",
  artifacts:
    "Chronicle legendary relics, weapons of power, and magical items woven into history.",
  creature:
    "Catalogue bestiaries, mythic beasts, wildlife, and monstrous inhabitants of your lands.",
  technology:
    "Document futuristic inventions, magic systems, alchemical formulas, and craftable tools.",
  timeline:
    "Map chronological eras, key historical events, and milestone dates across ages.",
};

export default function GettingStartedModal({
  isOpen = true,
  entity = null,
  className = "",
}) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !entity) return null;

  const gifUrl = ENTITY_GIFS[entity.id] || ENTITY_GIFS.manuscripts;
  const description =
    ENTITY_DESCRIPTIONS[entity.id] ||
    "Learn how to use this module to craft and enrich your world building project.";

  return (
    /* Floating Getting Started Preview Card */
    <div
      onClick={(e) => e.stopPropagation()}
      className={`flex flex-col items-end gap-[24px] w-[452px] p-[24px] rounded-[8px] bg-[#1C1C1C] shadow-[0_4px_15.5px_0_rgba(0,0,0,0.09)] border border-[#2E2E2E] select-none z-50 animate-in fade-in duration-100 ${className}`}
    >
      {/* 1. Header Text */}
      <h2 className="w-full text-left text-white text-[20px] font-bold leading-normal">
        Getting Started
      </h2>

      {/* 2. Video / GIF Player (404px x 162px) */}
      <div
        onClick={() => setIsPlaying(!isPlaying)}
        className="relative w-[404px] h-[162px] max-w-full rounded-[8px] bg-[#141416] border border-[#2E2E2E] flex items-center justify-center overflow-hidden cursor-pointer group"
      >
        {/* Animated Mock GIF background */}
        <img
          src={gifUrl}
          alt={entity.label}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity"
        />

        {/* Subtle dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Solid White Rounded Play Icon */}
        <div className="relative z-10 group-hover:scale-110 transition-transform drop-shadow-2xl">
          <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            className="w-14 h-14 text-white drop-shadow-xl"
          >
            <path d="M16 10C16 8.44 17.7 7.48 19.03 8.29L37.7 19.53C38.99 20.31 38.99 22.19 37.7 22.97L19.03 34.21C17.7 35.02 16 34.06 16 32.5V10Z" />
          </svg>
        </div>
      </div>

      {/* 3. Entity Information Row */}
      <div className="flex items-start gap-[16px] w-full text-left">
        {/* 24px Entity Icon */}
        <div className="w-[24px] h-[24px] aspect-square flex items-center justify-center text-white shrink-0 mt-0.5">
          <Icon name={entity.icon || "manuscripts"} size={24} />
        </div>

        {/* Title & Description */}
        <div className="flex flex-col items-start gap-[6px] flex-1">
          <h3 className="w-full text-white text-[16px] font-semibold leading-snug truncate">
            {entity.label}
          </h3>
          <p className="w-full text-[#989898] text-[14px] font-normal leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* 4. Don't Show Again Checkbox */}
      <div
        onClick={() => setDontShowAgain(!dontShowAgain)}
        className="flex items-center gap-[8px] cursor-pointer group"
      >
        <div
          className={`w-[16px] h-[16px] rounded-[3px] flex items-center justify-center border transition-colors ${
            dontShowAgain
              ? "bg-[#6F01D0] border-[#6F01D0] text-white"
              : "border-neutral-400 bg-transparent group-hover:border-white"
          }`}
        >
          {dontShowAgain && <Icon name="check" size={12} weight="bold" />}
        </div>

        <span className="text-white text-[13px] font-medium leading-[145%]">
          Don’t show this again
        </span>
      </div>
    </div>
  );
}
