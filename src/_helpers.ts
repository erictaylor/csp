/** Deeply freezes an object. */
export const deepFreeze = <T>(obj: T): Readonly<T> => Object.freeze(obj);
