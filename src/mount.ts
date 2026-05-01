import { getWeekDayScrollerEl, tryGetCalendarDOMs } from "./utils";

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
  { next, prev }: ScrollIndicatorOptions,
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
  indicator.className = "ocs-scroll-indicator";
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
  indicator.innerText = "\ue32c"; // Fluent calendar icon

  if (dir === "vertical") {
    indicator.style.left = "50%";
    surface.style.overflowY = "hidden";
  } else {
    indicator.style.top = "50%";
    surface.style.overflowX = "hidden";
  }

  surface.style.position = "relative";

  function setColor(triggered: boolean) {
    if (triggered) {
      indicator.classList.add("triggered");
      indicator.style.backgroundColor = TRIGGERED_BG;
      indicator.style.color = TRIGGERED_COLOR;
    } else {
      indicator.classList.remove("triggered");
      indicator.style.backgroundColor = NORMAL_BG;
      indicator.style.color = NORMAL_COLOR;
    }
  }
  setColor(false);

  function setPosition(value: number, positive = value > 0) {
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
  setPosition(0);

  function reset(value: number) {
    accumulated = 0;
    setPosition(0, value > 0);
    setColor(false);
  }

  function trigger(value: number) {
    if (value < 0) prev();
    else next();
    if (dir === "horizontal") {
      const scrollEl = getWeekDayScrollerEl();
      if (scrollEl) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollEl;
        if (value < 0)
          scrollEl.scrollLeft = Math.max(0, scrollWidth - clientWidth);
        else scrollEl.scrollLeft = 0;
      }
    }
    reset(value);
  }

  surface.appendChild(indicator);

  function onWheel(e: WheelEvent) {
    if (e.ctrlKey) return;
    let delta;
    // Minor change to allow shift scroll to work horizontally
    if (dir === "vertical") {
      if (e.shiftKey) return;
      delta = e.deltaY;
    } else {
      delta = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    }
    if (!delta) return;
    if (dir === "horizontal") {
      const originalScrollEl = getWeekDayScrollerEl();
      if (originalScrollEl) {
        const { scrollLeft, scrollWidth, clientWidth } = originalScrollEl;
        console.log(scrollLeft, delta);
        if (delta < 0 && scrollLeft > 0) return;
        if (delta > 0 && Math.ceil(scrollLeft) + clientWidth < scrollWidth)
          return;
      }
    }
    accumulated += delta;
    const { triggered, value } = interpretAccumulated(
      accumulated,
      TRIGGER_DISTANCE,
    );

    setColor(triggered);
    setPosition(value);

    clearTimeout(timeout);
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
