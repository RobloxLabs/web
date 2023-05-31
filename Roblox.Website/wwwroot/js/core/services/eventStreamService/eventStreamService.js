import { EventStream, GamePlayEvents } from 'Roblox';
import { DEFAULT_TARGET_TYPES, EVENT_TYPES } from './eventStreamConstants';

const isEventStreamValid = () => typeof EventStream !== 'undefined';

const targetTypes = {
  ...DEFAULT_TARGET_TYPES,
  ...(isEventStreamValid() ? EventStream.TargetTypes : {})
};

const sendEventWithTarget = (eventName, context, additionalProperties, targetType) => {
  if (isEventStreamValid() && EventStream.SendEventWithTarget) {
    const validatedTargetType = Object.values(targetTypes).includes(targetType)
      ? targetType
      : targetTypes.WWW;

    EventStream.SendEventWithTarget(eventName, context, additionalProperties, validatedTargetType);
  }
};

const sendEvent = (event, additionalParams) => {
  const { name, type, context, requiredParams } = event;
  const eventParams = {
    btn: name,
    ...additionalParams
  };

  if (Array.isArray(requiredParams)) {
    requiredParams.forEach(requiredParam => {
      if (!Object.prototype.hasOwnProperty.call(eventParams, requiredParam)) {
        // eslint-disable-next-line no-console
        console.info(`A required event parameter '${requiredParam}' is not provided`);
      }
    });
  }

  sendEventWithTarget(type, context, eventParams);
};

const sendGamePlayEvent = (context, placeId, referrerId) => {
  if (GamePlayEvents && GamePlayEvents.SendGamePlayIntent) {
    GamePlayEvents.SendGamePlayIntent(context, placeId, referrerId);
  }
};

export default {
  eventTypes: EVENT_TYPES,
  targetTypes,
  sendEvent,
  sendEventWithTarget,
  sendGamePlayEvent
};
