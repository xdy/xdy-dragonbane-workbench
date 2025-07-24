import {canRename, doRenaming, isTokenRenamed} from "./tokenNames";
import {i18n, keybindings, MODULENAME, notifications, settings} from "../xdy-dragonbane-workbench.ts";

export function registerWorkbenchKeybindings() {
  console.log(`${MODULENAME} | registerKeybindings`);

  // Renaming
  keybindings.register(MODULENAME, "npcRenamerRenameKey", {
    name: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerRenameKey.name`),
    hint: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerRenameKey.hint`),
    restricted: true,
    editable: [{key: "KeyM", modifiers: ["SHIFT"]}],
    onDown: () => {
      if (settings.get(MODULENAME, "npcRenamer")) {
        if (canRename()) {
          for (const token of canvas?.tokens?.controlled ?? []) {
            doRenaming(token.document, isTokenRenamed(token))
              .then(() => {
              })
              .catch(error => console.error(`${MODULENAME} | Error while renaming token:`, error));
          }
        } else {
          notifications?.warn(i18n.localize(`${MODULENAME}.SETTINGS.notifications.cantRename`));
        }
        return true;
      }
      return false;
    },
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });


  // Can't get i18n to work properly here for some reason, so, hardcoded instead.
  for (let page = 1; page <= 5; page++) {
    for (let column = 1; column <= 10; column++) {
      keybindings.register(MODULENAME, `callHotbarPage${page}Macro${column}`, {
        name: `Hotbar ${page} : ${column}`,
        hint: `${MODULENAME}.KEYBINDINGS.macroHotbar.hint`,
        onDown: () => {
          void game.user?.getHotbarMacros(page)?.[column - 1]?.["macro"]?.execute();
          return true;
        },
      });
    }
  }
}
