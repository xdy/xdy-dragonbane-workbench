import {MODULENAME, updateHooks} from "../xdy-dragonbane-workbench";


export function registerWorkbenchSettings() {
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
    onChange: () => {
      updateHooks();
    },
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
    onChange: () => {
      updateHooks();
    },
  });

  game.settings.register(MODULENAME, "tokenAnimationSpeed", {
    name: `${MODULENAME}.SETTINGS.tokenAnimationSpeed.name`,
    hint: `${MODULENAME}.SETTINGS.tokenAnimationSpeed.hint`,
    scope: "user",
    config: true,
    default: 6,
    type: Number,
    onChange: () => {
      updateHooks();
    },
  });
}
