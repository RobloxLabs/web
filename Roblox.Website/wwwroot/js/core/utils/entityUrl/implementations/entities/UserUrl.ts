import EntityUrl from '../EntityUrl';

class UserUrl extends EntityUrl {
  getRelativePath(id: number): string {
    return `/users/${id}/profile`;
  }

  getReferralPath(): string {
    return '/users/refer';
  }
}

export default UserUrl;
