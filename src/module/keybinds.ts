import {MODULENAME} from "src/xdy-dragonbane-workbench";

export function registerWorkbenchKeybindings() {
  console.log(`${MODULENAME} | registerKeybindings`);

  const keybindings = game.keybindings;

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
