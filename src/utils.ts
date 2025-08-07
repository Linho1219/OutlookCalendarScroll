export function getCalendarDOMs() {
  const surface = document.querySelector(
    '[data-app-section="CalendarModuleSurface"]'
  ) as HTMLElement | null;
  const [_, prevBtn, nextBtn] = document.querySelectorAll(
    '[role="toolbar"] button'
  ) as NodeListOf<HTMLButtonElement>;

  if (!surface || !prevBtn || !nextBtn)
    throw new Error("Calendar DOM elements not found");

  const prev = () => prevBtn.click();
  const next = () => nextBtn.click();
  return { surface, prevBtn, nextBtn, prev, next };
}
