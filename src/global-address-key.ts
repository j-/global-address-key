import base64url from './base-64-url';

export type GlobalAddressKeyField = [fieldName: string, fieldValue: string];

const fieldExpr = /^(\w+)=(.*?)(?:~|$)/;

/**
 * Iterates the fields of the given global address key and yields them as name/
 * value tuples.
 */
export function* iterateGlobalAddresskeyFields(globalAddressKey: string): IterableIterator<GlobalAddressKeyField> {
  let string = base64url.decode(globalAddressKey);
  while (true) {
    const match = string.match(fieldExpr);
    if (!match) break;
    yield [match[1], match[2]];
    string = string.substring(match[0].length);
  }
}

export function getFieldByName(globalAddressKey: string, fieldName: string): string | null {
  for (const [name, value] of iterateGlobalAddresskeyFields(globalAddressKey)) {
    if (name !== fieldName) continue;
    return value || null;
  }
  return null;
}

/**
 * Gets the "alt key" (GNAF PID) from a global address key. Will return `null`
 * if no alt key is declared in this global address key.
 *
 * @example
 *
 * const globalAddressKey = 'aWQ9MSBUaXdpIFN0cmVldCwgQlVOREFMTCAgUUxEIDQyMT...';
 * const gnafpId = getAltKey(globalAddressKey);
 * console.log(gnafpId); // => "GAQLD155815970"
 */
export function getAltKey(globalAddressKey: string): string | null {
  return getFieldByName(globalAddressKey, 'alt_key');
}
