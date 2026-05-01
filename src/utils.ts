import { Views } from "./listen";

async function tryFunc<T extends () => any>(
  callback: T,
  maxAttempts = 100,
  interval = 300,
): Promise<ReturnType<T>> {
  return new Promise((resolve) => {
    const intervalHandle = setInterval(() => {
      try {
        const value = callback();
        clearInterval(intervalHandle);
        resolve(value);
      } catch (e) {
        console.log("Waiting for function to succeed...");
        if (--maxAttempts <= 0) {
          clearInterval(intervalHandle);
          throw new Error("Function failed after maximum attempts");
        }
      }
    }, interval);
  });
}

function getCalendarDOMs() {
  const surface = document.querySelector(
    '[data-app-section="CalendarModuleSurface"]',
  ) as HTMLElement | null;
  const [_, prevBtn, nextBtn] = document.querySelectorAll(
    '[role="toolbar"] button',
  ) as NodeListOf<HTMLButtonElement>;

  if (!surface || !prevBtn || !nextBtn)
    throw new Error("Calendar DOM elements not found");

  const prev = () => prevBtn.click();
  const next = () => nextBtn.click();
  return { surface, prevBtn, nextBtn, prev, next };
}

export type IconSet = Record<Views, string>;
function getIconSet(): IconSet {
  const ribbonIconEls = document.querySelectorAll(
    "#innerRibbonContainer .ms-RibbonButton-icon .fui-Icon-font",
  ) as NodeListOf<HTMLElement>;
  if (ribbonIconEls.length === 0) throw new Error("Ribbon icons not found");
  const day = ribbonIconEls[1].innerText.trim();
  const workweek = ribbonIconEls[2].innerText.trim();
  const week = ribbonIconEls[3].innerText.trim();
  const month = ribbonIconEls[4].innerText.trim();
  if (!day || !workweek || !week || !month)
    throw new Error("Failed to extract calendar view icons");
  return { day, workweek, week, month };
}

export const tryGetCalendarDOMs = () => tryFunc(getCalendarDOMs);
export const tryGetIconSet = () => tryFunc(getIconSet, 5);

export function getWeekDayScrollerEl() {
  return document.querySelector(".inDayScrollContainer") as HTMLElement | null;
}
