export const getDistinctRandomIntegers = (
  min: number,
  max: number,
  numberOfIntegers: number
) => {
  const randomIntegers = new Set<number>()
  while (randomIntegers.size < numberOfIntegers) {
    const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min
    randomIntegers.add(randomInteger)
  }
  return Array.from(randomIntegers)
}
