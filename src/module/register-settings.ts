import {MODULENAME, updateHooks} from "../xdy-dragonbane-workbench";

export let renameRandomPropertyType: string;
export let renameModifierKey: string;

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

  game.settings.register(MODULENAME, "npcRenamer", {
    name: `${MODULENAME}.SETTINGS.npcRenamer.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamer.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => updateHooks(),
    requiresReload: true,
  });

  game.settings.register(MODULENAME, "npcRenamerAddRandomProperty", {
    name: `${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.hint`,
    scope: "world",
    config: true,
    type: String,
    choices: {
      none: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.none`),
      numberPostfix: game.i18n.localize(
        `${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.numberPostfix`,
      ),
      wordPrefix: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.wordPrefix`),
    },
    default: "none",
    onChange: (key) => {
      renameRandomPropertyType = <string>key;
    },
  });

  game.settings.register(MODULENAME, "npcRenamerRandomPropertySkipForUnique", {
    name: `${MODULENAME}.SETTINGS.npcRenamerRandomPropertySkipForUnique.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerRandomPropertySkipForUnique.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  //TODO Fix and add prefix/postfix word
  // game.settings.register(MODULENAME, "npcRenamerPrefix", {
  //   name: `${MODULENAME}.SETTINGS.npcRenamerPrefix.name`,
  //   hint: `${MODULENAME}.SETTINGS.npcRenamerPrefix.hint`,
  //   scope: "world",
  //   config: true,
  //   type: String,
  //   default: "",
  // });
  //
  // game.settings.register(MODULENAME, "npcRenamerPostfix", {
  //   name: `${MODULENAME}.SETTINGS.npcRenamerPostfix.name`,
  //   hint: `${MODULENAME}.SETTINGS.npcRenamerPostfix.hint`,
  //   scope: "world",
  //   config: true,
  //   type: String,
  //   default: "",
  // });

  game.settings.register(MODULENAME, "npcRenamerNoMatch", {
    name: `${MODULENAME}.SETTINGS.npcRenamerNoMatch.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerNoMatch.hint`,
    scope: "world",
    config: true,
    default: "...",
    type: String,
    onChange: async (choice) => {
      if (!choice) {
        // Sleep a bit, then set to a sane value...
        await new Promise((resolve) => setTimeout(resolve, 250));
        game.settings.set(MODULENAME, "npcRenamerNoMatch", "...");
      }
    },
  });

  game.settings.register(MODULENAME, "npcRenamerModifierKey", {
    name: `${MODULENAME}.SETTINGS.npcRenamerModifierKey.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerModifierKey.hint`,
    scope: "world",
    type: String,
    config: true,
    choices: {
      ALWAYS: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.always`),
      DISABLED: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.disabled`),
      ALT: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.alt`),
      CONTROL: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.control`),
      META: game.i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.meta`),
    },
    default: "CONTROL",
    onChange: (key) => {
      renameModifierKey = <string>key;
    },
  });

  //TODO Fix and add
  // game.settings.register(MODULENAME, "npcRenamerUnrenameToOriginalTokenName", {
  //   name: `${MODULENAME}.SETTINGS.npcRenamerUnrenameToOriginalTokenName.name`,
  //   hint: `${MODULENAME}.SETTINGS.npcRenamerUnrenameToOriginalTokenName.hint`,
  //   scope: "world",
  //   config: true,
  //   type: Boolean,
  //   default: false,
  // });
  //
  game.settings.register(MODULENAME, "npcRenamerExcludeActorTypes", {
    name: `${MODULENAME}.SETTINGS.npcRenamerExcludeActorTypes.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerExcludeActorTypes.hint`,
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  game.settings.register(MODULENAME, "npcRenamerIcon", {
    name: `${MODULENAME}.SETTINGS.npcRenamerIcon.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerIcon.hint`,
    scope: "world",
    config: true,
    type: String,
    default: "fa-solid fa-eye-slash",
  });

  renameModifierKey = String(game.settings.get(MODULENAME, "npcRenamerModifierKey"));
  renameRandomPropertyType = String(game.settings.get(MODULENAME, "npcRenamerAddRandomProperty"));

}

