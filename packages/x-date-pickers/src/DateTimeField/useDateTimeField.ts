import { dateTimePickerValueManager } from '../DateTimePicker/shared';
import { useField, FieldValueManager, FieldSection } from '../internals/hooks/useField';
import {
  UseDateTimeFieldProps,
  UseDateTimeFieldDefaultizedProps,
  UseDateTimeFieldParams,
} from './DateTimeField.types';
import {
  DateTimeValidationError,
  isSameDateTimeError,
  validateDateTime,
} from '../internals/hooks/validation/useDateTimeValidation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';
import { dateFieldValueManager } from '../DateField/useDateField';

const dateTimeFieldValueManager: FieldValueManager<
  any,
  any,
  FieldSection,
  DateTimeValidationError
> = {
  ...dateFieldValueManager,
  hasError: (error) => error != null,
  isSameError: isSameDateTimeError,
};

const useDefaultizedDateTimeField = <TDate, AdditionalProps extends {}>(
  props: UseDateTimeFieldProps<TDate>,
): AdditionalProps & UseDateTimeFieldDefaultizedProps<TDate> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm
    ? utils.formats.keyboardDateTime12h
    : utils.formats.keyboardDateTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
    disableIgnoringDatePartForTimeValidation: Boolean(props.minDateTime || props.maxDateTime),
    minDate: applyDefaultDate(utils, props.minDateTime ?? props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
    minTime: props.minDateTime ?? props.minTime,
    maxTime: props.maxDateTime ?? props.maxTime,
  } as any;
};

export const useDateTimeField = <TDate, TChildProps extends {}>({
  props,
  inputRef,
}: UseDateTimeFieldParams<TDate, TChildProps>) => {
  const {
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    minTime,
    maxTime,
    minDateTime,
    maxDateTime,
    minutesStep,
    disableIgnoringDatePartForTimeValidation,
    shouldDisableTime,
    selectedSections,
    onSelectedSectionsChange,
    ampm,
    ...other
  } = useDefaultizedDateTimeField<TDate, TChildProps>(props);

  return useField({
    inputRef,
    forwardedProps: other,
    internalProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      onError,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      minTime,
      maxTime,
      minutesStep,
      shouldDisableTime,
      disableIgnoringDatePartForTimeValidation,
      selectedSections,
      onSelectedSectionsChange,
      inputRef,
      ampm,
    },
    valueManager: dateTimePickerValueManager,
    fieldValueManager: dateTimeFieldValueManager,
    validator: validateDateTime,
    supportedDateSections: ['year', 'month', 'day', 'hour', 'minute', 'second', 'meridiem'],
  });
};
