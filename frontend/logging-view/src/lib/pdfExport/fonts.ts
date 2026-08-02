// Registers the bundled Roboto weights into a jsPDF document's virtual
// filesystem so page builders can `doc.setFont("Roboto", ...)` — jsPDF ships
// only Helvetica/Times/Courier/Symbol/ZapfDingbats by default, none of which
// match the brand's cover-page title typeface. TTFs converted from
// @fontsource/roboto's static Latin 400/700 woff files (fontTools, flavor
// stripped); see fonts/LICENSE.txt (SIL Open Font License) for attribution.
import type { jsPDF } from "jspdf";
import robotoRegularTtf from "./fonts/Roboto-Regular.ttf?inline";
import robotoBoldTtf from "./fonts/Roboto-Bold.ttf?inline";

// Vite's `?inline` import yields a `data:font/ttf;base64,AAAA...` URL —
// addFileToVFS wants just the base64 payload.
const base64Of = (dataUrl: string): string => dataUrl.slice(dataUrl.indexOf(",") + 1);

export function registerRobotoFont(doc: jsPDF): void {
  doc.addFileToVFS("Roboto-Regular.ttf", base64Of(robotoRegularTtf));
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFileToVFS("Roboto-Bold.ttf", base64Of(robotoBoldTtf));
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
}
