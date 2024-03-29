import deucesConfig from '../../../game-config/deuces';
import { validHand, validPokerHand } from '../checkHand';

describe('validPokerHand', () => {
  test('is not valid with < 5 cards', () => {
    expect(validPokerHand(['3H', '5C', '6D', '7S'], deucesConfig.deck)).toEqual(
      false
    );
  });
  test('straight to be valid (3,4,5,6,7)', () => {
    expect(
      validPokerHand(['3H', '5C', '6D', '7S', '4H'], deucesConfig.deck)
    ).toEqual(true);
  });

  test('flush to be valid (3H,4H,6H,7H,9H)', () => {
    expect(
      validPokerHand(['3H', '4H', '6H', '7H', '9H'], deucesConfig.deck)
    ).toEqual(true);
  });

  test('full house to be valid (2H,2C,2D,7H,7C)', () => {
    expect(
      validPokerHand(['2H', '2C', '2D', '7H', '7C'], deucesConfig.deck)
    ).toEqual(true);
  });

  test('four of a kind to be valid (3H,3S,3C,3D,9H)', () => {
    expect(
      validPokerHand(['3H', '3S', '3C', '3D', '9H'], deucesConfig.deck)
    ).toEqual(true);
  });

  test('straight to be valid (AH,KS,QC,JD,10H)', () => {
    expect(
      validPokerHand(['AH', 'KS', 'QC', 'JD', '10H'], deucesConfig.deck)
    ).toEqual(true);
  });

  test('straight to be valid (AH,2S,3C,4D,5H)', () => {
    expect(
      validPokerHand(['AH', '2S', '3C', '4D', '5H'], deucesConfig.deck)
    ).toEqual(true);
  });

  test('five cards to not be valid (AH,2S,3C,6D,5H)', () => {
    expect(
      validPokerHand(['AH', '2S', '3C', '6D', '5H'], deucesConfig.deck)
    ).toEqual(false);
  });

  test('five cards to not be valid starting with an ace (AH,3S,4C,5D,6H)', () => {
    expect(
      validPokerHand(['AH', '3S', '4C', '5D', '6H'], deucesConfig.deck)
    ).toEqual(false);
  });
});

describe('validHand', () => {
  test('should return true for "any" hand', () => {
    expect(validHand([], ['any'], deucesConfig.deck)).toEqual(true);
  });

  test('should return true for "1" hand', () => {
    expect(validHand(['AH'], ['1'], deucesConfig.deck)).toEqual(true);
  });
  test('should return false for one card and only "2" allowed hand', () => {
    expect(validHand(['AH'], ['2'], deucesConfig.deck)).toEqual(false);
  });

  test('should return true for "2" hand', () => {
    expect(validHand(['AH', 'AS'], ['2'], deucesConfig.deck)).toEqual(true);
  });
  test('should return false for two cards and only "1" allowed hand', () => {
    expect(validHand(['AH', 'AS'], ['1'], deucesConfig.deck)).toEqual(false);
  });

  test('should return true for "3" hand', () => {
    expect(validHand(['AH', 'AS', 'AD'], ['3'], deucesConfig.deck)).toEqual(
      true
    );
  });
  test('should return false for two cards and only "2" allowed hand', () => {
    expect(validHand(['AH', 'AS', 'AD'], ['2'], deucesConfig.deck)).toEqual(
      false
    );
  });

  test('should return true for "4" hand', () => {
    expect(
      validHand(['AH', 'AS', 'AD', 'AC'], ['4'], deucesConfig.deck)
    ).toEqual(true);
  });
  test('should return false for two cards and only "3" allowed hand', () => {
    expect(
      validHand(['AH', 'AS', 'AD', 'AC'], ['3'], deucesConfig.deck)
    ).toEqual(false);
  });

  test('should return true for "poker" hand', () => {
    expect(
      validHand(['AH', 'AS', 'AD', 'AC', '2C'], ['poker'], deucesConfig.deck)
    ).toEqual(true);
  });
  test('should return false bad poker hand', () => {
    expect(
      validHand(['AH', 'AS', 'AD', '3C', '2C'], ['poker'], deucesConfig.deck)
    ).toEqual(false);
  });
  test('should return false for five cards and only "4" allowed hand', () => {
    expect(
      validHand(['AH', 'AS', 'AD', 'AC', '2C'], ['4'], deucesConfig.deck)
    ).toEqual(false);
  });
});
