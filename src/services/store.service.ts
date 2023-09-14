import { proxy } from "valtio";
import { devtools } from "valtio/utils";
import { Toast } from "../hooks/useToast";

export interface Store {
  toasts: Toast[];
  scans: { name: string; time: Date }[];
}

const State: Store = { toasts: [], scans: [] };

const store = proxy(State);
if (window.location.hostname === "localhost") devtools(store);

export default store;