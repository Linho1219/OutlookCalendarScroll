import { getCalendarDOMs, tryGetCalendarDOMs } from "./utils";

type ScrollIndicatorOptions = {
  next: () => void;
  prev: () => void;
};

export async function mount(dir: "horizontal" | "vertical") {
  const { surface, prev, next } = await tryGetCalendarDOMs();
  return mountScrollIndicator(surface, dir, { next, prev });
}

function interpretAccumulated(accumulated: number, TRIGGER_DISTANCE: number) {
  const positive = accumulated > 0;
  const abs = Math.abs(accumulated);
  if (abs < TRIGGER_DISTANCE) return { value: accumulated, triggered: false };
  const value = (2 - TRIGGER_DISTANCE / abs) * TRIGGER_DISTANCE;
  return { value: positive ? value : -value, triggered: true };
}

export function mountScrollIndicator(
  surface: HTMLElement,
  dir: "horizontal" | "vertical",
  { next, prev }: ScrollIndicatorOptions
) {
  const INDICATOR_SIZE = 50;
  const TRIGGER_DISTANCE = 400;
  const DISPLAY_DISTANCE_RATIO = 0.2;
  const TRIGGER_TIMEOUT = 200;

  const NORMAL_BG = "var(--neutralTertiary)";
  const NORMAL_COLOR = "var(--black)";
  const TRIGGERED_BG = "var(--themePrimary)";
  const TRIGGERED_COLOR = "var(--white)";

  let accumulated = 0;
  let timeout: number | undefined;

  const indicator = document.createElement("div");
  Object.assign(indicator.style, {
    position: "absolute",
    width: `${INDICATOR_SIZE}px`,
    height: `${INDICATOR_SIZE}px`,
    borderRadius: "50%",
    fontSize: "20px",
    backgroundColor: NORMAL_BG,
    color: NORMAL_COLOR,
    fontFamily: "FluentSystemIcons",
    zIndex: "9999",
    transition: "transform 0.06s, background-color 0.1s, color 0.1s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  });
  indicator.id = "scroll-indicator";
  indicator.innerText = "\ue33a";
  if (dir === "vertical") {
    indicator.style.left = "50%";
  } else {
    indicator.style.top = "50%";
  }

  surface.style.position = "relative";
  surface.style.overflow = "hidden";

  surface.appendChild(indicator);

  function reset(value: number) {
    accumulated = 0;
    determinePosition(0, value > 0);
    indicator.style.backgroundColor = NORMAL_BG;
    indicator.style.color = NORMAL_COLOR;
  }

  function trigger(value: number) {
    if (value < 0) prev();
    else next();
    reset(value);
  }

  function determinePosition(value: number, positive = value > 0) {
    const translate = -value * DISPLAY_DISTANCE_RATIO;
    if (dir === "vertical") {
      if (positive) {
        indicator.style.bottom = `-${INDICATOR_SIZE}px`;
        indicator.style.top = "auto";
      } else {
        indicator.style.top = `-${INDICATOR_SIZE}px`;
        indicator.style.bottom = "auto";
      }
      indicator.style.transform = `translateX(-50%) translateY(${translate}px)`;
    } else {
      if (positive) {
        indicator.style.right = `-${INDICATOR_SIZE}px`;
        indicator.style.left = "auto";
      } else {
        indicator.style.left = `-${INDICATOR_SIZE}px`;
        indicator.style.right = "auto";
      }
      indicator.style.transform = `translateY(-50%) translateX(${translate}px)`;
    }
  }
  determinePosition(0);

  function onWheel(e: WheelEvent) {
    const delta = dir === "vertical" ? e.deltaY : e.deltaX;
    if (!delta) return;
    e.preventDefault();
    accumulated += delta;
    const { triggered, value } = interpretAccumulated(
      accumulated,
      TRIGGER_DISTANCE
    );

    // 改变颜色
    if (triggered) {
      indicator.style.backgroundColor = TRIGGERED_BG;
      indicator.style.color = TRIGGERED_COLOR;
    } else {
      indicator.style.backgroundColor = NORMAL_BG;
      indicator.style.color = NORMAL_COLOR;
    }
    determinePosition(value);

    // 清除旧计时器
    clearTimeout(timeout);

    // 设置一个新计时器，用来判断“松手”：
    timeout = window.setTimeout(() => {
      if (Math.abs(accumulated) >= TRIGGER_DISTANCE) {
        trigger(value);
      } else {
        reset(value);
      }
    }, TRIGGER_TIMEOUT);
  }

  surface.addEventListener("wheel", onWheel, { passive: true });

  return () => {
    surface.removeEventListener("wheel", onWheel);
    indicator.remove();
  };
}
