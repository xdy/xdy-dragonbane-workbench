export {};
declare global {
  interface LenientGlobalVariableTypes {
    canvas: any; // the type doesn't matter
    game: any; // the type doesn't matter
    socket: any; // the type doesn't matter
    ui: any; // the type doesn't matter
  }

  interface SettingConfig {
    'xdy-dragonbane-workbench.reminderCannotAttack': string;
    'xdy-dragonbane-workbench.reminderTargeting': string;
    'xdy-dragonbane-workbench.tokenAnimationSpeed': number;
    'xdy-dragonbane-workbench.encumbranceAutomation': boolean;
    'xdy-dragonbane-workbench.npcRenamer': boolean;
    'xdy-dragonbane-workbench.npcRenamerAddRandomProperty': string;
    'xdy-dragonbane-workbench.npcRenamerRandomPropertySkipForUnique': boolean;
    'xdy-dragonbane-workbench.npcRenamerNoMatch': string;
    'xdy-dragonbane-workbench.npcRenamerModifierKey': string;
    'xdy-dragonbane-workbench.npcRenamerExcludeActorTypes': string;
    'xdy-dragonbane-workbench.npcRenamerIcon': string;
  }
}

