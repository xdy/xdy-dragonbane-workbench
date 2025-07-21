import {MODULENAME} from "../xdy-dragonbane-workbench";

export const overEncumbered = "overEncumbered";

export function addOverEncumberedStatus() {
  if (game.settings.get(MODULENAME, "encumbranceAutomation") && !CONFIG.statusEffects.find(e => e.id === overEncumbered)) {
    CONFIG.statusEffects.unshift({
      "id": overEncumbered,
      "name": game.i18n.localize(`${MODULENAME}.EFFECTS.StatusOverEncumbered`),
      "img": "icons/svg/wall-direction.svg"
    });
  }
}

export function handleEncumbranceAutomation(actor) {
  const enc = actor.system?.encumbrance?.value || 0;
  const max = actor.system?.maxEncumbrance?.value || 0;
  const isEncumbered = actor.effects.some(e => e.statuses?.has(overEncumbered));

  const shouldBeEncumbered = enc > max;
  if (shouldBeEncumbered !== isEncumbered) {
    actor.toggleStatusEffect(overEncumbered, {active: shouldBeEncumbered});
    if (shouldBeEncumbered) {
      ui.notifications.info(game.i18n.format(`${MODULENAME}.SETTINGS.encumbranceAutomation.isEncumbered`, {
        name: actor.name
      }));
    } else {
      ui.notifications.info(game.i18n.format(`${MODULENAME}.SETTINGS.encumbranceAutomation.isNotEncumbered`, {
        name: actor.name
      }));
    }
  }
}
