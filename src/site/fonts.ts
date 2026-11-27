import { DM_Sans, Manrope, Playfair_Display, Poppins } from "next/font/google";

// Fontes usadas pelos temas dos sites (a Inter já vem do layout raiz).
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-playfair" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-dmsans" });

/** Classe com as variáveis de fonte dos temas: vai no elemento que envolve o site. */
export const siteFonts = `${poppins.variable} ${playfair.variable} ${manrope.variable} ${dmSans.variable}`;
