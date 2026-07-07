export function binarySearch<T>(
  sortedArr: T[],
  target: number,
  key?: (item: T) => number
): { found: boolean; index: number; steps: number } {
  const getKey = key ?? ((x: T) => x as unknown as number);
  let left = 0;
  let right = sortedArr.length - 1;
  let steps = 0;

  while (left <= right) {
    steps++;
    const mid = Math.floor((left + right) / 2);
    const midVal = getKey(sortedArr[mid]);

    if (midVal === target) {
      return { found: true, index: mid, steps };
    } else if (midVal < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return { found: false, index: -1, steps };
}

export function linearSearch<T>(
  arr: T[],
  target: number,
  key?: (item: T) => number
): { found: boolean; index: number; steps: number } {
  const getKey = key ?? ((x: T) => x as unknown as number);
  for (let i = 0; i < arr.length; i++) {
    if (getKey(arr[i]) === target) {
      return { found: true, index: i, steps: i + 1 };
    }
  }
  return { found: false, index: -1, steps: arr.length };
}
