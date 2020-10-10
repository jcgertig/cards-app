import { IDeckConfig, PokerCards, PokerSuits } from '../game-config';

const POKER_SUITS = ['S', 'H', 'C', 'D'];
const POKER_UNITS = [
  'A',
  'K',
  'Q',
  'J',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2'
];
const POKER_CARDS = POKER_SUITS.reduce<Array<string>>((res, suit) => {
  return [...res, ...POKER_UNITS.map((unit) => `${unit}${suit}`)];
}, []);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export class Card {
  name: string;
  suit: string = '';
  unit: string = '';
  pointValue: number = 0;
  value: number = 0;
  suitPriority: number = 0;
  unitPriority: number = 0;
  pokerPriority: number = 0;

  constructor(name: string, deckConfig: IDeckConfig) {
    this.name = name;
    if (deckConfig.type === 'poker') {
      for (const suit of POKER_SUITS) {
        if (suit === name.slice(0 - suit.length)) {
          this.suit = suit;
          this.unit = name.slice(0, name.length - suit.length);
          const map = deckConfig.cardPointValues[this.unit];
          this.pointValue = typeof map === 'number' ? map : map[this.suit];
          this.unitPriority = deckConfig.cardPriority.indexOf(
            this.unit as PokerCards
          );
          this.suitPriority = deckConfig.suitPriority.indexOf(
            this.suit as PokerSuits
          );
          this.pokerPriority = POKER_UNITS.indexOf(this.unit);
          this.value =
            (deckConfig.cardPriority.length - this.unitPriority - 1) * 10 +
            (this.suit
              ? deckConfig.suitPriority.length - this.suitPriority - 1
              : 0);
        }
      }
    }
  }
}

export class Deck {
  private cards: Array<string> = [];
  private left: Array<string> = [];

  constructor(config: IDeckConfig) {
    if (config.type === 'poker') {
      let cards = [...POKER_CARDS];
      if (config.joker) {
        cards = [...cards, ...new Array(config.joker.count).fill('Joker')];
      }
      this.cards = cards;
    } else if (config.type === 'hwatu') {
      // todo handle hwatu decks
    }
  }

  createAndShuffle = (count: number) => {
    let cards = [...this.cards];
    for (let i = 1; i < count; i += 1) {
      cards = [...cards, ...this.cards];
    }
    this.left = shuffle(cards);
  };

  deal = (
    config: { perPerson?: 'even' | number; toTable?: number },
    personCount: number
  ) => {
    const { perPerson = 0, toTable = 0 } = config;
    let players: Array<Array<string>> = new Array(personCount).fill([]);
    const table = this.left.slice(0, toTable);
    this.left = this.left.slice(toTable);
    const count =
      perPerson === 'even'
        ? Math.floor(this.left.length / personCount)
        : perPerson;
    players = players.map(() => {
      const player = this.left.slice(0, count);
      this.left = this.left.slice(count);
      return player;
    });
    return { players, table };
  };
}
