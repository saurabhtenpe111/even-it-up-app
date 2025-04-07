
import { ChangeEvent } from 'react';

/**
 * Adapter for InputTextField's onChange handler from React ChangeEvent to string
 * @param callback Function that expects a string value
 * @returns A function that handles React ChangeEvent and passes the value to the callback
 */
export const adaptInputChangeEvent = (callback: (value: string) => void) => {
  return (e: ChangeEvent<HTMLInputElement>) => callback(e.target.value);
};

/**
 * Adapter for TextareaField's onChange handler from React ChangeEvent to string
 * @param callback Function that expects a string value
 * @returns A function that handles React ChangeEvent and passes the value to the callback
 */
export const adaptTextareaChangeEvent = (callback: (value: string) => void) => {
  return (e: ChangeEvent<HTMLTextAreaElement>) => callback(e.target.value);
};

/**
 * Creates a default empty handler for inputs where no callback is needed
 * @returns A function that accepts a string value and does nothing
 */
export const createEmptyHandler = () => {
  return (value: string) => {};
};
