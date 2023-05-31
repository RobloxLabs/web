import bootstrapData from '../constants/bootstrapData';
import presenceService from '../services/presenceService';

const { activeEvents, inactiveEvents, defaultIntervalTime, currentPageName } = bootstrapData;

const userInteraction = (() => {
  // private
  let intervalTime = defaultIntervalTime;
  let isEnabled = false;
  let isActive = false;
  let lastUserInteraction = null;

  const getPageData = () => {
    const bootstrapDataNode = document.getElementById('presence-registration-bootstrap-data');
    intervalTime = Number.isNaN(bootstrapDataNode?.dataset.interval)
      ? 3000
      : parseInt(bootstrapDataNode?.dataset.interval, 10);
    isEnabled = bootstrapDataNode?.dataset.isEnabled === 'True';
  };

  const listenToUserInteraction = () => {
    activeEvents.forEach(event => {
      window.addEventListener(event, () => {
        lastUserInteraction = event;
        isActive = true;
      });
    });

    inactiveEvents.forEach(event => {
      window.addEventListener(event, () => {
        isActive = false;
        lastUserInteraction = null;
        console.debug('-------------Inactive -------------');
      });
      return isActive;
    });
  };

  const init = () => {
    getPageData();

    if (isEnabled) {
      listenToUserInteraction();
      setInterval(() => {
        if (isActive) {
          // TODO: maybe we need a debug window for mobile web view
          console.debug(`-----------${lastUserInteraction}------------ Active`);
          presenceService
            .registerPresence(currentPageName)
            .then(() => {})
            .catch(error => {
              console.debug(error);
            });
        }

        isActive = false;
      }, intervalTime);
    }
  };
  return {
    init
  };
})();

userInteraction.init();
