import { GameTypes } from '../lib/enum-mappings';
import deucesConfig from './deuces';
import heartsConfig from './hearts';

export function getGameConfig(type: GameTypes) {
  if (type === 0) {
    return deucesConfig;
  } else if (type === 1) {
    return heartsConfig;
  }
  return null;
}
