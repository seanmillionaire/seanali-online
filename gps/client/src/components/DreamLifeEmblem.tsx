import type { Ref } from "react";
import type { DreamLifeEmblemSpec, EmblemTheme, EmblemScene } from "@/lib/dreamLifeEmblem";

// Self-contained SVG geometry and system text keep saved images identical to the preview.
const symbols: Record<EmblemTheme, string> = {
  freedom: "M12 1 21 12 12 23 3 12Z M12 1V23 M3 12H21",
  family: "M2 11 12 3 22 11 M5 9V22H19V9 M9 22V15H15V22",
  health: "M1 12H6L9 4 14 21 18 12H23",
  wealth: "M3 21H22 M4 16 10 10 14 13 21 4 M15 4H21V10",
  peace: "M5 12A7 7 0 0 1 19 12 M2 16H22 M5 21H19 M12 1V3 M2 5 4 7 M22 5 20 7",
  growth: "M12 23V12 M12 15C3 15 2 8 3 4 10 4 12 8 12 15 M12 11C12 4 16 1 22 2 23 8 18 12 12 11",
  purpose: "M12 1 15 9 23 12 15 15 12 23 9 15 1 12 9 9Z",
  travel: "M23 12A11 11 0 1 1 1 12 11 11 0 0 1 23 12 M1 12H23 M12 1C4 7 4 17 12 23 M12 1C20 7 20 17 12 23",
};
const scenes: Record<EmblemScene, string> = {
  ocean: "M92 244Q112 230 132 244T172 244T212 244T252 244T292 244 M110 262Q130 248 150 262T190 262T230 262T270 262",
  home: "M113 259H154V237L192 209 230 237V259H271 M178 259V239H206V259",
  nature: "M92 259 146 206 181 244 220 196 292 259 M132 220 146 232 159 219 M207 212 220 222 234 211",
  city: "M94 259H119V228H151V259H171V210H207V259H227V233H259V259H290",
  sunrise: "M94 256H290 M153 244A41 41 0 0 1 231 244 M192 191V181 M144 207 136 199 M240 207 248 199",
  celebration: "M99 257H285 M154 246 192 214 230 246 M192 198V183 M159 208 149 198 M225 208 235 198",
};

export function DreamLifeEmblem({ spec, svgRef }: { spec: DreamLifeEmblemSpec; svgRef?: Ref<SVGSVGElement> }) {
  const description = `${spec.primaryTheme}${spec.secondaryThemes.length ? `, ${spec.secondaryThemes.join(", ")}` : ""}; ${spec.scene} scene. ${spec.anchor}.`;
  return <svg ref={svgRef} data-dream-life-emblem="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 430" width="384" height="430" role="img" aria-label={`Your Dream Life Emblem: ${description}`}>
    <title>Your Dream Life Emblem</title><desc>{description}</desc>
    <rect width="384" height="430" rx="18" fill="#fffcf6" />
    <circle cx="192" cy="184" r="151" fill="#f0f5ed" stroke="#214d50" strokeWidth="2" />
    <circle cx="192" cy="184" r="140" fill="none" stroke="#abc1b2" />
    <path d="M192 24V47 M192 321V344 M32 184H55 M329 184H352" stroke="#d65b30" strokeWidth="3" />
    <path d="M185 61 192 49 199 61" fill="none" stroke="#d65b30" strokeWidth="2" />
    <circle cx="192" cy="139" r="51" fill="#fffcf6" />
    <g fill="none" stroke="#214d50" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" transform="translate(159 106) scale(2.75)"><path d={symbols[spec.primaryTheme]} /></g>
    <path d={scenes[spec.scene]} fill="none" stroke="#688d78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {spec.secondaryThemes.map((theme, index) => {
      const x = spec.secondaryThemes.length === 1 ? 192 : 163 + index * 58;
      return <g key={theme}><circle cx={x} cy="291" r="20" fill="#fffcf6" stroke="#abc1b2" /><g transform={`translate(${x - 11} 280) scale(.92)`} fill="none" stroke="#d65b30" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={symbols[theme]} /></g></g>;
    })}
    <text x="192" y="380" textAnchor="middle" fill="#214d50" fontFamily="Georgia, serif" fontSize="23">{spec.anchor}</text>
    <text x="192" y="405" textAnchor="middle" fill="#60766c" fontFamily="Arial, sans-serif" fontSize="10" letterSpacing="2">MY DREAM LIFE EMBLEM</text>
  </svg>;
}
