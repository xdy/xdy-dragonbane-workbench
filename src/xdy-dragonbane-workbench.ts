import {createChatMessageHook, preCreateChatMessageHook, preUpdateTokenHook} from "./module/hook-handlers";
import {registerWorkbenchSettings} from "./module/register-settings";

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

const DEFAULT_TOKEN_ANIMATION_SPEED = 6; //Från foundrys kod

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

  handle("preUpdateToken", Boolean(gs.get(MODULENAME, "tokenAnimationSpeed") !== DEFAULT_TOKEN_ANIMATION_SPEED), preUpdateTokenHook);
}

// Initialize module
Hooks.once("init", async () => {
  console.log(`${MODULENAME} | Initializing xdy-dragonbane-workbench`);
  registerWorkbenchSettings();

  // Hooks that always run
  // Hooks that run once, if a setting is enabled. Manual refresh will still be needed for these.

  // Hooks that only run if a setting that needs it has been enabled
  updateHooks();

  game.socket.on("module." + MODULENAME, (operation) => {
    switch (operation?.operation) {
      case "updateHooks":
        if (!game.user.isGM) {
          updateHooks();
        }
        break;
      case "notification":
        if (!game.user.isGM) {
          const type = operation.args[0];
          const message = operation.args[1];
          ui.notifications.notify(message, type);
        }
        break;
      default:
        break;
    }
  });

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


