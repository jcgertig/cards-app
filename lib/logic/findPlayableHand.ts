import { IPlayTarget } from '../game-config';
import Game from './game';

function uniqueCombinations(input, len) {
  let entries = input.reduce((map, value, idx) => {
    map.set(`${idx}`, [value]);
    return map;
  }, new Map());
  for (let i = 1; i < len; i += 1) {
    const newEntries = new Map();
    for (const [key, values] of entries.entries()) {
      for (let x = 0; x < input.length; x += 1) {
        const newKey = [...new Set([...key.split('-'), `${x}`])].sort();
        const newKeyFull = newKey.join('-');
        if (newKey.length === i + 1 && !newEntries.has(newKeyFull)) {
          newEntries.set(newKeyFull, [...values, input[x]]);
        }
      }
    }
    entries = newEntries;
  }
  return [...entries.values()];
}

export function findPlayableHand(
  game: Game,
  target: IPlayTarget = 'table'
): string[] | null {
  const playerHand = game.currentPlayerData.hand;
  const lastPlayedCards = game.previousPlayedCards;
  let options: Array<Array<string>> = [];
  if (lastPlayedCards.length > 0) {
    options = uniqueCombinations(playerHand, lastPlayedCards.length);
    for (const option of options) {
      if (game.canPlay(option, target)) {
        return option;
      }
    }
    return null;
  }

  // never played before
  const conditions = game.currentPlayConditions;
  const checked: any = [];
  const ifCheck = (inc: string, handInc?: string) =>
    !checked.includes(inc) &&
    options.length === 0 &&
    (conditions.hands.includes(handInc || (inc as any)) ||
      conditions.hands.includes('any'));
  const elseCheck = (inc: string, handInc?: string) =>
    !checked.includes(inc) &&
    !conditions.hands.includes(handInc || (inc as any));

  while (checked.length < 5) {
    if (ifCheck('5', 'poker')) {
      checked.push('5');
      options = uniqueCombinations(playerHand, 5);
    } else if (elseCheck('5', 'poker')) {
      checked.push('5');
    }
    if (ifCheck('4')) {
      checked.push('4');
      options = uniqueCombinations(playerHand, 4);
    } else if (elseCheck('4')) {
      checked.push('4');
    }
    if (ifCheck('3')) {
      checked.push('3');
      options = uniqueCombinations(playerHand, 3);
    } else if (elseCheck('3')) {
      checked.push('3');
    }
    if (ifCheck('2')) {
      checked.push('2');
      options = uniqueCombinations(playerHand, 2);
    } else if (elseCheck('2')) {
      checked.push('2');
    }
    if (ifCheck('1')) {
      checked.push('1');
      options = uniqueCombinations(playerHand, 1);
    } else if (elseCheck('1')) {
      checked.push('1');
    }

    for (const option of options) {
      if (game.canPlay(option, target)) {
        return option;
      }
    }
    options = [];
  }
  return null;
}
