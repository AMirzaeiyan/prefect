// we really do want any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toRecord<T extends any[], K extends keyof T[number]>(source: T, key: K): Record<K, T> {
  return source.reduce((result, item) => {
    const itemKey = item[key]
    result[itemKey] = item

    return result
  }, {})
}

export function asArray<T extends any>(input: T | T[] | null): T[] {
  if(input === null || input === undefined) {
    return []
  }

  if(!Array.isArray(input)) {
    return [input]
  }

  return input
}