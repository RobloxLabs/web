import GameUrl from './implementations/entities/GameUrl';
import GroupUrl from './implementations/entities/GroupUrl';
import UserUrl from './implementations/entities/UserUrl';

export default {
  game: new GameUrl(),
  group: new GroupUrl(),
  user: new UserUrl()
};
