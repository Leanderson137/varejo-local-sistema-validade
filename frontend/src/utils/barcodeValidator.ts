const VALID_BARCODE_LENGTHS = [8, 12, 13, 14]

const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, '')
}

const hasOnlySameDigits = (value: string): boolean => {
  return /^(\d)\1+$/.test(value)
}

const calculateGtinCheckDigit = (digitsWithoutCheckDigit: string): number => {
  let sum = 0
  let multiplier = 3

  for (let index = digitsWithoutCheckDigit.length - 1; index >= 0; index -= 1) {
    sum += Number(digitsWithoutCheckDigit[index]) * multiplier
    multiplier = multiplier === 3 ? 1 : 3
  }

  const nextMultipleOfTen = Math.ceil(sum / 10) * 10

  return nextMultipleOfTen - sum
}

export const normalizeBarcode = (barcode: string): string => {
  return onlyNumbers(barcode)
}

export const isValidBarcode = (barcode: string): boolean => {
  const normalizedBarcode = normalizeBarcode(barcode)

  if (!VALID_BARCODE_LENGTHS.includes(normalizedBarcode.length)) {
    return false
  }

  if (hasOnlySameDigits(normalizedBarcode)) {
    return false
  }

  const digitsWithoutCheckDigit = normalizedBarcode.slice(0, -1)
  const informedCheckDigit = Number(normalizedBarcode.slice(-1))
  const calculatedCheckDigit = calculateGtinCheckDigit(digitsWithoutCheckDigit)

  return informedCheckDigit === calculatedCheckDigit
}