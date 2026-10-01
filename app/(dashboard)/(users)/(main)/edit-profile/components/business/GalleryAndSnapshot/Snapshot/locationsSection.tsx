'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/select';
import Add from '@/icons/add';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';

const LocationsSection = ({ name, currentUserData }: { name: string, currentUserData: any }) => {
    const { control, formState: { errors } } = useFormContext();
    const { fields, append } = useFieldArray({ control, name });
    useEffect(() => {
        if (fields.length === 0) {
            append({ cityId: '' });
        }
    }, [fields, append]);
    const [cityList, setCityList] = useState<{ value: string; label: string }[]>([]);

    // Fetch city list
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await axios.post(
                    `${apiEndpoint}/Profile/GetCityStateList`,
                    { CountryId: JSON.parse(currentUserData?.Country) || 1 },
                    {
                        headers: {
                            XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                        },
                    }
                );

                const formatted = res.data.Result?.CityData?.map((item) => ({
                    value: item.Id.toString(),
                    label: item.CityName,
                })) || [];

                setCityList(formatted);
            } catch (err) {
                console.error('Error fetching city list:', err);
            }
        };

        fetchCities();
    }, []);

    return (
        <div className="mb-6">
            <p className="text-[14px] font-semibold text-gray-800 mb-2">Locations</p>
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-3">
                    <div className="w-full">
                        <Controller
                            control={control}
                            name={`${name}.${index}.cityId`}
                            render={({ field: controllerField }) => (
                                <CustomSelect
                                    options={cityList}
                                    placeholder="Select city"
                                    value={cityList.find(option => option.label === controllerField.value) || null}
                                    onChange={(option) => controllerField.onChange(option?.label)}
                                    controlClasses="" // custom border color and text size
                                    className="text-[14px] border-gray-400 shadow-md" // wrapper div style
                                    error={errors?.Locations?.[index]?.cityId?.message}
                                />
                            )}
                        />
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={() => append({ cityId: '' })}
                className="text-[13px] text-primary-600 flex items-center gap-1 hover:underline mt-1"
            >
                <Add className="w-4 h-4" /> Add Location
            </button>
        </div>
    );
};

export default LocationsSection;
