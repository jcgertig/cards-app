import { clone, last } from 'lodash';

import {
  IGameConfig,
  INextDirection,
  IPlayTarget,
  IRoundPlayConditions
} from '../game-config';
import { resolveCheck } from './checkConditions';
import { validHand } from './checkHand';
import { Card, Deck } from './deck';
import { pokerValue } from './pokerValue';

export const LevelValueSymbol = Symbol('_value');

interface INewGameOptions {
  config: IGameConfig;
  playerIds: Array<number>;
}

interface IGameOptions {
  options: IGameState;
}

export interface IGameState {
  config: IGameConfig;
  playerIds: Array<number>;
  points: Array<number>;
  rounds: Array<IGameRound>;
  currentRoundIdx: number;
  complete: boolean;
  winner?: number;
}

interface IGamePlayer {
  hand: Array<string>;
  played: Array<Array<string>>;
  collected: Array<Array<string>>;
  skipped: boolean;
  points: number;
  callCount: number;
  called: Array<Array<string>>;
}

interface IGameRound {
  deck: Deck;
  turnIdx: number;
  players: Array<IGamePlayer>;
  table: Array<string>;
  discards: Array<string>;
  firstPlayerIdx: number;
  previousPlayerIdx: number[];
  currentPlayerIdx: number;
  winner?: number;
  called: Array<number>;
}

interface IDataProxyArgs {
  path: Array<string>;
  previous: boolean;
  all: boolean;
  winner: boolean;
  player: boolean;
  firstPlayer: boolean;
}

const recent = (data: Array<any>) => {
  if (Array.isArray(data[0])) {
    return last(data);
  }
  return data;
};

export default class Game {
  private config: IGameConfig;
  private playerIds: Array<number> = [];
  private points: Array<number> = [];

  private rounds: Array<IGameRound> = [];
  private currentRoundIdx = -1;
  private complete = false;
  private gameWinner: number | undefined;

  get winner() {
    return typeof this.gameWinner === 'number'
      ? this.playerIds[this.gameWinner]
      : undefined;
  }

  get roundWinner() {
    return typeof this.currentRound.winner === 'number'
      ? this.playerIds[this.currentRound.winner]
      : undefined;
  }

  get isActive() {
    return typeof this.currentRound !== 'undefined' && !this.winner;
  }

  get currentPlayerId() {
    return this.playerIds[this.currentRound.currentPlayerIdx];
  }

  private get currentRound() {
    return this.rounds[this.currentRoundIdx];
  }

  private get previousRound() {
    return this.rounds[this.currentRoundIdx - 1];
  }

  private get currentPlayer() {
    return this.currentRound.players[this.currentRound.currentPlayerIdx];
  }

  get currentPlayConditions() {
    const roundConfig = this.getRoundConfig();
    return JSON.parse(
      JSON.stringify(
        this.currentRound.turnIdx === 0
          ? roundConfig.firstPlayerPlayConditions
          : roundConfig.playerPlayConditions
      )
    ) as IRoundPlayConditions;
  }

  get currentPlayerData() {
    return JSON.parse(
      JSON.stringify(
        this.currentRound.players[this.currentRound.currentPlayerIdx]
      )
    ) as IGamePlayer;
  }

  private previousPlayerIdx(back: number = 1): number | null {
    const idx = this.currentRound.previousPlayerIdx.slice(
      0 - back,
      1 - back < 0 ? 1 - back : undefined
    );
    return typeof idx[0] === 'number' ? idx[0] : null;
  }

  get previousPlayedCards(): Array<string> {
    if (!this.currentRound) return [];
    let back = 1;
    let previousIdx = this.previousPlayerIdx(back);
    if (previousIdx === null) return [];
    while (this.currentRound.players[previousIdx].skipped) {
      back += 1;
      previousIdx = this.previousPlayerIdx(back);
      if (previousIdx === null) return [];
    }
    return clone(last(this.currentRound.players[previousIdx].played) || []);
  }

  asJSON() {
    return {
      config: this.config,
      playerIds: this.playerIds,
      points: this.points,
      rounds: this.rounds,
      currentRoundIdx: this.currentRoundIdx,
      complete: this.complete,
      winner: this.gameWinner
    } as IGameState;
  }

  constructor(options: INewGameOptions | IGameOptions) {
    if ((options as INewGameOptions).config) {
      const { config, playerIds } = options as INewGameOptions;
      this.config = config;
      this.playerIds = playerIds;
    } else {
      const config = (options as IGameOptions).options;
      this.config = config.config;
      this.playerIds = config.playerIds;
      this.points = config.points;
      this.rounds = config.rounds;
      this.currentRoundIdx = config.currentRoundIdx;
      this.complete = config.complete;
      this.gameWinner = config.winner;
    }
  }

  private getDataProxy = (activePlayerId: number) => {
    const args = (overrides: any = {}) => ({
      path: [] as Array<string>,
      previous: false,
      all: false,
      winner: false,
      player: false,
      firstPlayer: false,
      ...overrides
    });
    return () =>
      new Proxy(
        {},
        {
          get: (_, attribute: string) => {
            if (attribute === 'player') {
              return this.createDataProxy(
                args({ player: true }),
                activePlayerId
              );
            }
            if (attribute === 'winner') {
              return this.createDataProxy(
                args({ winner: true }),
                activePlayerId
              );
            }
            if (attribute === 'firstPlayer') {
              return this.createDataProxy(
                args({ firstPlayer: true }),
                activePlayerId
              );
            }
            if (attribute === 'all') {
              return this.createDataProxy(args({ all: true }), activePlayerId);
            }
            if (attribute === 'previous') {
              return this.createDataProxy(
                args({ previous: true }),
                activePlayerId
              );
            }
          }
        }
      );
  };

  private parseDataValue = (
    { path, previous, player, all, winner, firstPlayer }: IDataProxyArgs,
    activePlayerIdx: number
  ) => {
    const getValueFromPlayer = (player?: IGamePlayer) => {
      if (typeof player === 'undefined') {
        return undefined;
      }
      const [kind, ...rest] = path;
      let data = player[kind];
      for (const entry of rest) {
        if (entry === 'cards') {
          data = recent(data).map((name) => {
            if (name instanceof Card) return name;
            return new Card(name, this.config.deck);
          });
        } else if (entry === 'value') {
          if (Array.isArray(data)) {
            return pokerValue(data);
          }
          return data;
        } else if (entry === 'count') {
          return data.length;
        } else if (entry === 'points') {
          return data.map((card: Card) => card.pointValue);
        } else if (entry === 'suit') {
          return data.map((card: Card) => card.suit);
        } else if (entry === 'unit') {
          return data.map((card: Card) => card.unit);
        } else if (entry === 'name') {
          return data.map((card: Card) => card.name);
        }
      }
      return data;
    };
    const getValue = (round: IGameRound, all = false) => {
      if (winner) {
        return getValueFromPlayer(round.players[round.winner || '']); // '' is to ensure a undefined result
      }
      if (firstPlayer) {
        return getValueFromPlayer(round.players[round.firstPlayerIdx]);
      }
      if (all) {
        return round.players.map(getValueFromPlayer);
      }
      return getValueFromPlayer(clone(round.players[activePlayerIdx]));
    };
    if (previous && !player) {
      if (typeof this.previousRound === 'undefined') {
        return undefined;
      }
      return getValue(this.previousRound);
    }
    return getValue(this.currentRound, all);
  };

  private createDataProxy = (
    baseArgs: IDataProxyArgs,
    activePlayerId: number
  ) => {
    const getPlayerIdx = (args: IDataProxyArgs) => {
      if (!args.player) return this.currentRound.currentPlayerIdx;
      const activeIdx = this.playerIds.indexOf(activePlayerId!);
      if (args.previous && this.currentRound.previousPlayerIdx.length > 0) {
        if (args.path.includes('played')) {
          let back = 1;
          let previousIdx = this.previousPlayerIdx(back);
          if (previousIdx === null) {
            return activeIdx;
          }
          while (this.currentRound.players[previousIdx].skipped) {
            back += 1;
            previousIdx = this.previousPlayerIdx(back);
            if (previousIdx === null) {
              return activeIdx;
            }
          }
          return previousIdx;
        }
        return this.previousPlayerIdx()!;
      }
      return activeIdx;
    };

    const args = clone(baseArgs);

    const prox = new Proxy(
      {},
      {
        get: (_, attribute: string | symbol) => {
          if (attribute === 'winner') {
            // can only be a winner or a firstPlayer
            args.winner = true;
            args.firstPlayer = false;
          } else if (attribute === 'firstPlayer') {
            // can only be a winner or a firstPlayer
            args.winner = false;
            args.firstPlayer = true;
          } else if (attribute === LevelValueSymbol) {
            // get the data value
            if (
              args.player &&
              args.previous &&
              this.currentRound.previousPlayerIdx.length === 0
            ) {
              return undefined;
            }
            return this.parseDataValue(args, getPlayerIdx(args));
          } else if (attribute === 'player') {
            args.player = true;
          } else if (typeof attribute === 'string') {
            args.path.push(attribute);
          }
          return prox;
        }
      }
    );
    return prox;
  };

  private getRoundConfig = (entry?: number) => {
    const len = entry || this.rounds.length;
    const roundConfig =
      this.config.rounds.order[`${len}`] || this.config.rounds.order['*'];
    if (roundConfig) {
      return roundConfig;
    }
    throw new Error(
      `Missing round config for turn ${len}. Add a default order of * or the specific turn index.`
    );
  };

  private getNextPlayer = (playerIdx: number, direction: INextDirection) => {
    const playerCount = this.currentRound.players.length;
    if (direction === 'left' || direction === 'clockwise') {
      if (playerIdx === 0) {
        return playerCount - 1;
      }
      return playerIdx - 1;
    } else if (direction === 'right' || direction === 'counter-clockwise') {
      if (playerIdx === playerCount - 1) {
        return 0;
      }
      return playerIdx + 1;
    } else if (direction === 'across') {
      const nextIdxDiff = Math.floor(playerCount / 2);
      return playerIdx + nextIdxDiff - playerCount;
    }
    return playerIdx;
  };

  private removeCardsFromHand = (playerIdx: number, cards: Array<string>) => {
    this.currentRound.players[playerIdx].hand = this.currentRound.players[
      playerIdx
    ].hand.filter((i) => !cards.includes(i));
  };

  private addCardsToHand = (playerIdx: number, cards: Array<string>) => {
    this.currentRound.players[playerIdx].hand = [
      ...this.currentRound.players[playerIdx].hand,
      ...cards
    ];
  };

  private newRound = () => {
    this.currentRoundIdx += 1;
    const roundConfig = this.getRoundConfig(this.currentRoundIdx + 1);
    if (roundConfig.newDeck || this.currentRoundIdx === 0) {
      const deck = new Deck(this.config.deck);
      deck.createAndShuffle(
        resolveCheck(
          this.config.deck.count,
          this.getDataProxy(this.playerIds[0])
        )
      );

      this.rounds.push({
        deck,
        turnIdx: 0,
        table: [],
        discards: [],
        players: new Array(this.playerIds.length).fill('').map((_) => ({
          hand: [],
          played: [],
          collected: [],
          skipped: false,
          points: 0,
          callCount: 0,
          called: []
        })),
        firstPlayerIdx: 0,
        previousPlayerIdx: [],
        currentPlayerIdx: 0,
        called: []
      });

      const { players, table } = this.deal();
      this.currentRound.table = table;
      for (let i = 0; i < players.length; i += 1) {
        this.currentRound.players[i].hand = players[i];
      }
    } else {
      this.rounds.push({
        ...clone(this.previousRound),
        players: this.previousRound.players.map((prePlayer) => ({
          hand: clone(prePlayer.hand),
          played: [],
          collected: [],
          skipped: false,
          points: 0,
          callCount: 0,
          called: []
        })),
        turnIdx: 0,
        table: [],
        discards: [],
        firstPlayerIdx: 0,
        previousPlayerIdx: [],
        currentPlayerIdx: 0,
        called: [],
        winner: undefined
      });
    }

    for (let idx = 0; idx < this.currentRound.players.length; idx += 1) {
      if (
        resolveCheck(
          roundConfig.firstPlayerConditions,
          this.getDataProxy(this.playerIds[idx])
        )
      ) {
        this.currentRound.firstPlayerIdx = idx;
        this.currentRound.currentPlayerIdx = idx;
      }
    }
  };

  get roundComplete() {
    const roundConfig = this.getRoundConfig();
    return resolveCheck(
      roundConfig.completeConditions,
      this.getDataProxy(this.playerIds[this.currentRound.currentPlayerIdx])
    );
  }

  get gameComplete() {
    if (this.complete) return true;
    if (this.config.completeConditions) {
      return resolveCheck(
        this.config.completeConditions,
        this.getDataProxy(this.playerIds[this.currentRound.currentPlayerIdx])
      );
    }
    return false;
  }

  private evaluateWinner = () => {
    const winnerId = this.playerIds.find((id) => {
      return resolveCheck(this.config.winConditions!, this.getDataProxy(id));
    });
    if (winnerId) {
      return this.playerIds.indexOf(winnerId);
    }
    return;
  };

  private evaluateRoundWinner = () => {
    const winnerId = this.playerIds.find((id) => {
      return resolveCheck(
        this.getRoundConfig().winConditions,
        this.getDataProxy(id)
      );
    });
    if (winnerId) {
      return this.playerIds.indexOf(winnerId);
    }
    return;
  };

  private calculateTurnPoints = () => {
    if (this.config.pointCalculation) {
      const newPoints = resolveCheck(
        this.config.pointCalculation!,
        this.getDataProxy(this.playerIds[this.currentRound.currentPlayerIdx])
      );
      this.currentPlayer.points = newPoints;
    }
  };

  private calculateGamePoints = () => {
    this.points = this.rounds.reduce((res, round) => {
      return round.players.reduce((points, player, idx) => {
        points[idx] += player.points;
        return points;
      }, res);
    }, new Array(this.playerIds.length).fill(0));
  };

  get roundWon() {
    return (
      typeof this.currentRound !== 'undefined' &&
      typeof this.currentRound.winner !== 'undefined'
    );
  }

  get canAddPlayer() {
    return (
      this.rounds.length === 0 &&
      (this.playerIds.length < this.config.playerCount.min ||
        this.playerIds.length < this.config.playerCount.max)
    );
  }

  addPlayer = (playerId: number) => {
    if (!this.canAddPlayer) {
      throw new Error('Can no longer add players');
    }
    this.playerIds.push(playerId);
  };

  get canStart() {
    return (
      !this.complete &&
      (this.roundWon ||
        (this.playerIds.length >= this.config.playerCount.min &&
          this.playerIds.length <= this.config.playerCount.max))
    );
  }

  start = () => {
    if (!this.canStart) {
      throw new Error('Not able to start the game');
    }
    if (this.rounds.length === 0) {
      this.points = new Array(this.playerIds.length).fill(0);
    }
    this.newRound();
    if (this.getRoundConfig().passCards) {
      return 'passCards';
    }
    return 'start';
  };

  get canPass() {
    if (this.roundWon) return false;
    const roundConfig = this.getRoundConfig();
    if (roundConfig.passCards) {
      const dirIdx =
        this.currentRound.turnIdx % roundConfig.passCards.direction.length;
      const direction = roundConfig.passCards.direction[dirIdx];
      return direction !== 'none';
    }
    return false;
  }

  pass = (playerIdx: number, cards: Array<string>) => {
    if (this.canPass) {
      const roundConfig = this.getRoundConfig();
      const dirIdx =
        this.currentRound.turnIdx % roundConfig.passCards!.direction.length;
      const direction = roundConfig.passCards!.direction[dirIdx];
      const nextPlayerIdx = this.getNextPlayer(playerIdx, direction);
      this.removeCardsFromHand(playerIdx, cards);
      this.addCardsToHand(nextPlayerIdx, cards);
    } else {
      throw new Error('Not able to pass cards');
    }
  };

  deal = () => {
    const roundConfig = this.getRoundConfig();
    if (roundConfig.deal === 'all') {
      return this.currentRound.deck.deal(
        { perPerson: 'even', toTable: 0 },
        this.playerIds.length
      );
    } else {
      const len = this.currentRound.turnIdx;
      const dealConfig =
        roundConfig.deal.order[`${len + 1}`] || roundConfig.deal.order['*'];
      if (dealConfig) {
        return this.currentRound.deck.deal(dealConfig, this.playerIds.length);
      }
      throw new Error(
        `Missing deal config for turn ${len +
          1}. Add a default order of * or the specific turn index.`
      );
    }
  };

  get canDraw() {
    if (this.roundWon) return false;
    const roundConfig = this.getRoundConfig();
    return !!roundConfig.draw;
  }

  get drawTargets() {
    if (!this.canDraw) {
      throw new Error('Drawing cards is not supported');
    }
    const roundConfig = this.getRoundConfig();
    return roundConfig.draw!.target || ['deck'];
  }

  draw = (fromDiscard: boolean) => {
    if (!this.canDraw) {
      throw new Error('Drawing cards is not supported');
    }
    const roundConfig = this.getRoundConfig();
    const drawCount = roundConfig.draw!.count;
    let cards: Array<string> = [];
    // draw from discard if its a choice or if its forced
    if (
      (fromDiscard && this.drawTargets.includes('discard')) ||
      (this.drawTargets.length === 1 && this.drawTargets[0] === 'discard')
    ) {
      cards = this.currentRound.table.slice(0 - drawCount);
      this.currentRound.table = this.currentRound.table.slice(
        0,
        this.currentRound.table.length - drawCount
      );
    } else {
      // draw from the deck
      cards = this.currentRound.deck.deal(
        {
          perPerson: drawCount
        },
        1
      ).players[0];
      this.currentRound.table = this.currentRound.table.slice(drawCount);
      // if the discard was called award it
      if (this.canCall && this.currentRound.called.length > 0) {
        // get the first called player that can call
        const calledPlayerIdx = this.currentRound.called.find((idx) => {
          if (!roundConfig.call?.guards) return true;
          return resolveCheck(
            roundConfig.call?.guards,
            this.getDataProxy(this.playerIds[idx])
          );
        });
        const callCount = roundConfig.call!.count;

        // give discard to player that called
        if (typeof calledPlayerIdx === 'number') {
          let calledCards = this.currentRound.table.slice(0 - callCount);
          this.currentRound.table = this.currentRound.table.slice(
            0,
            this.currentRound.table.length - callCount
          );
          // penalty cards from the deck
          if (typeof roundConfig.call!.countFromDeck === 'number') {
            const extraCards = this.currentRound.deck.deal(
              {
                perPerson: roundConfig.call!.countFromDeck
              },
              1
            ).players[0];
            calledCards = [...calledCards, ...extraCards];
          }
          this.addCardsToHand(calledPlayerIdx, calledCards);
        }
      }
    }
    this.currentRound.called = [];
    this.addCardsToHand(this.currentRound.currentPlayerIdx, cards);
  };

  get canSkip() {
    if (this.roundWon) return false;
    const { canSkip } = this.currentPlayConditions;
    return canSkip;
  }

  skip = () => {
    if (!this.canSkip) {
      throw new Error('Skipping is not allowed');
    }
    this.currentPlayer.skipped = true;
  };

  canPlay = (
    cards: Array<string>,
    target: IPlayTarget,
    otherPlayerIdx?: number
  ) => {
    if (this.roundWon) return false;
    const { hands, guards } = this.currentPlayConditions;
    if (validHand(cards, hands, this.config.deck)) {
      const oldHand = [...this.currentPlayer.hand];
      const oldTable = [...this.currentRound.table];
      if (target === 'table') {
        this.currentRound.table = [...this.currentRound.table, ...cards];
      } else if (target === 'collection') {
        this.currentPlayer.collected.push(cards);
      } else if (target === 'other-collection' && otherPlayerIdx) {
        this.currentRound.players[otherPlayerIdx].collected.push(cards);
      }
      this.currentPlayer.played.push(cards);
      this.removeCardsFromHand(this.currentRound.currentPlayerIdx, cards);

      const resetCards = () => {
        if (target === 'table') {
          this.currentRound.table = oldTable;
        } else if (target === 'collection') {
          this.currentPlayer.collected.pop();
        } else if (target === 'other-collection' && otherPlayerIdx) {
          this.currentRound.players[otherPlayerIdx].collected.pop();
        }
        this.currentPlayer.hand = oldHand;
        this.currentPlayer.played.pop();
      };

      if (
        !guards ||
        resolveCheck(
          guards,
          this.getDataProxy(
            this.playerIds[
              target === 'other-collection'
                ? otherPlayerIdx!
                : this.currentRound.currentPlayerIdx
            ]
          )
        )
      ) {
        resetCards();
        return true;
      }
      resetCards();
    }
    return false;
  };

  play = (
    cards: Array<string>,
    target: IPlayTarget = 'table',
    otherPlayerIdx?: number
  ) => {
    if (!this.canPlay(cards, target, otherPlayerIdx)) {
      throw new Error('This type of hand is not allowed');
    }
    if (target === 'table') {
      this.currentRound.table = [...this.currentRound.table, ...cards];
    } else if (target === 'collection') {
      this.currentPlayer.collected.push(cards);
    } else if (target === 'other-collection' && otherPlayerIdx) {
      this.currentRound.players[otherPlayerIdx].collected.push(cards);
    }
    this.currentPlayer.played.push(cards);
    this.removeCardsFromHand(this.currentRound.currentPlayerIdx, cards);
  };

  get canCall() {
    if (this.roundWon) return false;
    const roundConfig = this.getRoundConfig();
    return !roundConfig.discard || !roundConfig.call ? false : true;
  }

  call = (playerIdx: number) => {
    if (!this.canCall) {
      throw new Error('Calling is not allowed');
    }
    this.currentRound.called.push(playerIdx);
  };

  get canDiscard() {
    if (this.roundWon) return false;
    const roundConfig = this.getRoundConfig();
    return !!roundConfig.discard;
  }

  discard = (cards: Array<string>) => {
    if (!this.canDiscard) {
      throw new Error('Discarding not allowed');
    }

    const roundConfig = this.getRoundConfig();
    if (roundConfig.discard!.count !== cards.length) {
      throw new Error(
        `Card count does not match the required amount of ${
          roundConfig.discard!.count
        }`
      );
    }
    this.currentRound.table = [...(this.currentRound.table || []), ...cards];
    this.removeCardsFromHand(this.currentRound.currentPlayerIdx, cards);
  };

  get canPlace() {
    if (this.roundWon) return false;
    const roundConfig = this.getRoundConfig();
    return !!roundConfig.place;
  }

  place = (cards: Array<string>) => {
    if (!this.canPlace) {
      throw new Error('Placing not allowed');
    }

    const roundConfig = this.getRoundConfig();
    if (
      roundConfig.place!.guards &&
      !resolveCheck(
        roundConfig.place!.guards,
        this.getDataProxy(this.playerIds[this.currentRound.currentPlayerIdx])
      )
    ) {
      throw new Error(`The cards placed did not meet the required conditions`);
    }
    this.currentPlayer.collected.push(cards);
    this.removeCardsFromHand(this.currentRound.currentPlayerIdx, cards);
  };

  done = () => {
    const roundConfig = this.getRoundConfig();
    const { direction, guards } = roundConfig.nextPlayer || {
      direction: 'clockwise'
    };
    let nextPlayerIdx = this.getNextPlayer(
      this.currentRound.currentPlayerIdx,
      direction!
    );
    if (guards) {
      while (
        !resolveCheck(guards, this.getDataProxy(this.playerIds[nextPlayerIdx]))
      ) {
        nextPlayerIdx = this.getNextPlayer(nextPlayerIdx, direction!);
      }
    }
    this.calculateTurnPoints();
    if (!this.roundComplete) {
      if (
        !this.currentPlayer.skipped &&
        this.currentPlayConditions.canPlayAfterSkip
      ) {
        // set all skipped to false if canPlayAfterSkip is true to allow for a second chance
        for (let i = 0; i < this.currentRound.players.length; i += 1) {
          this.currentRound.players[i].skipped = false;
        }
      }
      this.currentRound.turnIdx += 1;
      this.currentRound.previousPlayerIdx.push(
        this.currentRound.currentPlayerIdx
      );
      this.currentRound.currentPlayerIdx = nextPlayerIdx;
      this.currentPlayer.skipped = false;
    } else {
      this.currentRound.winner = this.evaluateRoundWinner();
      this.calculateGamePoints();
      if (this.gameComplete) {
        this.complete = true;
        this.gameWinner = this.evaluateWinner();
      } else {
        this.newRound();
      }
    }
  };
}
