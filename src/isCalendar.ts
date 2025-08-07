function hookHistoryMethod(type: "pushState" | "replaceState") {
  const orig = history[type];
  history[type] = function (...args) {
    const result = orig.apply(this, args);
    window.dispatchEvent(new Event(type));
    return result;
  };
}

export type AppState =
  | {
      isCalendar: false;
    }
  | {
      isCalendar: true;
      view: "day" | "workweek" | "week" | "month";
    };

function compareStates(a: AppState, b: AppState): boolean {
  if (!a.isCalendar && !b.isCalendar) return true;
  if (a.isCalendar && b.isCalendar) return a.view === b.view;
  return false;
}

export function watch(callback: (state: AppState) => void) {
  hookHistoryMethod("pushState");
  hookHistoryMethod("replaceState");

  function getState(): AppState | null {
    const pathname = location.pathname;
    if (!pathname.startsWith("/calendar")) return { isCalendar: false };

    if (pathname.startsWith("/calendar/view/day"))
      return { isCalendar: true, view: "day" };
    if (pathname.startsWith("/calendar/view/workweek"))
      return { isCalendar: true, view: "workweek" };
    if (pathname.startsWith("/calendar/view/week"))
      return { isCalendar: true, view: "week" };
    if (pathname.startsWith("/calendar/view/month"))
      return { isCalendar: true, view: "month" };

    if (pathname.startsWith("/calendar/view/"))
      console.warn("Unknown calendar view:", pathname);
    else console.log("Not view path:", pathname);
    return null;
  }

  let currentState: AppState = getState() || { isCalendar: false };
  function listener() {
    const newState = getState();
    if (newState && !compareStates(currentState, newState)) {
      currentState = newState;
      callback(currentState);
    }
  }

  window.addEventListener("popstate", listener);
  window.addEventListener("pushState", listener);
  window.addEventListener("replaceState", listener);
  callback(currentState);
}
