import "server-only";
import fs from "node:fs";
import path from "node:path";
import { GUIDES_BG, HERO_ALT, HERO_BLUR, HERO_IMAGES, HERO_PLACEHOLDER } from "@/lib/assets";

function publicFileExists(publicPath: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicPath));
  } catch {
    return false;
  }
}

export interface HeroImage {
  src: string;
  placeholder: boolean;
  alt: string;
  blur: string | null;
}

/** The supplied hero photo when present, otherwise the neutral placeholder illustration. */
export function getHeroImage(): HeroImage {
  const photo = HERO_IMAGES.find(publicFileExists);
  if (photo) return { src: photo, placeholder: false, alt: HERO_ALT, blur: photo === "/hero.png" ? HERO_BLUR : null };
  return { src: HERO_PLACEHOLDER, placeholder: true, alt: "", blur: null };
}

export function getGuidesBackground() {
  return publicFileExists(GUIDES_BG) ? GUIDES_BG : null;
}
