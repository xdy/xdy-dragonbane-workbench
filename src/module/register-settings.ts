import {MODULENAME, updateHooks, settings, i18n} from "../xdy-dragonbane-workbench";

export let renameRandomPropertyType: string;
export let renameModifierKey: string;

export function registerWorkbenchSettings() {
  settings.register(MODULENAME, "reminderCannotAttack", {
    name: `${MODULENAME}.SETTINGS.reminderCannotAttack.name`,
    hint: `${MODULENAME}.SETTINGS.reminderCannotAttack.hint`,
    scope: "world",
    config: true,
    default: "no",
    type: String,
    choices: {
      no: i18n.localize(`${MODULENAME}.SETTINGS.reminderCannotAttack.no`),
      reminder: i18n.localize(`${MODULENAME}.SETTINGS.reminderCannotAttack.reminder`),
      cancelAttack: i18n.localize(`${MODULENAME}.SETTINGS.reminderCannotAttack.cancelAttack`),
    },
    onChange: () => {
      updateHooks();
    },
  });

  settings.register(MODULENAME, "reminderTargeting", {
    name: `${MODULENAME}.SETTINGS.reminderTargeting.name`,
    hint: `${MODULENAME}.SETTINGS.reminderTargeting.hint`,
    scope: "world",
    config: true,
    default: "no",
    type: String,
    choices: {
      no: i18n.localize(`${MODULENAME}.SETTINGS.reminderTargeting.no`),
      reminder: i18n.localize(`${MODULENAME}.SETTINGS.reminderTargeting.reminder`),
      mustTarget: i18n.localize(`${MODULENAME}.SETTINGS.reminderTargeting.mustTarget`),
    },
    onChange: () => {
      updateHooks();
    },
  });

  settings.register(MODULENAME, "tokenAnimationSpeed", {
    name: `${MODULENAME}.SETTINGS.tokenAnimationSpeed.name`,
    hint: `${MODULENAME}.SETTINGS.tokenAnimationSpeed.hint`,
    scope: "world",
    config: true,
    default: 6,
    type: Number,
    onChange: () => {
      updateHooks();
    },
  });

  settings.register(MODULENAME, "encumbranceAutomation", {
    name: `${MODULENAME}.SETTINGS.encumbranceAutomation.name`,
    hint: `${MODULENAME}.SETTINGS.encumbranceAutomation.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => updateHooks(),
    requiresReload: true,
  });

  settings.register(MODULENAME, "npcRenamer", {
    name: `${MODULENAME}.SETTINGS.npcRenamer.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamer.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => updateHooks(),
  });

  settings.register(MODULENAME, "npcRenamerAddRandomProperty", {
    name: `${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.hint`,
    scope: "world",
    config: true,
    type: String,
    choices: {
      none: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.none`),
      numberPostfix: i18n.localize(
        `${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.numberPostfix`,
      ),
      wordPrefix: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerAddRandomProperty.wordPrefix`),
    },
    default: "none",
    onChange: (key) => {
      renameRandomPropertyType = <string>key;
    },
  });

  settings.register(MODULENAME, "npcRenamerRandomPropertySkipForUnique", {
    name: `${MODULENAME}.SETTINGS.npcRenamerRandomPropertySkipForUnique.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerRandomPropertySkipForUnique.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  //TODO Fix and add prefix/postfix word
  // gs.register(MODULENAME, "npcRenamerPrefix", {
  //   name: `${MODULENAME}.SETTINGS.npcRenamerPrefix.name`,
  //   hint: `${MODULENAME}.SETTINGS.npcRenamerPrefix.hint`,
  //   scope: "world",
  //   config: true,
  //   type: String,
  //   default: "",
  // });
  //
  // gs.register(MODULENAME, "npcRenamerPostfix", {
  //   name: `${MODULENAME}.SETTINGS.npcRenamerPostfix.name`,
  //   hint: `${MODULENAME}.SETTINGS.npcRenamerPostfix.hint`,
  //   scope: "world",
  //   config: true,
  //   type: String,
  //   default: "",
  // });

  settings.register(MODULENAME, "npcRenamerNoMatch", {
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
        settings.set(MODULENAME, "npcRenamerNoMatch", "...");
      }
    },
  });

  settings.register(MODULENAME, "npcRenamerModifierKey", {
    name: `${MODULENAME}.SETTINGS.npcRenamerModifierKey.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerModifierKey.hint`,
    scope: "world",
    type: String,
    config: true,
    choices: {
      ALWAYS: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.always`),
      DISABLED: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.disabled`),
      ALT: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.alt`),
      CONTROL: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.control`),
      META: i18n.localize(`${MODULENAME}.SETTINGS.npcRenamerModifierKey.meta`),
    },
    default: "CONTROL",
    onChange: (key) => {
      renameModifierKey = <string>key;
    },
  });

  //TODO Fix and add
  // gs.register(MODULENAME, "npcRenamerUnrenameToOriginalTokenName", {
  //   name: `${MODULENAME}.SETTINGS.npcRenamerUnrenameToOriginalTokenName.name`,
  //   hint: `${MODULENAME}.SETTINGS.npcRenamerUnrenameToOriginalTokenName.hint`,
  //   scope: "world",
  //   config: true,
  //   type: Boolean,
  //   default: false,
  // });
  //
  settings.register(MODULENAME, "npcRenamerExcludeActorTypes", {
    name: `${MODULENAME}.SETTINGS.npcRenamerExcludeActorTypes.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerExcludeActorTypes.hint`,
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  settings.register(MODULENAME, "npcRenamerIcon", {
    name: `${MODULENAME}.SETTINGS.npcRenamerIcon.name`,
    hint: `${MODULENAME}.SETTINGS.npcRenamerIcon.hint`,
    scope: "world",
    config: true,
    type: String,
    default: "fa-solid fa-eye-slash",
  });

  renameModifierKey = String(settings.get(MODULENAME, "npcRenamerModifierKey"));
  renameRandomPropertyType = String(settings.get(MODULENAME, "npcRenamerAddRandomProperty"));

}

