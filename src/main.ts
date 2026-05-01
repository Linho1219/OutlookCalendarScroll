import { watch, AppState } from "./listen";
import { mount } from "./mount";
import { IconSet, tryGetIconSet } from "./utils";

const dirMap = {
  day: "horizontal",
  workweek: "horizontal",
  week: "horizontal",
  month: "vertical",
} as const;

let lastDir: "horizontal" | "vertical" | undefined;
let canceler: (() => void) | undefined;

let iconSet: IconSet | null = null;

async function handler(state: AppState) {
  if (state.isCalendar) {
    console.log(`Calendar view: ${state.view}`);
    if (lastDir !== dirMap[state.view]) {
      canceler?.();
      lastDir = dirMap[state.view];
      canceler = await mount(dirMap[state.view]);
    }
    if (!iconSet) iconSet = await tryGetIconSet();
    const indicatorEl = document.querySelector(
      ".ocs-scroll-indicator",
    ) as HTMLElement | null;
    if (indicatorEl) indicatorEl.innerText = iconSet[state.view];
  } else {
    console.log("Quit calendar view");
    canceler?.();
    lastDir = undefined;
    canceler = undefined;
  }
}

window.onload = () => watch(handler);
