import dataStores from './dataStoreManagement/stores/dataStores';
import entityUrl from './utils/entityUrl/entityUrl';
import eventStreamService from './services/eventStreamService/eventStreamService';
import hybridService from './services/hybridService';
import localStorageService from './services/localStorageService/localStorageService';
import localStorageNames from './services/localStorageService/localStorageNames';
import playGameService from './services/playGames/playGameService';
import userInfoService from './services/userInfoService/userInfoService';
import metricsService from './services/metricsService/metricsService';

window.CoreRobloxUtilities = {
  dataStores,
  entityUrl,
  eventStreamService,
  hybridService,
  localStorageService,
  localStorageNames,
  playGameService,
  userInfoService,
  metricsService
};
