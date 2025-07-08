// This file serves as the entry point for the module
import {createChatMessageHook, preCreateChatMessageHook} from "./module/hook-handlers";


// Import and re-export all files from the module directory to ensure they're included in the build
// @ts-ignore
export const moduleFiles = import.meta.glob('./module/*.ts', {eager: true});

export const MODULENAME = "xdy-dragonbane-workbench";

const activeHooks = new Set();

function handle(hookName: any, shouldBeOn: boolean, hookFunction: {
  (...args: never[]): boolean | void | Promise<boolean | void>;
  (...args: never[]): boolean | void | Promise<boolean | void>;
  (...args: any[]): boolean | void | Promise<boolean | void>;
}, once = false) {
  if (!activeHooks.has(hookName)) {
    if (shouldBeOn) {
      if (once) {
        Hooks.once(hookName, hookFunction);
      } else {
        Hooks.on(hookName, hookFunction);
      }
      activeHooks.add(hookName);
    }
  } else {
    if (!shouldBeOn) {
      Hooks.off(hookName, hookFunction);
      activeHooks.delete(hookName);
    }
  }
}

export function updateHooks(cleanSlate = false) {
  if (phase > Phase.SETUP && game.user && game.user.isGM && game.socket) {
    game.socket.emit("module." + MODULENAME, {operation: "updateHooks"});
  }
  if (cleanSlate) {
    activeHooks.clear();
  }

  const gs = game.settings;

  handle(
    "preCreateChatMessage",
    gs.get(MODULENAME, "reminderTargeting") !== "no" ||
    gs.get(MODULENAME, "reminderCannotAttack") === "cancelAttack",
    preCreateChatMessageHook,
  );

  handle(
    "createChatMessage",
    gs.get(MODULENAME, "reminderCannotAttack") === "reminder",
    createChatMessageHook,
  );

}

function registerWorkbenchSettings() {
  game.settings.register(MODULENAME, "reminderCannotAttack", {
    name: `${MODULENAME}.SETTINGS.reminderCannotAttack.name`,
    hint: `${MODULENAME}.SETTINGS.reminderCannotAttack.hint`,
    scope: "user",
    config: true,
    default: "no",
    type: String,
    choices: {
      no: game.i18n.localize(`${MODULENAME}.SETTINGS.reminderCannotAttack.no`),
      reminder: game.i18n.localize(`${MODULENAME}.SETTINGS.reminderCannotAttack.reminder`),
      cancelAttack: game.i18n.localize(`${MODULENAME}.SETTINGS.reminderCannotAttack.cancelAttack`),
    },
    onChange: () => { updateHooks(); },
  });

  game.settings.register(MODULENAME, "reminderTargeting", {
    name: `${MODULENAME}.SETTINGS.reminderTargeting.name`,
    hint: `${MODULENAME}.SETTINGS.reminderTargeting.hint`,
    scope: "user",
    config: true,
    default: "no",
    type: String,
    choices: {
      no: game.i18n.localize(`${MODULENAME}.SETTINGS.reminderTargeting.no`),
      reminder: game.i18n.localize(`${MODULENAME}.SETTINGS.reminderTargeting.reminder`),
      mustTarget: game.i18n.localize(`${MODULENAME}.SETTINGS.reminderTargeting.mustTarget`),
    },
    onChange: () => { updateHooks(); },
  });
}

// Initialize module
Hooks.once("init", async () => {
  console.log(`${MODULENAME} | Initializing xdy-dragonbane-workbench`);
  registerWorkbenchSettings();

  // Hooks that always run
  // Hooks that run once, if a setting is enabled. Manual refresh will still be needed for these.

  // Hooks that only run if a setting that needs it has been enabled
  updateHooks();

  // Register custom sheets (if any)

});

// Update phase when the game is ready
Hooks.once('ready', () => {
  phase = Phase.READY;
});

// Update phase when the game is active
Hooks.once('canvasReady', () => {
  phase = Phase.ACTIVE;
});

export const Phase = {
  SETUP: 0,
  READY: 1,
  ACTIVE: 2
};

export let phase = Phase.SETUP;


