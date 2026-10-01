import React from 'react';
import {
  useController,
  Control,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import Input from './input';

interface CustomTimeRangePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  nameFrom: string;
  nameTo: string;
  control: Control<TFieldValues>;
  label: string;
}

const CustomTimeRangePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  nameFrom,
  nameTo,
  control,
  label,
}: CustomTimeRangePickerProps<any>) => {
  const {
    field: { onChange: onChangeFrom, onBlur: onBlurFrom, value: valueFrom, ref: refFrom },
    fieldState: { error: errorFrom },
  } = useController({
    name: nameFrom,
    control,
    rules: { required: 'Start time is required' },
    defaultValue: '' as any,
  });

  const {
    field: { onChange: onChangeTo, onBlur: onBlurTo, value: valueTo, ref: refTo },
    fieldState: { error: errorTo },
  } = useController({
    name: nameTo,
    control,
    rules: { required: 'End time is required' },
    defaultValue: '' as any,
  });

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const inputTime = e.target.value;
    if (inputTime) {
      // Validate HH:mm format (00:00 - 23:59)
      const isValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(inputTime);
      if (isValid) {
        onChange(inputTime);
      } else {
        console.error('Invalid time format');
      }
    } else {
      onChange('');
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-medium text-gray-700">{label}</label>
      <div className="flex space-x-4">
        <div>
          <Input
            type="time"
            name={nameFrom}
            ref={refFrom}
            value={valueFrom as string}
            onChange={(e) => handleTimeChange(e, onChangeFrom)}
            onBlur={onBlurFrom}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omblue-600 focus:ring-0"
          />
          {errorFrom && <p className="mt-1 text-sm text-red-600">{errorFrom.message}</p>}
        </div>
        <div>
          <Input
            type="time"
            name={nameTo}
            ref={refTo}
            value={valueTo as string}
            onChange={(e) => handleTimeChange(e, onChangeTo)}
            onBlur={onBlurTo}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-omblue-600 focus:ring-0"
          />
          {errorTo && <p className="mt-1 text-sm text-red-600">{errorTo.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CustomTimeRangePicker;
