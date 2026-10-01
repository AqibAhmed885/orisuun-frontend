'use client';
import React, { useEffect, useState } from 'react';

const EditProfileModal = ({ isOpen, onClose, profileData, onSave }) => {

    const [form, setForm] = useState({
        city: profileData?.CityName || '',
        country: profileData?.CountryName || '',
        tagline: profileData?.Tagline || '',
        blackPercentage: profileData?.BlackOwnershipPercentage || '',
        openToInvestment: profileData?.OpenToInvestment || false,
        openToMentorship: profileData?.OpenToMentorship || false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = () => {
        onSave(form);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 bg-black-200">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Edit Business Information</h2>

                <div className="grid gap-4">
                    <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="border rounded px-3 py-2 w-full"
                    />
                    <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="border rounded px-3 py-2 w-full"
                    />
                    <input
                        type="text"
                        name="tagline"
                        value={form.tagline}
                        onChange={handleChange}
                        placeholder="Slogan/Tagline"
                        className="border rounded px-3 py-2 w-full"
                    />
                    <input
                        type="number"
                        name="blackPercentage"
                        value={form.blackPercentage}
                        onChange={handleChange}
                        placeholder="Black Owned %"
                        className="border rounded px-3 py-2 w-full"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="openToInvestment"
                            checked={form.openToInvestment}
                            onChange={handleChange}
                        />
                        <label>Open to Investment</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="openToMentorship"
                            checked={form.openToMentorship}
                            onChange={handleChange}
                        />
                        <label>Open to Mentorship</label>
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
