export const pascalToKebab = (str) =>
  str.replace(
    /([A-Z])/g,
    (_, p1, offset) => `${offset ? "-" : ""}${p1.toLowerCase()}`
  );

export const defineComponent = (c) => {
  customElements.define(pascalToKebab(c.name), c);
};
export const registerComponents = (list) => {
  list.forEach((c) => {
    defineComponent(c);
  });
};
export const useRandom = (seed = 5) => {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
  };
};

export class GemsDom extends HTMLElement {
  static random = useRandom(Date.now());
  static randomInteger(max, min = 0) {
    return Math.trunc(this.random() * (max - min) + min);
  }
  static store = {
    state: {},
    action: new Map(),
    on(name, cb) {
      const that = GemsDom.store;
      if (that.action.has(name)) {
        that.action.get(name).push(cb);
      } else {
        that.action.set(name, [cb]);
      }
    },
    emit(name, ...params) {
      const that = GemsDom.store;
      if (that.action.has(name)) {
        that.action.get(name).forEach((cb) => cb(that, ...params));
      }
    },
    off(name, cb) {
      const that = GemsDom.store;
      if (that.action.has(name)) {
        that.action.set(
          name,
          that.action.get(name).filter((m) => m !== cb)
        );
      }
    },
  };
  static hasInit = false;
  static initStore(state, actions = {}) {
    if (this.hasInit) throw Error("store has init");
    this.hasInit = true;
    this.store.state = state;
    Object.keys(actions).forEach((name) => {
      this.store.on(name, actions[name]);
    });
  }
  constructor() {
    super();
    this.name = this.constructor.name;
    this.shadow = this.attachShadow({ mode: "closed" });
    this.template = document.createElement("template");
    this.wrap = document.createElement("div");
    this.classList.add("self");
    this.styleDom = document.createElement("style");
    this.template.content.appendChild(this.styleDom);
    this.template.content.appendChild(this.wrap);
    this.shadow.appendChild(this.template.content);
  }
  get $store() {
    return GemsDom.store;
  }
  get $state() {
    return GemsDom.store.state;
  }
  actionMap = [];
  on(name, cb) {
    this.$store.on(name, cb);
    this.actionMap.push({ name, cb });
  }
  off(name, cb) {
    this.$store.off(name, cb);
    this.actionMap = this.actionMap.filter(({ name: aname, cb: acb }) => {
      return !(name === aname && cb === acb);
    });
  }
  emit(...rest) {
    this.$store.emit(...rest);
  }
  clear() {
    this.actionMap.forEach(({ name, cb }) => {
      this.$store.off(name, cb);
    });
  }
  get classList() {
    return this.wrap.classList;
  }
  get html() {
    return this.wrap.innerHTML;
  }
  set html(v) {
    this.wrap.innerHTML = v;
  }
  set style(v) {
    this.styleDom.textContent = v;
  }
  get style() {
    return this.styleDom.textContent;
  }
  get props() {
    return Object.fromEntries(
      Object.values(this.attributes).map(({ name, value }) => {
        return [name, value];
      })
    );
  }
  renderFn;
  #h() {
    this.renderFn && (this.html = this.renderFn());
  }
  ref(refName) {
    return this.shadow.querySelector(`[ref*="${refName}"]`);
  }
  refs(refName) {
    return this.shadow.querySelectorAll(`[ref*="${refName}"]`);
  }
  handler(callback) {
    requestAnimationFrame(callback);
  }
  forceUpdate() {
    this.#h();
  }
  update() {
    this.#h();
  }
  connectedCallback() {
    this.renderFn = this.render();
    this.#h();
  }
  unmounted;
  disconnectedCallback() {
    this.unmounted && this.unmounted();
    this.clear();
  }
  adoptedCallback() {
    console.info(this.name, "adoptedCallback");
  }
  static get observedAttributes() {
    return ["key", ...(this.props ? this.props : [])];
  }
  attributeChangedCallback(key, oldValue, newValue) {
    this.#h();
  }
}
