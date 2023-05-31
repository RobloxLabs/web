import { seoName } from 'core-utilities';
import EntityUrl from '../EntityUrl';

class GameUrl extends EntityUrl {
  getRelativePath(id: number): string {
    return `/games/${id}`;
  }

  getReferralPath(): string {
    return '/games/refer';
  }
}

export default GameUrl;
