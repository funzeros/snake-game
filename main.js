import { registerComponents } from "./src/builder.js";
import * as componnetMap from "./src/entry.js";
import { createStore } from "./src/store/index.js";

createStore();
registerComponents(Object.values(componnetMap));
