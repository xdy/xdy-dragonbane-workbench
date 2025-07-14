import {MODULENAME} from "../xdy-dragonbane-workbench";
import {ActorSystemData} from "foundry-pf2e";
import {renameModifierKey, renameRandomPropertyType} from "./register-settings";
import {TranslationDictionaryValue} from "foundry-pf2e/foundry/client/helpers/localization.mjs";

function shouldSkipRandomProperty(token: any) {
  return (
    game.settings.get(MODULENAME, "npcRenamerRandomPropertySkipForUnique") &&
    (<ActorSystemData>token?.actor?.system)?.traits?.rarity === "unique"
  );
}

async function fetchRandomWordPrefix(): Promise<string> {
  let translations: string | { [p: string]: TranslationDictionaryValue } = game.i18n.translations ?? {};
  translations = (<any>translations).TOKEN?.Adjectives;
  const translationKeys = Object.keys(translations);
  if (translationKeys.length > 0) {
    const randomKey = translationKeys[Math.floor(Math.random() * translationKeys.length)];
    // @ts-ignore
    return translations[randomKey];
  }
  return "";
}

export async function buildTokenName(token: any, isRenamed: boolean): Promise<string> {
  let tokenName = "";

  function getTokenName(): string {
    const useOriginalTokenName = false; //game.settings.get(MODULENAME, "npcRenamerUnrenameToOriginalTokenName");
    if (useOriginalTokenName) {
      const originalTokenName = String(token.getFlag(MODULENAME, "originalTokenName"));
      if (originalTokenName) {
        return originalTokenName ?? "";
      }
    }

    const prefix = ""; // game.settings.get(MODULENAME, "npcRenamerPrefix") !== "" ? game.settings.get(MODULENAME, "npcRenamerPrefix") + " " : "";
    const postfix = ""; //game.settings.get(MODULENAME, "npcRenamerPostfix") !== "" ? game.settings.get(MODULENAME, "npcRenamerPostfix") + " " : "";
    const replacement = ""; // game.settings.get(MODULENAME, "npcRenamerReplacement") !== "" ? game.settings.get(MODULENAME, "npcRenamerReplacement") + " " : "";

    return replacement !== "" ? replacement : prefix + (token.actor?.prototypeToken.name ?? "") + postfix;
  }

  if (token && token.actor) {
    tokenName = token.name;
    if (isRenamed) {
      tokenName = getTokenName();
    } else {
      // Store the original name before renaming
      if (!token.getFlag(MODULENAME, "originalTokenName")) {
        await token.setFlag(MODULENAME, "originalTokenName", token.name);
      }

      if (!shouldSkipRandomProperty(token)) {
        let rolled = 0;

        switch (renameRandomPropertyType) {
          case "numberPostfix":
            rolled = Math.floor(Math.random() * 100) + 1;
            // Retry once if the number is already used, can't be bothered to roll until unique or keep track of used numbers
            // @ts-ignore
            if (canvas?.scene?.tokens?.find((t) => t.name.endsWith(` ${rolled}`))) {
              rolled = Math.floor(Math.random() * 100) + 1;
            }
            tokenName += ` ${rolled}`;
            break;
          case "wordPrefix":
            tokenName = `${await fetchRandomWordPrefix()} ${tokenName}`.trim();
            break;
        }
      }
    }
  }

  // Never return an empty string
  return tokenName === "" ? String(game.settings.get(MODULENAME, "npcRenamerNoMatch")) : tokenName;
}

function isRenameModifierKeyPressed() {
  switch (renameModifierKey) {
    case "ALT":
      return game?.keyboard?.isModifierActive("Alt");
    case "CONTROL":
      return game?.keyboard?.isModifierActive("Control");
    case "META":
      return game?.keyboard?.downKeys.has("MetaLeft") || game?.keyboard?.downKeys.has("MetaRight");
    default:
      return false;
  }
}

export async function tokenCreateRenaming(token: any) {
  const key = String(game.settings.get(MODULENAME, "npcRenamerModifierKey"));
  if (
    game.user?.isGM &&
    token &&
    !token?.actor?.hasPlayerOwner &&
    key !== "DISABLED" &&
    (key === "ALWAYS" || isRenameModifierKeyPressed()) &&
    (!game.keyboard?.downKeys.has("V") || game.keyboard?.downKeys.has("Insert"))
  ) {
    if (Hooks.call(`${MODULENAME}.tokenCreateRenaming`, token)) {
      await doRenaming(token, false);
    }
  }
}

export function isTokenRenamed(token: any): boolean {
  const tokenName = token?.name;
  const prototypeTokenName = token?.actor?.prototypeToken.name ?? "";

  return tokenName !== prototypeTokenName;
}

/**
 * Takes a token ID and a boolean value to perform a renaming.
 *
 * @param {string} tokenId - The ID of the token.
 * @param {boolean} active - Whether the renaming should be active or not.
 * @return {Promise<void>} A promise that resolves when the renaming is complete.
 */
export async function doRenamingFromToken(tokenId: string, active: boolean) {
  const token = game.scenes?.current?.tokens?.get(tokenId);
  if (token) {
    return doRenaming(token, active);
  }
}

export async function doRenaming(token: any | undefined, active: boolean) {
  if (!token?.actor) {
    return;
  }

  // define array of objects to be updated
  const updates = [
    {
      _id: <string>token.id,
      name: await buildTokenName(token, active),
    },
  ];

  const scene: Scene | null = canvas?.scene;
  // @ts-ignore
  scene?.updateEmbeddedDocuments("Token", updates, {}).then(() => {
    if (game.combat) {
      new Promise((resolve) => setTimeout(resolve, 50)).then(() => {
        ui.combat?.render(true);
        ui.combat.combats
          .filter((x) => x.combatants.filter((c) => c.actor?.id === token.actor?.id).length > 0)
          // @ts-ignore
          .forEach((c) => c.updateSource({}, {render: true}));
      });
    }
  });
}

export function renderNameHud(data: any, html: HTMLElement) {
  let token: any | null;
  if (canvas && canvas.tokens) {
    token = canvas.tokens.get(<string>data._id) ?? null;

    const title = isTokenRenamed(token) ? "Un-rename" : "Renhame";
    const toggle = document.createElement("div");
    toggle.className = `control-icon toggle ${isTokenRenamed(token) ? "active" : ""}`;
    toggle.setAttribute("data-action", "rename");

    const icon = document.createElement("i");
    icon.className = String(game.settings.get(MODULENAME, "npcRenamerIcon"));
    icon.title = title;

    toggle.appendChild(icon);

    if (canRename() && !token?.actor?.hasPlayerOwner) {
      toggle.addEventListener("click", async (e) => {
        const hudElement = e.currentTarget as HTMLElement;
        const active = hudElement.classList.contains("active");
        if (token !== null && isTokenRenamed(token) === active) {
          await doRenaming(token?.document, active);
        }
        hudElement.classList.toggle("active");
      });

      const column = html.querySelector("div.col.left");
      if (column) {
        column.appendChild(toggle);
      }
    }
  }
}

export function canRename() {
  return game.user?.isGM && canvas && canvas.tokens;
}
