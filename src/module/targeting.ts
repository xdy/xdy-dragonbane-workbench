import {i18n, MODULENAME, notifications} from "../xdy-dragonbane-workbench";
import {extractChatMessageInfo, type ExtractedChatInfo, shouldIHandleThisMessage} from "./utils";

export function reminderTargeting(message: ChatMessage, setting: any) {

  let info: ExtractedChatInfo | null = extractChatMessageInfo(message.content);

  if (
    info &&
    message.author &&
    shouldIHandleThisMessage(message, true, true)
  ) {
    const targets = (message.author).targets;
    if (!targets || targets.size === 0) {
      const title = info.actionType;
      let weapon = fromUuidSync(info.itemUuid);

      if (setting === "reminder") {
        const info = i18n.format(`${MODULENAME}.SETTINGS.reminderTargeting.info`, {
          title,
          // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
          weapon: weapon?.name || "(unknown)",
        });
        notifications.info(info);
      } else if (setting === "mustTarget") {
        const error = i18n.format(`${MODULENAME}.SETTINGS.reminderTargeting.error`, {
          title,
          // @ts-expect-error Meh. Meh is not long enough. But. Still. Meh.
          weapon: weapon?.name || "(unknown)",
        });
        notifications.error(error);
        return false;
      }
    }
  }
  return true;
}
