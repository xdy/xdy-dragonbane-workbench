import {i18n, MODULENAME, notifications, settings} from "../xdy-dragonbane-workbench";
import type {DoDCharacter} from "./dragonbane";

export const overEncumbered = "overEncumbered";

export function addOverEncumberedStatus() {
  if (settings.get(MODULENAME, "encumbranceAutomation") && !CONFIG.statusEffects.find(e => e.id === overEncumbered)) {
    CONFIG.statusEffects.unshift({
      "id": overEncumbered,
      "name": i18n.localize(`${MODULENAME}.EFFECTS.StatusOverEncumbered`),
      "img": "icons/svg/wall-direction.svg"
    });
  }
}


export async function handleEncumbranceAutomation(actor: DoDCharacter) {
  const enc = actor.system.encumbrance.value || 0;
  const max = actor.system.maxEncumbrance.value || 0;
  const isEncumbered = actor.effects.some(e => e.statuses.has(overEncumbered));

  const shouldBeEncumbered = enc > max;
  if (shouldBeEncumbered !== isEncumbered) {
    await actor.toggleStatusEffect(overEncumbered, {active: shouldBeEncumbered})
    if (shouldBeEncumbered) {
      notifications.info(i18n.format(`${MODULENAME}.SETTINGS.encumbranceAutomation.isEncumbered`, {
        name: actor.name
      }));
    } else {
      notifications.info(i18n.format(`${MODULENAME}.SETTINGS.encumbranceAutomation.isNotEncumbered`, {
        name: actor.name
      }));
    }
  }
}
