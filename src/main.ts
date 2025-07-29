import { waitForElement } from './utils';

function onCalendarEntered(callback: (isCalendar: boolean) => void) {
  const ribbon = document.querySelector('[data-app-section="Ribbon"]');
  if (!ribbon) return;
  const parent = ribbon.parentElement;
  if (!parent) return;
  const observer = new MutationObserver(() => {
    const calendarModule = parent.querySelector(
      '[data-app-section="CalendarModule"]'
    );
    if (calendarModule) callback(true);
    else callback(false);
  });
  observer.observe(parent, {
    childList: true,
  });

  if (parent.querySelector('[data-app-section="CalendarModule"]'))
    callback(true);
  else callback(false);
  return () => observer.disconnect();
}

window.onload = async () => {
  await waitForElement('[data-app-section="CalendarModule"]');
  const handle = onCalendarEntered((isCalendar) => {
    if (isCalendar) {
      console.log("Entered calendar module");
    } else {
      console.log("Exited calendar module");
    }
  });
  console.log("Hello, world!", typeof handle);
};
