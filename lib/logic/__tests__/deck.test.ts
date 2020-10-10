import deucesConfig from '../../../game-config/deuces';
import { Deck } from '../deck';

describe('Deck class', () => {
  let deck = new Deck(deucesConfig.deck);

  beforeEach(() => {
    deck = new Deck(deucesConfig.deck);
  });

  test('create new Deck', () => {
    expect(deck).toBeInstanceOf(Deck);
  });

  test('deal one card', () => {
    deck.createAndShuffle(1);
    const dealt = deck.deal({ perPerson: 1 }, 1);
    expect(dealt.players.length).toEqual(1);
    expect(dealt.players[0].length).toEqual(1);
  });

  test('deal cards evenly among 4 people', () => {
    deck.createAndShuffle(1);
    const dealt = deck.deal({ perPerson: 'even' }, 4);
    expect(dealt.players.length).toEqual(4);
    expect(dealt.players[0].length).toEqual(13);
  });
});
