import { GameLauncher } from 'Roblox';
import eventStreamService from '../eventStreamService/eventStreamService';

const sendEventStream = eventStreamProperties => {
  const { eventName } = eventStreamProperties;
  const { ctx } = eventStreamProperties;
  const additionalProperties = eventStreamProperties.properties;
  eventStreamService.sendEventWithTarget(eventName, ctx, additionalProperties);
};

const sendGamePlayIntentEvent = (ctx, rootPlaceId) => {
  eventStreamService.sendGamePlayEvent(ctx, rootPlaceId);
};

const joinGameInstance = (placeId, gameInstanceId) => {
  GameLauncher.joinGameInstance(placeId, gameInstanceId, true, true);
};

const followPlayer = playerId => {
  GameLauncher.followPlayerIntoGame(playerId);
};

const joinMultiPlayer = placeId => {
  GameLauncher.joinMultiplayerGame(placeId);
};

const buildPlayGameProperties = (rootPlaceId, placeId, gameInstanceId, playerId) => {
  return {
    rootPlaceId,
    placeId,
    gameInstanceId,
    playerId
  };
};

const launchGame = (playGameProperties, eventStreamProperties) => {
  if (GameLauncher) {
    const currentESProperties = eventStreamProperties;
    const { rootPlaceId } = playGameProperties;
    const { placeId } = playGameProperties;
    const { gameInstanceId } = playGameProperties;
    const { playerId } = playGameProperties;
    if (placeId === rootPlaceId && gameInstanceId) {
      currentESProperties.properties.gameInstanceId = gameInstanceId;
      sendEventStream(currentESProperties);
      sendGamePlayIntentEvent(currentESProperties.gamePlayIntentEventCtx, rootPlaceId);
      joinGameInstance(placeId, gameInstanceId);
    } else if (rootPlaceId && playerId) {
      currentESProperties.properties.playerId = playerId;
      sendEventStream(currentESProperties);
      sendGamePlayIntentEvent(currentESProperties.gamePlayIntentEventCtx, rootPlaceId);
      followPlayer(playerId);
    } else {
      sendEventStream(currentESProperties);
      sendGamePlayIntentEvent(currentESProperties.gamePlayIntentEventCtx, placeId);
      joinMultiPlayer(placeId);
    }
  }
};

export default {
  buildPlayGameProperties,
  launchGame
};
