import { watch, AppState } from "./listen";
import { mount } from "./mount";

const dirMap = {
  day: "horizontal",
  workweek: "horizontal",
  week: "horizontal",
  month: "vertical",
} as const;

let lastDir: "horizontal" | "vertical" | undefined;
let canceler: (() => void) | undefined;

async function handler(state: AppState) {
  if (state.isCalendar) {
    console.log(`Calendar view: ${state.view}`);
    if (lastDir !== dirMap[state.view]) {
      canceler?.();
      lastDir = dirMap[state.view];
      canceler = await mount(dirMap[state.view]);
    }
  } else {
    console.log("Quit calendar view");
    canceler?.();
    lastDir = undefined;
    canceler = undefined;
  }
}

window.onload = () => watch(handler);
