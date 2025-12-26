type SoundOption = {
  id: string;
  name: string;
  asset: string | null;
};

export const SOUND_LIBRARY: SoundOption[] = [
  {
    id: "none",
    name: "None",
    asset: null,
  },
  {
    id: "meditation-bowls-23651",
    name: "Meditation Bowls",
    asset: require("../../assets/sounds/meditation-bowls-23651.mp3"),
  },
  {
    id: "minimal-piano-underscore-456148.mp3",
    name: "Minimal Piano Underscore",
    asset: require("../../assets/sounds/minimal-piano-underscore-456148.mp3"),
  },
  {
    id: "piano-loop-10809",
    name: "Piano Loop",
    asset: require("../../assets/sounds/piano-loop-10809.mp3"),
  },
  {
    id: "relax-relaxation-meditation-rain-raindrops-medium-water-139114",
    name: "Relax Meditation Rain",
    asset: require("../../assets/sounds/relax-relaxation-meditation-rain-raindrops-medium-water-139114.mp3"),
  },
  {
    id: "relaxing-ocean-waves-high-quality-recorded-177004",
    name: "Relaxing Ocean Waves",
    asset: require("../../assets/sounds/relaxing-ocean-waves-high-quality-recorded-177004.mp3"),
  },
  {
    id: "uplifting-pad-texture-113842",
    name: "Uplifting Pad Texture",
    asset: require("../../assets/sounds/uplifting-pad-texture-113842.mp3"),
  },
] as const;

export const BELL_SOUND = {
  id: "bells-1-72261",
  name: "Bells",
  asset: require("../../assets/sounds/bells-1-72261.mp3"),
};

export const CUSTOM_SOUND = "custom";
