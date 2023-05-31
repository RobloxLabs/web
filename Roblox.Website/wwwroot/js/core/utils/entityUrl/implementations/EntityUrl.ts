import { EnvironmentUrls } from 'Roblox';
import urlService from '../../../services/urlService';
import IEntityUrl from '../interfaces/IEntityUrl';

abstract class EntityUrl implements IEntityUrl {
  // Each inheriting class for an entity should implement this abstract method
  abstract getRelativePath(id: number): string;

  abstract getReferralPath(): string;

  getAbsoluteUrl(id: number): string | null {
    if (typeof id !== 'number') {
      return null;
    }

    const baseUrl = EnvironmentUrls.websiteUrl;
    const relativePath = urlService.formatUrl({ pathname: this.getRelativePath(id) });
    return urlService.resolveUrl(baseUrl, relativePath);
  }

  navigateTo(id: number): void {
    const url = this.getAbsoluteUrl(id);
    if (url) {
      window.location.assign(url);
    }
  }
}

export default EntityUrl;
