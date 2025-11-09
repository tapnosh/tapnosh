type Success<T> = readonly [null, T];
type Failure<E> = readonly [E, null];
type ResultSync<T, E> = Success<T> | Failure<E>;
type ResultAsync<T, E> = Promise<ResultSync<T, E>>;
type Operation<T> = Promise<T> | (() => T) | (() => Promise<T>);

export function tryCatch<T, E = Error>(
  operation: Promise<T>,
): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(
  operation: () => Promise<T>,
): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(operation: () => T): ResultSync<T, E>;
export function tryCatch<T, E = Error>(
  operation: Operation<T>,
): ResultSync<T, E> | ResultAsync<T, E> {
  if (operation instanceof Promise) {
    return operation
      .then((data: T) => [null, data] as const)
      .catch((error: E) => [error as E, null] as const);
  }

  try {
    const result = operation();

    if (result instanceof Promise) {
      return result
        .then((data: T) => [null, data] as const)
        .catch((error: E) => [error as E, null] as const);
    }

    return [null, result] as const;
  } catch (error) {
    return [error as E, null] as const;
  }
}
