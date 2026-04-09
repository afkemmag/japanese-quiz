import { createFont, createTamagui } from "@tamagui/core";
import { defaultConfig } from "@tamagui/config/v4";

const serifJp = createFont({
  family: "'Noto Serif JP', Georgia, serif",
  size: { 1: 11, 2: 13, 3: 14, 4: 16, 5: 24, 6: 28, 7: 42, 8: 48, 9: 72, 10: 120, 11: 140 },
  lineHeight: { 1: 14, 2: 16, 3: 18, 4: 20, 5: 28, 6: 32, 7: 46, 8: 52, 9: 76, 10: 120, 11: 140 },
  weight: { 4: "400", 7: "700" },
  letterSpacing: { 4: 0 },
  face: { 400: { normal: "'Noto Serif JP'" }, 700: { normal: "'Noto Serif JP'" } },
});

const mono = createFont({
  family: "'Courier New', monospace",
  size: { 1: 10, 2: 11, 3: 12, 4: 13, 5: 14, 6: 15, 7: 24, 8: 30, 9: 48, 10: 72 },
  lineHeight: { 1: 14, 2: 15, 3: 16, 4: 17, 5: 18, 6: 19, 7: 28, 8: 34, 9: 52, 10: 76 },
  weight: { 4: "400" },
  letterSpacing: { 4: 0 },
});

const config = createTamagui({
  ...defaultConfig,
  fonts: {
    ...defaultConfig.fonts,
    mono,
    serifJp,
    body: mono,
    heading: serifJp,
  },
  settings: {
    ...defaultConfig.settings,
    defaultFont: "body",
    onlyAllowShorthands: false,
  },
});

export type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
