import EntityUrl from '../EntityUrl';

class GroupUrl extends EntityUrl {
  getRelativePath(id: number): string {
    return `/groups/${id}`;
  }

  getReferralPath(): string {
    return '/groups/refer';
  }
}

export default GroupUrl;
