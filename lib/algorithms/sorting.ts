export function quickSort<T>(
  arr: T[],
  key?: (item: T) => number
): T[] {
  if (arr.length <= 1) return arr;

  const getKey = key ?? ((x: T) => x as unknown as number);
  const pivot = arr[Math.floor(arr.length / 2)];
  const pivotVal = getKey(pivot);

  const left: T[] = [];
  const middle: T[] = [];
  const right: T[] = [];

  for (const item of arr) {
    const val = getKey(item);
    if (val < pivotVal) left.push(item);
    else if (val > pivotVal) right.push(item);
    else middle.push(item);
  }

  return [...quickSort(left, key), ...middle, ...quickSort(right, key)];
}

export function quickSortSteps<T>(
  arr: T[],
  key?: (item: T) => number
): { sorted: T[]; steps: T[][] } {
  const getKey = key ?? ((x: T) => x as unknown as number);
  const steps: T[][] = [arr];

  function sort(a: T[]): T[] {
    if (a.length <= 1) return a;
    const pivot = a[Math.floor(a.length / 2)];
    const pivotVal = getKey(pivot);
    const left: T[] = [];
    const middle: T[] = [];
    const right: T[] = [];

    for (const item of a) {
      const val = getKey(item);
      if (val < pivotVal) left.push(item);
      else if (val > pivotVal) right.push(item);
      else middle.push(item);
    }

    const result = [...sort(left), ...middle, ...sort(right)];
    steps.push(result);
    return result;
  }

  const sorted = sort(arr);
  return { sorted, steps };
}

export function mergeSort<T>(
  arr: T[],
  key?: (item: T) => number
): T[] {
  if (arr.length <= 1) return arr;

  const getKey = key ?? ((x: T) => x as unknown as number);
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), key);
  const right = mergeSort(arr.slice(mid), key);

  const result: T[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (getKey(left[i]) <= getKey(right[j])) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}
