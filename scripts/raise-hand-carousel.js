/**
 * A single Reqvest in our list of Todos.
 * @typedef {Object} Reqvest
 * @property {string} userId - The user who owns this reqvest.
 * @property {boolean} isActive - Marks whether the Reqvest is active.
 * @property {boolean} isEmergency - Marks whether the Reqvest is emergency.
 */

class ReqvestList {
    static ID = "reqvest";
    static FLAGS = {
        REQVESTS : "reqvests"
    }
    static TEMPLATES = {
        REQVESTLIST : `modules/${this.ID}/templates/raise-hand-carousel.hbs`
    }
    static log(force, ...args) {
    const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(this.ID, '|', ...args);
    }
  }

}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(ToDoList.ID);
});
