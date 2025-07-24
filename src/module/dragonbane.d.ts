/**
 * Represents an actor in the DoD system.
 */
export class DoDActor extends Actor {
  // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
  system: DoDActorBaseDataSchema;
}

export class DoDCharacter extends DoDActor {
  // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
  system: DoDActorBaseDataSchema & DoDCharacterBaseDataSchema & DoDCharacterDataSchema;
}

export class DoDDNPC extends DoDCharacter {
  // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
  system: DoDActorBaseDataSchema & DoDCharacterBaseDataSchema & DoDCharacterDataSchema & DoDNPCDataSchema;
}

export class DragonbaneDataModel {
  //Do I even need this?
}

export default class DoDActorBaseData extends DragonbaneDataModel {
  //Do I even need this?
}

export interface DoDActorBaseDataSchema {
  description: string;
  movement: {
    base: number;
    value: number;
  };
  hitPoints: {
    value: number;
    base: number;
    max: number;
  };
  currency: {
    gc: number;
    sc: number;
    cc: number;
  };
  encumbrance: {
    value: number;
  };
}

export class DoDCharacterBaseData extends DoDActorBaseData {
  //Do I even need this?
}

export interface DoDCharacterBaseDataSchema {
  kin: string;
  age: string;
  profession: string;
  motivation: string;
  willPoints: {
    value: number;
    base: number;
    max: number;
  };
  damageBonus: {
    agl: { base: string; value: string; };
    str: { base: string; value: string; };
  };
}

export class DoDCharacterData extends DoDCharacterBaseData {
  //Do I even need this?
}

export interface DoDCharacterDataSchema {
  attributes: {
    str: { base: number; value: number; };
    con: { base: number; value: number; };
    agl: { base: number; value: number; };
    int: { base: number; value: number; };
    wil: { base: number; value: number; };
    cha: { base: number; value: number; };
  };
  conditions: {
    str: { value: boolean; };
    con: { value: boolean; };
    agl: { value: boolean; };
    int: { value: boolean; };
    wil: { value: boolean; };
    cha: { value: boolean; };
  };
  age: string;
  appearance: string;
  weakness: string;
  notes: string;
  deathRolls: {
    successes: number;
    failures: number;
  };
  canRestRound: boolean;
  canRestStretch: boolean;
  maxEncumbrance: {
    base: number;
    value: number;
  };
}

export class DoDNPCData extends DoDActorBaseData {
  //Do I even need this?
}

export interface DoDNPCDataSchema {
  traits: {
    rarity: string;
  };
}
