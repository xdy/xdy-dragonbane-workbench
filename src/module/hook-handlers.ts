import {reminderTargeting} from "./targeting";
import {MODULENAME} from "../xdy-dragonbane-workbench";
import {extractChatMessageInfo, ExtractedChatInfo, shouldIHandleThisMessage} from "./utils";

export const preCreateChatMessageHook = (message: ChatMessage, data: any, _options: any, _user: any) => {
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

export function preUpdateTokenHook(_document: any, update: { x: null; y: null; }, options: object, ..._args: any[]) {
  if (update.x !== null || update.y !== null) {
    foundry.utils.setProperty(options, "animation", {
      movementSpeed: game.settings.get(MODULENAME, "tokenAnimationSpeed"),
    });
  }
}

function getAttackReasonCannotHappen(token: any): string {
  if (!token) return "";
  const conditionReasons = {
    dead: `${MODULENAME}.SETTINGS.reminderCannotAttack.dead`,
    defeated: `${MODULENAME}.SETTINGS.reminderCannotAttack.defeated`,
  };

  // @ts-ignore
  if (token.actor?.system["hitPoints"]["value"] <= 0) {
    return conditionReasons.dead;
  } else if (game.combats.active?.combatant?.token === token && game.combats.active?.combatant?.defeated) {
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

    const token = game.scenes.current?.tokens.get(tokenId);

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
      let msg = game.i18n.format(`${MODULENAME}.SETTINGS.${reasonKey}`, {
        title: info.actionType,
        weapon: weapon?.name || "(unknown)",
        actorName,
        reason: game.i18n.localize(reason),
      });
      ui.notifications[cancel ? "error" : "info"](msg);
      return false;
    }
  }
  return true;
}


