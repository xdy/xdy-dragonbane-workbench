import {
  createChatMessageHook,
  createTokenHook,
  encumbranceAutomationHook,
  preCreateChatMessageHook,
  preUpdateTokenHook,
  renderTokenHUDHook
} from "./module/hook-handlers";
import {registerWorkbenchSettings} from "./module/register-settings";
import {registerWorkbenchKeybindings} from "./module/keybinds";
import {doRenamingFromToken} from "./module/tokenNames";
import {addOverEncumberedStatus} from "./module/handle-encumbrance-automation";
import {id} from "../static/module.json";


// Import all files from the module directory to ensure they're included in the build
import.meta.glob('./module/*.ts', {eager: true});

export const MODULENAME = "xdy-dragonbane-workbench";
export const moduleId = id as "xdy-dragonbane-workbench";

export let settings: foundry.helpers.ClientSettings;
export let i18n: Localization;
export let socket: io.Socket;
export let users: foundry.documents.collections.Users.Any;
export let user: User;
export let notifications: foundry.applications.ui.Notifications;
export let keybindings: foundry.helpers.interaction.ClientKeybindings;
export let combats: foundry.documents.collections.CombatEncounters;
export let combat: foundry.applications.sidebar.tabs.CombatTracker;
export let scenes: foundry.documents.collections.Scenes;

const activeHooks = new Set();

function handle(hookName: any, shouldBeOn: boolean, hookFunction: {
  (...args: any[]): boolean | void | Promise<boolean | void>;
  (...args: any[]): boolean | void | Promise<boolean | void>;
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
  if (phase > Phase.SETUP && game.user && user.isGM && game.socket) {
    socket.emit("module." + MODULENAME, {operation: "updateHooks"});
  }
  if (cleanSlate) {
    activeHooks.clear();
  }


  handle(
    "preCreateChatMessage",
    settings.get(MODULENAME, "reminderTargeting") !== "no" ||
    settings.get(MODULENAME, "reminderCannotAttack") === "cancelAttack",
    preCreateChatMessageHook,
  );

  handle(
    "createChatMessage",
    settings.get(MODULENAME, "reminderCannotAttack") === "reminder",
    createChatMessageHook,
  );

  handle(
    "createItem",
    Boolean(settings.get(MODULENAME, "encumbranceAutomation")),
    foundry.utils.debounce(encumbranceAutomationHook, 100),
  );

  handle(
    "updateItem",
    Boolean(settings.get(MODULENAME, "encumbranceAutomation")),
    foundry.utils.debounce(encumbranceAutomationHook, 100),
  );

  handle(
    "deleteItem",
    Boolean(settings.get(MODULENAME, "encumbranceAutomation")),
    foundry.utils.debounce(encumbranceAutomationHook, 100)
  );

  handle("preUpdateToken", Boolean(settings.get(MODULENAME, "tokenAnimationSpeed") !== DEFAULT_TOKEN_ANIMATION_SPEED), preUpdateTokenHook);

  handle("renderTokenHUD", Boolean(settings.get(MODULENAME, "npcRenamer")), renderTokenHUDHook);

  handle(
    "createToken",
    Boolean(settings.get(MODULENAME, "npcRenamer")),
    createTokenHook,
  );

}

// Initialize module
Hooks.once("init", async () => {
  console.log(`${MODULENAME} | Initializing xdy-dragonbane-workbench`);

  //Probably a stupid way of doing this. But, eh, stupid that works isn't *that* stupid. :)
  settings = <foundry.helpers.ClientSettings>game.settings
  i18n = <foundry.helpers.Localization>game.i18n;
  socket = <io.Socket><unknown>game.socket;
  users = <foundry.documents.collections.Users.Any>game.users;
  user = <User>game.user;
  notifications = <foundry.applications.ui.Notifications>ui.notifications;
  keybindings = <foundry.helpers.interaction.ClientKeybindings>game.keybindings;
  combats = <foundry.documents.collections.CombatEncounters>game.combats;
  combat = <foundry.applications.sidebar.tabs.CombatTracker>ui.combat;
  scenes = <foundry.documents.collections.Scenes>game.scenes;

  registerWorkbenchSettings();
  registerWorkbenchKeybindings();
  addOverEncumberedStatus();

  // Hooks that always run
  // Hooks that run once, if a setting is enabled. Manual refresh will still be needed for these.

  // Hooks that only run if a setting that needs it has been enabled
  updateHooks();

  socket.on("module." + MODULENAME, (operation) => {
    switch (operation?.operation) {
      case "updateHooks":
        if (!user.isGM) {
          updateHooks();
        }
        break;
      case "notification":
        if (!user.isGM) {
          const type = operation.args[0];
          const message = operation.args[1];
          notifications.notify(message, type);
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

  // Make some functions available for macros
  // noinspection JSUnusedGlobalSymbols
  // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
  game.DragonbaneWorkbench = {
    doRenamingFromToken: doRenamingFromToken, // await game.DragonbaneWorkbench.doRenamingFromToken(_token.id, true) OR await game.DragonbaneWorkbench.doRenamingFromToken(_token.id, false)
  };
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

