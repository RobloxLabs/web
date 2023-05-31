import suffixes from './suffixes';
import suffixNames from './suffixNames';
import numberFormat from '../numberFormat/numberFormat';

const oneThousand = 1000;
const tenThousand = 10000;
const oneMillion = 1000000;
const oneBillion = 1000000000;
const oneTrillion = 1000000000000;

/*
 * Truncate number into without rounding, such as 567 => 567, 1,120 => 1,120 as default thredhold, 33,890,133 => 33M+
 */
const getTruncValue = (
  value: number,
  abbreviationThreshold?: number,
  suffixType?: suffixNames,
  digitAfterDecimalPlace?: number
): string => {
  const newValue = `${value}`;

  const thredshold = abbreviationThreshold || tenThousand;

  if (value < thredshold) {
    return numberFormat.getNumberFormat(value);
  }

  const suffix = suffixType ? suffixes[suffixType] : suffixes[suffixNames.withPlus];
  let append = suffix[suffix.length - 1];
  let numOfTrimmedChars = 12;
  const power = Math.floor(Math.log(value) / Math.log(oneThousand));
  append = suffix[power];

  if (value < oneMillion) {
    numOfTrimmedChars = 3;
  } else if (value < oneBillion) {
    numOfTrimmedChars = 6;
  } else if (value < oneTrillion) {
    numOfTrimmedChars = 9;
  }

  const beforeDecimalPlaceLength = newValue.length - numOfTrimmedChars;
  const afterDecimalPlace = !digitAfterDecimalPlace
    ? ''
    : `.${newValue.substring(beforeDecimalPlaceLength, digitAfterDecimalPlace)}`;
  return newValue.substring(0, beforeDecimalPlaceLength) + afterDecimalPlace + append;
};

/*
 * Abbreviate number into at most 4 digits, such as 567 => 567, 1,120 => 1.1K, 33,890,133 => 33.9M
 * when isFormatEnabledUnderThreshold is true, means we will do only number format for the input instead of abbreviation
 */
const getAbbreviatedValue = (
  value: number,
  suffixType?: suffixNames,
  abbreviationThreshold?: number,
  isFormatEnabledUnderThreshold?: boolean
): string => {
  let newValue = `${value}`;
  if (abbreviationThreshold && value < abbreviationThreshold) {
    return isFormatEnabledUnderThreshold ? numberFormat.getNumberFormat(value) : newValue;
  }
  const suffix = suffixType ? suffixes[suffixType] : suffixes[suffixNames.withoutPlus];
  const maxSuffixNum = Math.ceil(newValue.length / 3);
  const maxDecPlaces = Math.pow(oneThousand, maxSuffixNum);
  const maxShortValue = Math.round((value / maxDecPlaces) * 10) / 10;

  const minSuffixNum = maxSuffixNum - 1;
  const minDecPlaces = Math.pow(oneThousand, minSuffixNum);
  const minShortValue = Math.round((value / minDecPlaces) * 10) / 10;

  if (minShortValue >= oneThousand) {
    newValue = maxShortValue + suffix[maxSuffixNum];
  } else {
    newValue = minShortValue + suffix[minSuffixNum];
  }
  return newValue;
};

export default {
  getAbbreviatedValue,
  suffixNames,
  getTruncValue
};
