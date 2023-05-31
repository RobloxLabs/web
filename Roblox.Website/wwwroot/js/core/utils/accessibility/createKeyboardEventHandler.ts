import { SyntheticEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import createEventHandler from './createEventHandler';

/** We also need to support React's synthetic event system... */
function isKeyboardEvent(event: Event | SyntheticEvent): boolean {
  if (event instanceof Event) {
    return event instanceof KeyboardEvent;
  }
  return event.nativeEvent && event.nativeEvent instanceof KeyboardEvent;
}

/**
 * Create a keyboard event handler that execute the given function
 * when the key is pressed matched one of the given keys
 *
 * @param fn the callback function to be executed if the specified key is pressed
 * @param keys the list of keys to listen for
 * @param preventDefault whether event.preventDefault should be called
 * @param stopPropagation whether event.stopPropagation should be called
 */
export default function createKeyboardEventHandler(
  fn: () => void,
  keys: string[],
  preventDefault: boolean,
  stopPropagation: boolean
): (event: Event | SyntheticEvent) => void {
  return createEventHandler(
    fn,
    event => {
      if (!isKeyboardEvent(event)) {
        // eslint-disable-next-line no-console
        console.info(
          'The event passed in is not a keyboard event, are you using the handler in the wrong place?'
        );
        return false;
      }
      return keys.includes((event as KeyboardEvent | ReactKeyboardEvent).key);
    },
    preventDefault,
    stopPropagation
  );
}
