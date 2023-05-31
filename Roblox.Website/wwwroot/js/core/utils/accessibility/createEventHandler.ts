import { SyntheticEvent } from 'react';
/**
 * Generic utility factory method for creating event handler
 *
 * @param fn the callback function to be executed if the condition is met
 * @param predicate the function that decides if the callback should be executed
 * @param preventDefault whether event.preventDefault should be called
 * @param stopPropagation whether event.stopPropagation should be called
 */
export default function createEventHandler(
  fn: () => void,
  predicate: (event: Event | SyntheticEvent) => boolean,
  preventDefault = false,
  stopPropagation = false
): (event: Event | SyntheticEvent) => void {
  return (event: Event | SyntheticEvent): void => {
    if (predicate(event)) {
      if (preventDefault) {
        event.preventDefault();
      }

      if (stopPropagation) {
        event.stopPropagation();
      }

      fn();
    }
  };
}
