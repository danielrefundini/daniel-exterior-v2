import { DM_Sans, Manrope } from "next/font/google";

// Brand fonts only: Manrope for headlines, DM Sans for body text.
// (Poppins and Playfair were loaded and preloaded on every page but never used by this site's theme.)
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-dmsans" });

/** Font variables for the site wrapper. */
export const siteFonts = `${manrope.variable} ${dmSans.variable}`;
