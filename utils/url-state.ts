/**
 * Updates URL search params without triggering a page navigation
 * @param params - URLSearchParams to update
 * @param key - Parameter key to set
 * @param value - Parameter value to set
 */
export function setUrlParam(
  params: URLSearchParams,
  key: string,
  value: string,
) {
  const newParams = new URLSearchParams(params);
  newParams.set(key, value);
  const newUrl = `${window.location.pathname}?${newParams.toString()}`;
  window.history.replaceState(null, "", newUrl);
}

/**
 * Removes a URL search param without triggering a page navigation
 * @param params - URLSearchParams to update
 * @param key - Parameter key to delete
 */
export function deleteUrlParam(params: URLSearchParams, key: string) {
  const newParams = new URLSearchParams(params);
  newParams.delete(key);
  const query = newParams.toString();
  const newUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(null, "", newUrl);
}
