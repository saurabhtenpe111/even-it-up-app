
import React from 'react';

/**
 * Adapter to convert React.ChangeEvent to the expected string value for input components
 * @param setter - State setter function that accepts a string value
 * @returns A function that handles React.ChangeEvent and passes the value to the setter
 */
export function adaptInputChangeEvent(setter: (value: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
}
