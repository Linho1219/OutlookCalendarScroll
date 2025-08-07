import pkg from "./package.json" assert { type: "json" };

const metadataObject: Metadata = {
  name: "outlook Calendar Scroll",
  namespace: "https://github.com/Linho1219",
  version: pkg.version,
  description: "Scroll to switch calendar months in Outlook PWA",
  author: "Linho1219",
  match: ["https://outlook.live.com/*", "https://outlook.office.com/*"],
  grant: "none",
  "run-at": "document-end",

  homepage: "https://github.com/Linho1219/outlook-calendar-scroll",
  supportURL: "https://github.com/Linho1219/outlook-calendar-scroll/issues",
  updateURL:
    "https://github.com/Linho1219/OutlookCalendarScroll/releases/latest/download/outlook-calendar-scroll.user.js",
  downloadURL:
    "https://github.com/Linho1219/OutlookCalendarScroll/releases/latest/download/outlook-calendar-scroll.user.js",
  icon: "https://outlook.live.com/favicon.ico",
};

interface Metadata {
  [key: string]: string | string[];
}

function generateMetadataStr(metadata: Metadata): string {
  const keyLength = Math.max(...Object.keys(metadata).map((k) => k.length));
  const lines = Object.entries(metadata).flatMap(([key, value]) => {
    const paddedKey = key.padEnd(keyLength);
    if (!Array.isArray(value)) value = [value];
    return value.map((value) => `// @${paddedKey}  ${value}`);
  });
  lines.unshift("// ==UserScript==");
  lines.push("// ==/UserScript==");
  return lines.join("\n");
}

export const metadata = generateMetadataStr(metadataObject);
