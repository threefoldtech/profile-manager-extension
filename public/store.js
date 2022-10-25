class Store {
  set value(newValue) {
    this.$$value = newValue;
    this.$$notifyListener();
  }

  constructor() {
    this.$$value = null;
    this.$$listeners = new Set();
  }

  subscribe(listener) {
    this.$$listeners.add(listener);
    listener(this.$$value);
    return () => {
      this.$$listeners.delete(listener);
    };
  }

  $$notifyListener() {
    this.$$listeners.forEach((fn) => fn(this.$$value));
  }

  destroy() {
    this.$$listeners.clear();
  }
}
window.profileManager = new Store();

let oldValue;
document.addEventListener("PROFILE_MANAGER_ACTIVE_PROFILE", (e) => {
  if (oldValue !== e.detail) {
    oldValue = e.detail;
    window.profileManager.value = e.detail;
  }
});
