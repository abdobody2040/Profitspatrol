export const useRegisterSW = () => {
  return {
    offlineReady: [false, () => {}],
    needRefresh: [false, () => {}],
    updateServiceWorker: () => {},
  };
};
