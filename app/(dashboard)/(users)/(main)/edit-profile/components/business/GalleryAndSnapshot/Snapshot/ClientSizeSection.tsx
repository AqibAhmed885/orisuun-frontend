'use client';
import React from 'react';
import PercentInput from './PercentInput';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface ClientSizeItem {
  label: string;
  percent: number;
}

interface Props {
  name: string;
}

const ClientSizeSection = ({ name }: Props) => {
  const { control, watch, trigger, formState: { errors } } = useFormContext();
  const { fields, update } = useFieldArray({
    control,
    name,
  });

  const fieldValues = watch(name) as ClientSizeItem[];

  return (
    <div className="mb-6">
      <h3 className="text-[14px] font-semibold text-gray-700 mb-2">Client by Size</h3>
      {fields.map((field, idx) => (
        <div key={idx} className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-2">
            <input
              value={fieldValues?.[idx]?.label || ''}
              disabled
              className="shadow-md flex-1 border border-gray-300 rounded-lg px-3 py-2 text-[16px] bg-gray-100"
            />
            <PercentInput
              value={fieldValues?.[idx]?.percent || 0}
              onChange={async (val) => {
                update(idx, {
                  ...field,
                  percent: val,
                });
                await trigger(name);
              }}
            />
          </div>
          {(errors?.[name] as any)?.[idx]?.percent?.message && (
            <p className="text-red-600 text-sm">
              {(errors?.[name] as any)?.[idx]?.percent?.message}
            </p>
          )}
        </div>
      ))}
      {(errors as any)?.[name]?.message && (
        <p className="text-red-600 text-sm mt-1">{(errors as any)[name].message}</p>
      )}
    </div>
  );
};

export default ClientSizeSection;
