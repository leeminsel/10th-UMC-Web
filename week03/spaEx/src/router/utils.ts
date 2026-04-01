export const getCurrentPath = () => window.location.pathname;

export const navigateTo = (to: string) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event('pushstate'));
};