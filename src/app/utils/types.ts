export function exhaustiveCheck(val: never): never {
  throw new Error('Unreachable code, value received: ' + val);
}
