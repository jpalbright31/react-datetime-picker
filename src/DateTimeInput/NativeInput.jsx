import React from 'react';
import PropTypes from 'prop-types';

import {
  getHours,
  getHoursMinutes,
  getISOLocalDate,
  getISOLocalDateTime,
} from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';

export default function NativeInput({
  disabled,
  maxDate,
  minDate,
  name,
  nativeInputAriaLabel,
  onChange,
  required,
  value,
  valueType,
}) {
  const nativeValueParser = (() => {
    switch (valueType) {
      case 'hour':
        return receivedValue => `${getISOLocalDate(receivedValue)}T${getHours(receivedValue)}:00`;
      case 'minute':
        return receivedValue => `${getISOLocalDate(receivedValue)}T${getHoursMinutes(receivedValue)}`;
      case 'second':
        return getISOLocalDateTime;
      default:
        throw new Error('Invalid valueType.');
    }
  })();

  const step = (() => {
    switch (valueType) {
      case 'hour':
        return 3600;
      case 'minute':
        return 60;
      case 'second':
        return 1;
      default:
        throw new Error('Invalid valueType.');
    }
  })();

  function stopPropagation(event) {
    event.stopPropagation();
  }

  return (
    <input
      type="datetime-local"
      aria-label={nativeInputAriaLabel}
      disabled={disabled}
      max={maxDate ? nativeValueParser(maxDate) : null}
      min={minDate ? nativeValueParser(minDate) : null}
      name={name}
      onChange={onChange}
      onFocus={stopPropagation}
      required={required}
      step={step}
      style={{
        visibility: 'hidden',
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
      }}
      value={value ? nativeValueParser(value) : ''}
    />
  );
}

NativeInput.propTypes = {
  disabled: PropTypes.bool,
  maxDate: isMaxDate,
  minDate: isMinDate,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  valueType: isValueType,
};
