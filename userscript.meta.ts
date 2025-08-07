import pkg from "./package.json" assert { type: "json" };

const metadataObject: Metadata = {
  name: "Outlook Scroll Navigation",
  namespace: "http://tampermonkey.net/",
  version: pkg.version,
  description: "Scroll to switch calendar months in Outlook PWA",
  author: "You",
  match: ["https://outlook.live.com/*", "https://outlook.office.com/*"],
  grant: "none",
  "run-at": "document-end",
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
