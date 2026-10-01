import React, { forwardRef } from 'react';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import ReactDatePicker, {
  DatePickerProps as ReactDatePickerProps,
} from 'react-date-picker';

interface DatePickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | null) => void;
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      format = 'MM-dd-yyyy',
      minDate = new Date(1971, 0, 1),
      maxDate = new Date(2030, 11, 31),
      onChange,
      ...rest
    },
    ref
  ) => {
    const handleChange = (date: any) => {
      if (onChange) {
        onChange(Array.isArray(date) ? date[0] : date);
      }
    };

    return (
      <div className="" ref={ref}>
        <ReactDatePicker
          format={format}
          clearIcon={null}
          calendarIcon={null}
          locale="en-US"
          dayPlaceholder={new Date().getDate().toString()}
          yearPlaceholder={new Date().getFullYear().toString()}
          monthPlaceholder={
            new Date().getMonth() < 9
              ? '0' + (new Date().getMonth() + 1).toString()
              : (new Date().getMonth() + 1).toString()
          }
          minDate={minDate}
          maxDate={maxDate}
          onChange={handleChange}
          {...rest}
        />
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
