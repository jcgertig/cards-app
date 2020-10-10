import { IBooleanConditional, IMathConditional } from './logic/types';

/**
 * Support face down cards on table / collection
 * Support claiming colleted count with guards and turn order for claiming
 */

export type PokerSuits = 'S' | 'H' | 'C' | 'D';
export type PokerCards =
  | 'Joker'
  | 'A'
  | 'K'
  | 'Q'
  | 'J'
  | '10'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | '2';

type PokerPointValueConfig =
  | number
  | { S: number; H: number; C: number; D: number };

export interface IPokerCardPointValues {
  Joker?: PokerPointValueConfig;
  A: PokerPointValueConfig;
  K: PokerPointValueConfig;
  Q: PokerPointValueConfig;
  J: PokerPointValueConfig;
  '10': PokerPointValueConfig;
  '9': PokerPointValueConfig;
  '8': PokerPointValueConfig;
  '7': PokerPointValueConfig;
  '6': PokerPointValueConfig;
  '5': PokerPointValueConfig;
  '4': PokerPointValueConfig;
  '3': PokerPointValueConfig;
  '2': PokerPointValueConfig;
}

export type IDeckType = 'poker' | 'hwatu';

export interface IPokerDeckConfig {
  type: 'poker';
  suitPriority: Array<PokerSuits>;
  cardPriority: Array<PokerCards>;
  cardPointValues: IPokerCardPointValues;
  joker?: {
    count: 0;
    role: 'wild' | 'point';
  };
}
export interface IHwatuDeckConfig {
  type: 'hwatu';
  // todo hwatu deck config
}
export type IDeckConfig = IPokerDeckConfig | IHwatuDeckConfig;

export type IValidHands = '1' | '2' | '3' | '4' | 'poker' | 'any';

export type INextDirection =
  | 'clockwise'
  | 'counter-clockwise'
  | 'left'
  | 'right'
  | 'across'
  | 'none';

export type IPlayTarget = 'table' | 'collection' | 'other-collection';

export interface IRoundPlayConditions {
  hands: Array<IValidHands>;
  guards?: IBooleanConditional;
  canSkip?: boolean | IBooleanConditional; // default false
  canPlayAfterSkip?: boolean | IBooleanConditional; // default false
}

export interface IRoundsConfig {
  newDeck: boolean | IBooleanConditional; // default true
  firstPlayerConditions: IBooleanConditional;
  firstPlayerPlayConditions: IRoundPlayConditions;
  nextPlayer: {
    direction?: INextDirection;
    guards?: IBooleanConditional;
  };
  playerPlayConditions: IRoundPlayConditions;
  winConditions: IBooleanConditional;
  completeConditions: IBooleanConditional;
  passCards?: {
    direction: Array<INextDirection>;
    count: number;
  };
  deal:
    | 'all'
    | {
        order: {
          '*'?: {
            perPerson?: number;
            toTable?: number;
          };
          [key: string]: // should be a number key
          | {
                perPerson?: number;
                toTable?: number;
              }
            | undefined;
        };
      };
  discard?: {
    count: number;
  };
  call?: {
    count: number;
    guards?: IBooleanConditional;
    countFromDeck?: number;
  };
  draw?: {
    count: number;
    target?: Array<'deck' | 'discard'>;
  };
  place?: {
    guards?: IBooleanConditional;
  };
  play?: {
    target?: Array<IPlayTarget>;
  };
  collectionVisible?: boolean;
}

export interface IGameConfig {
  playerCount: {
    min: number;
    max: number;
  };
  deck: {
    count: number | IMathConditional;
  } & IDeckConfig;
  customCardGroups?: { [key: string]: IBooleanConditional };
  customConditions?: { [key: string]: IBooleanConditional };
  phases: {
    order: Array<'play' | 'discard' | 'draw'>;
    canSkipToLast?: boolean; // default false
  };
  rounds: {
    order: {
      '*'?: IRoundsConfig;
      [key: string]: IRoundsConfig | undefined; // should be a number key
    };
  };
  pointCalculation?: IMathConditional;
  winConditions: IBooleanConditional;
  completeConditions: IBooleanConditional;
}
