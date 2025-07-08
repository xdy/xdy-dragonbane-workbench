import {MODULENAME} from "../xdy-dragonbane-workbench";
import {extractChatMessageInfo, ExtractedChatInfo, shouldIHandleThisMessage} from "./utils";

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
        const info = game.i18n.format(`${MODULENAME}.SETTINGS.reminderTargeting.info`, {
          title,
          weapon: weapon?.name || "(unknown)",
        });
        ui.notifications.info(info);
      } else if (setting === "mustTarget") {
        const error = game.i18n.format(`${MODULENAME}.SETTINGS.reminderTargeting.error`, {
          title, weapon: weapon?.name || "(unknown)",
        });
        ui.notifications.error(error);
        return false;
      }
    }
  }
  return true;
}
