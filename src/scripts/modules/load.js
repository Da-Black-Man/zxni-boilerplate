import { module } from "modujs";
import modularLoad from "../modularLoad";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    const load = new modularLoad({
      enterDelay: 3000,
      isSPA: false,
      transitions: {
        customTransition: {},
      },
    });

    load.on("loaded", (transition, oldContainer, newContainer) => {
      this.call("destroy", oldContainer, "app");
      this.call("update", newContainer, "app");
    });
  }
}
