import { EnvironmentUrls } from 'Roblox';
import { httpService } from 'core-utilities';

const registerPresence = currentPageName => {
    const { presenceApi } = EnvironmentUrls;
    const registerPresenceApi = `${presenceApi}/v1/presence/register-app-presence`;
    const urlConfig = {
        url: registerPresenceApi,
        withCredentials: true
    };
    const data = {
        location: currentPageName
    };
    return httpService.post(urlConfig, data);
};

export default {
    registerPresence
};
