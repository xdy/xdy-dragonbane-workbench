import {i18n, MODULENAME, socket, user, users} from "../xdy-dragonbane-workbench";

function shouldIHandleThisMessage(message: ChatMessage, playerCondition = true, gmCondition = true) {
  const amIMessageSender = message.author?.id === game.user?.id;
  if (!game.user?.isGM && playerCondition && amIMessageSender) {
    return true;
  } else if (game.user?.isGM && gmCondition && amIMessageSender) {
    return true;
  }
  return false;
}

export {shouldIHandleThisMessage};

export function shouldIHandleThis(actor: Actor) {
  if (!actor) return null;
  const currentUser = users.current;
  const activePlayers = users.players.filter((u) => u.active);
  const assignedUser = activePlayers.find((u) => u.character === actor);
  const anyoneWithPermission = activePlayers.find((u) => actor.canUserModify(u, "update"));
  const updater =
    currentUser?.active && actor.canUserModify(currentUser, "update")
      ? currentUser
      : (assignedUser ?? users.activeGM ?? anyoneWithPermission ?? null);
  return user.id === updater?.id;
}

export interface ExtractedChatInfo {
  text: string;
  itemUuid: string;
  result: 'success' | 'failure' | 'critical-failure' | 'critical-success';
  target?: string;
  actionType: string;
}

export function extractChatMessageInfo(message: string): ExtractedChatInfo | null {
  if (!message) return null;

  const translations: any = i18n.translations['DoD'] ?? {};
  const moduleTranslations: any = i18n.translations[`${MODULENAME}`] ?? {};

  const itemUuidMatch = message.match(/@UUID\[([^\]]+)\]/);
  const itemUuid = itemUuidMatch ? itemUuidMatch[1] : '';
  if (!itemUuid) return null;

  let withTargetPattern = moduleTranslations["SETTINGS"]["reminderTargeting"]["withTarget"];
  let withoutTargetPattern = moduleTranslations["SETTINGS"]["reminderTargeting"]["withoutTarget"];
  let text = '';
  let actionType = '';
  let target: string | undefined = undefined;
  let resultText = '';

  let match = message.match(withTargetPattern);
  if (match && match[1] && match[2] && match[3]) {
    text = match[0].trim();
    actionType = match[1].trim();
    target = match[2].trim();
    resultText = match[3].trim();
  } else {
    match = message.match(withoutTargetPattern);
    if (match && match[1] && match[2]) {
      text = match[0].trim();
      actionType = match[1].trim();
      resultText = match[2].trim();
    }
  }

  let result: 'success' | 'failure' | 'critical-failure' | 'critical-success';

  const dragonResult = translations?.roll?.dragon || '';
  const demonResult = translations?.roll?.demon || '';
  const successResult = translations?.roll?.success || '';
  const failureResult = translations?.roll?.failure || '';

  const cleanResultText = resultText.replace(/[.!]$/, '');

  if (dragonResult && cleanResultText.includes(dragonResult.replace(/[.!]$/, ''))) {
    result = 'critical-success';
  } else if (demonResult && cleanResultText.includes(demonResult.replace(/[.!]$/, ''))) {
    result = 'critical-failure';
  } else if (successResult && cleanResultText.includes(successResult.replace(/[.!]$/, ''))) {
    result = 'success';
  } else if (failureResult && cleanResultText.includes(failureResult.replace(/[.!]$/, ''))) {
    result = 'failure';
  } else {
    return null;
  }

  return {
    text,
    itemUuid,
    result,
    target,
    actionType
  };
}

export function pushNotification(message: any, type: string = "info") {
  socket.emit("module." + MODULENAME, {operation: "notification", args: [type, message]});
}
