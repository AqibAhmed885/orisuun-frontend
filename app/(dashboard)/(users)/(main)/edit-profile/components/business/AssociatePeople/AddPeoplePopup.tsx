'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { generateUploadFileSasTokenData } from '../BasicInformation/ProfileImage';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface TeamMemberErrors {
    profile?: string;
    name?: string;
    position?: string;
    email?: string;
    username?: string;
    password?: string;
    about?: string;
}

interface Props {
    onClose: () => void;
}

const TeamMemberPopup: React.FC<Props> = ({ onClose }) => {
    const { setValue, getValues } = useFormContext();

    const [profilePicture, setProfilePicture] = useState<string>('');
    const [preview, setPreview] = useState<string>('');
    const [sasToken, setSasToken] = useState<string>('');
    const [errors, setErrors] = useState<TeamMemberErrors>({});

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        email: '',
        username: '',
        password: '',
        about: '',
    });

    useEffect(() => {
        const fetchSasToken = async () => {
            const token = await generateUploadFileSasTokenData();
            setSasToken(token.token);
        };
        fetchSasToken();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit');
            return;
        }

        if (!file.type.match('image.*')) {
            alert('Please select a valid image file');
            return;
        }

        if (!sasToken) {
            alert('Upload token not ready. Please try again shortly.');
            return;
        }

        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${uniqueFileName}?${sasToken}`;

        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
        };

        try {
            const res = await axios.put(blobUrl, file, config);
            if (res.status === 201) {
                const imageUrl = blobUrl.split('?')[0];
                setProfilePicture(imageUrl);
                setPreview(imageUrl);
            }
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Failed to upload image. Please try again.');
        }
    };

    const validate = () => {
        const newErrors: TeamMemberErrors = {};

        if (!profilePicture) {
            newErrors.profile = 'Profile image is required';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
            newErrors.name = 'Name should contain only letters and spaces';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.position.trim())) {
            newErrors.position = 'Position should contain only letters and spaces';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters long';
        } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, underscores, and periods';
        }

        if (formData.password.length > 0) {
            if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one uppercase letter';
            } else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one lowercase letter';
            } else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one number';
            } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one special character';
            }
        }

        const wordCount = formData.about.trim().replace(/\s+/g, ' ').split(' ').length;
        if (!formData.about.trim()) {
            newErrors.about = 'About is required';
        } else if (wordCount > 30) {
            newErrors.about = 'About can be of 30 words max';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!validate()) return;

        const newMember = {
            Name: formData.name,
            ProfilePicture: profilePicture,
            Position: formData.position,
            About: formData.about,
            Email: formData.email,
            Username: formData.username,
            Password: formData.password,
        };

        const current = getValues('TeamMembers') || [];
        setValue('TeamMembers', [...current, newMember]);

        // Reset fields
        setFormData({
            name: '',
            position: '',
            email: '',
            username: '',
            password: '',
            about: '',
        });
        setProfilePicture('');
        setPreview('');
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
                <div className='flex justify-between'>
                    <h2 className='text-[18px] text-gray-800 font-semibold'>Add Associated People</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-y-1 mb-6 text-center w-[115px]">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] border-white bg-[#E4E7EC] shadow-md flex items-center justify-center overflow-hidden">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
                                    <path d="M41.6667 10.0003H26C20.3995 10.0003 17.5992 10.0003 15.4601 11.0903C13.5785 12.049 12.0487 13.5788 11.0899 15.4604C10 17.5995 10 20.3998 10 26.0003V54.0003C10 59.6008 10 62.4011 11.0899 64.5402C12.0487 66.4218 13.5785 67.9516 15.4601 68.9104C17.5992 70.0003 20.3995 70.0003 26 70.0003H56.6667C59.7666 70.0003 61.3165 70.0003 62.5882 69.6596C66.0391 68.7349 68.7346 66.0394 69.6593 62.5885C70 61.3168 70 59.7669 70 56.667M63.3333 26.667V6.66699M53.3333 16.667H73.3333" stroke="#475467" strokeWidth="6.66667" />
                                </svg>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="text-[12px] mt-3 text-gray-800 font-bold">Upload Photo</p>
                    <p className="text-[12px] text-gray-500">Max upload size is 5MB</p>
                    {errors.profile && <p className="text-sm text-red-500 mt-1">{errors.profile}</p>}
                </div>

                {['name', 'about', 'position', 'email', 'username', 'password'].map((field) => (
                    <div key={field} className='mt-3'>
                        <label className="text-[14px] font-semibold text-gray-700">
                            {`${['name', 'about', 'position', 'email'].includes(field) ? 'Associated Team Member’s ' : ''}${field.charAt(0).toUpperCase() + field.slice(1)}${field !== 'password' ? '*' : ''}`}
                        </label>
                        <input
                            type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            placeholder={`Enter associated team’s ${field}`}
                            className="text-[16px] mt-1 w-full px-4 py-2 border rounded-md text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                    </div>
                ))}

                <div className="grid grid-cols-2 gap-4 justify-between mt-6">
                    <button
                        type="button"
                        className="text-[14px] font-semibold px-6 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-[14px] font-semibold px-6 py-2 bg-[#2357C6] text-white rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamMemberPopup;
