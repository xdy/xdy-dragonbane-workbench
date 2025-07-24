import {reminderTargeting} from "./targeting";
import {combats, i18n, MODULENAME, notifications, scenes, settings} from "../xdy-dragonbane-workbench";
import {extractChatMessageInfo, type ExtractedChatInfo, shouldIHandleThis, shouldIHandleThisMessage} from "./utils";
import {renderNameHud, tokenCreateRenaming} from "./tokenNames";
import {handleEncumbranceAutomation} from "./handle-encumbrance-automation";

export const preCreateChatMessageHook = (message: ChatMessage, _data: any, _options: any, _user: any) => {
  let proceed = true;

  const reminderTargetingEnabled = String(game.settings?.get(MODULENAME, "reminderTargeting")) !== "no";
  const reminderCannotAttack = String(game.settings?.get(MODULENAME, "reminderCannotAttack"));

  // Handle targeting reminders
  if (reminderTargetingEnabled) {
    proceed = reminderTargeting(message, String(game.settings?.get(MODULENAME, "reminderTargeting")));
  }

  // Handle attack validity
  if (proceed && reminderCannotAttack === "cancelAttack") {
    proceed = checkAttackValidity(message, true);
  }

  return proceed;
};

export function createChatMessageHook(_message: ChatMessage) {
  const reminderCancelAttack = String(game.settings?.get(MODULENAME, "reminderCannotAttack"));
  if (reminderCancelAttack === "reminder") {
    checkAttackValidity(_message, false);
  }

  const reminderTargetingSetting = String(game.settings?.get(MODULENAME, "reminderTargeting"));
  if (["no", "reminder"].includes(reminderTargetingSetting)) {
    reminderTargeting(_message, reminderTargetingSetting);
  }
}

export async function createTokenHook(token: TokenDocument, ..._args: any[]) {
  if (game.user?.isGM && settings.get(MODULENAME, "npcRenamer")) {
    await tokenCreateRenaming(token).then();
  }
}

export function preUpdateTokenHook(_document: any, update: { x: null; y: null; }, options: object, ..._args: any[]) {
  if (update.x !== null || update.y !== null) {
    foundry.utils.setProperty(options, "animation", {
      movementSpeed: settings.get(MODULENAME, "tokenAnimationSpeed"),
    });
  }
}

export function renderTokenHUDHook(_app: TokenDocument, html: HTMLElement, data: any
) {
  if (html && game.user?.isGM && settings.get(MODULENAME, "npcRenamer")) {
    renderNameHud(data, html);
  }
}

//Called from createItem, deleteItem, updateItem
export async function encumbranceAutomationHook(item: Item, _options: any) {
  if (
    // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
    item.actor?.type === "character" &&
    settings.get(MODULENAME, "encumbranceAutomation") &&
    shouldIHandleThis(item.actor)
  ) {
    // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
    await handleEncumbranceAutomation(item.actor);
  }
}


function getAttackReasonCannotHappen(token: TokenDocument | null | undefined): string {
  if (!token) return "";
  const conditionReasons = {
    dead: `${MODULENAME}.SETTINGS.reminderCannotAttack.dead`,
    defeated: `${MODULENAME}.SETTINGS.reminderCannotAttack.defeated`,
  };

  // @ts-ignore @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
  if (token.actor?.system["hitPoints"]["value"] <= 0) {
    return conditionReasons.dead;
  } else if (combats.active?.combatant?.token === token && combats.active?.combatant?.defeated) {
    return conditionReasons.defeated;
  }
  return "";
}


function checkAttackValidity(message: ChatMessage, cancel: boolean) {
  let info: ExtractedChatInfo | null = extractChatMessageInfo(message.content);

  if (
    info &&
    shouldIHandleThisMessage(message, true, true)
  ) {
    const tokenId = message.speaker.token;
    if (!tokenId) {
      return true;
    }

    const token = scenes.current?.tokens.get(tokenId);

    if (!token || !token.actor) {
      return true;
    }

    const reason = getAttackReasonCannotHappen(
      token
    );

    if (reason) {
      const reasonKey = cancel ? "reminderCannotAttack.error" : "reminderCannotAttack.info";
      const actorName = token.actor.name || "(unknown)";

      let weapon = fromUuidSync(info.itemUuid);
      let msg = i18n.format(`${MODULENAME}.SETTINGS.${reasonKey}`, {
        title: info.actionType,
        // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
        weapon: weapon?.name || "(unknown)",
        actorName,
        reason: i18n.localize(reason),
      });
      notifications[cancel ? "error" : "info"](msg);
      return false;
    }
  }
  return true;
}


