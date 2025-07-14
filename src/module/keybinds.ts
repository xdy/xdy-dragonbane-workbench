import {MODULENAME} from "src/xdy-dragonbane-workbench";
import {canRename, doRenaming, isTokenRenamed} from "./tokenNames";

export function registerWorkbenchKeybindings() {
  console.log(`${MODULENAME} | registerKeybindings`);

  const keybindings = game.keybindings;

  // Renaming
  keybindings.register(MODULENAME, "npcRenamerRenameKey", {
    name: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerRenameKey.name`),
    hint: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerRenameKey.hint`),
    restricted: true,
    editable: [{key: "KeyM", modifiers: ["Shift"]}],
    onDown: () => {
      if (game.settings.get(MODULENAME, "npcRenamer")) {
        if (canRename()) {
          for (const token of canvas?.tokens?.controlled ?? []) {
            let active = isTokenRenamed(token);
            doRenaming(token?.document, active).then();
          }
        } else {
          ui.notifications?.warn(game.i18n.localize(`${MODULENAME}.SETTINGS.notifications.cantRename`));
        }
        return true;
      }
      return false;
    },
    reservedModifiers: [],
    // @ts-ignore
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });


  // Can't get i18n to work properly here for some reason, so, hardcoded instead.
  for (let page = 1; page <= 5; page++) {
    for (let column = 1; column <= 10; column++) {
      keybindings.register(MODULENAME, `callHotbarPage${page}Macro${column}`, {
        name: `Hotbar ${page} : ${column}`,
        hint: `${MODULENAME}.KEYBINDINGS.macroHotbar.hint`,
        onDown: () => {
          // @ts-ignore
          game.user?.getHotbarMacros(page)?.[column - 1]["macro"].execute();
          return true;
        },
      });
    }
  }
}
