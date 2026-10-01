'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { useFormContext } from 'react-hook-form';
import ImageUploadSection from './ProfileImage';

interface ICities {
    label: string;
    value: string;
}

const BasicInformation = () => {
    const {
        register,
        formState: { errors },
        setValue,
        watch
    } = useFormContext();
    const [openGeographyDropdown, setOpenGeographyDropdown] = useState(false)
    const [openFocusDropdown, setOpenFocusDropdown] = useState(false)
    const geographyWatch = watch('Geography');
    const focusWatch = watch('Focus');
    const selectedCountry = watch('Country');
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${apiEndpoint}/MyProfile/GetCountryList`, {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                });
                if (res.status === 200) {
                    const locations = res.data.Result;
                    setLocations(
                        locations.map((location) => ({
                            label: location?.CountryName,
                            value: (location?.Id).toString(),
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching country list:', error);
            }
        })();
    }, []);

    const continentsOptions = [
        { label: "Global", value: "Global" },
        { label: "Africa", value: "Africa" },
        { label: "Antarctica", value: "Antarctica" },
        { label: "Asia", value: "Asia" },
        { label: "Europe", value: "Europe" },
        { label: "North America", value: "North America" },
        { label: "South America", value: "South America" },
        { label: "Australia", value: "Australia" },
    ];

    const focusOptions = [
        { label: "African Affairs", value: "African Affairs" },
        { label: "African Languages, Literatures, and Linguistics", value: "African Languages, Literatures, and Linguistics" },
        { label: "Anthropology", value: "Anthropology" },
        { label: "Applied Mathematics", value: "Applied Mathematics" },
        { label: "Arabic Literature", value: "Arabic Literature" },
        { label: "Artificial Intelligence", value: "Artificial Intelligence" },
        { label: "Art History", value: "Art History" },
        { label: "Astronomy and Astrophysics", value: "Astronomy and Astrophysics" },
        { label: "Astrophysics", value: "Astrophysics" },
        { label: "Behavioral Sciences", value: "Behavioral Sciences" },
        { label: "Biochemistry", value: "Biochemistry" },
        { label: "Bioinformatics", value: "Bioinformatics" },
        { label: "Biology", value: "Biology" },
        { label: "Biomedical/Medical Engineering", value: "Biomedical/Medical Engineering" },
        { label: "Black Communities and Cultures", value: "Black Communities and Cultures" },
        { label: "Business Administration", value: "Business Administration" },
        { label: "Caribbean Cultures and Societies", value: "Caribbean Cultures and Societies" },
        { label: "Cell/Cellular and Molecular Biology", value: "Cell/Cellular and Molecular Biology" },
        { label: "Central/Middle and Eastern Europe", value: "Central/Middle and Eastern Europe" },
        { label: "Chemical Physics", value: "Chemical Physics" },
        { label: "Chemistry", value: "Chemistry" },
        { label: "Chinese Language and Literature", value: "Chinese Language and Literature" },
        { label: "Classics", value: "Classics" },
        { label: "Climate Science", value: "Climate Science" },
        { label: "Cognitive Psychology and Psycholinguistics", value: "Cognitive Psychology and Psycholinguistics" },
        { label: "Comparative Literature", value: "Comparative Literature" },
        { label: "Computational Biology", value: "Computational Biology" },
        { label: "Computational Linguistics", value: "Computational Linguistics" },
        { label: "Computer Science", value: "Computer Science" },
        { label: "Conflict and Peacebuilding", value: "Conflict and Peacebuilding" },
        { label: "Corporate Strategy", value: "Corporate Strategy" },
        { label: "Criminology", value: "Criminology" },
        { label: "Cryptography", value: "Cryptography" },
        { label: "Cultures and Development", value: "Cultures and Development" },
        { label: "Curriculum and Instruction", value: "Curriculum and Instruction" },
        { label: "Data Analytics", value: "Data Analytics" },
        { label: "Data Science", value: "Data Science" },
        { label: "Demography", value: "Demography" },
        { label: "Design Thinking", value: "Design Thinking" },
        { label: "Development and Global Change", value: "Development and Global Change" },
        { label: "Developmental Biology and Embryology", value: "Developmental Biology and Embryology" },
        { label: "Digital Humanities", value: "Digital Humanities" },
        { label: "East Asian Culture", value: "East Asian Culture" },
        { label: "Econometrics and Quantitative Economics", value: "Econometrics and Quantitative Economics" },
        { label: "Economics", value: "Economics" },
        { label: "Education", value: "Education" },
        { label: "Education Leadership", value: "Education Leadership" },
        { label: "Electrical, Electronics and Communications Engineering", value: "Electrical, Electronics and Communications Engineering" },
        { label: "Engineering Science", value: "Engineering Science" },
        { label: "English Language and Literature", value: "English Language and Literature" },
        { label: "Environmental Engineering", value: "Environmental Engineering" },
        { label: "Environmental Studies", value: "Environmental Studies" },
        { label: "Epidemiology", value: "Epidemiology" },
        { label: "European History", value: "European History" },
        { label: "Evolutionary Biology", value: "Evolutionary Biology" },
        { label: "Experimental Psychology", value: "Experimental Psychology" },
        { label: "Film", value: "Film" },
        { label: "Finance", value: "Finance" },
        { label: "Fine/Studio Arts", value: "Fine/Studio Arts" },
        { label: "Gender and Sexuality", value: "Gender and Sexuality" },
        { label: "Genetics and Genomics", value: "Genetics and Genomics" },
        { label: "Geology/Earth Science", value: "Geology/Earth Science" },
        { label: "Global Health Systems", value: "Global Health Systems" },
        { label: "Health Policy and Management", value: "Health Policy and Management" },
        { label: "Healthcare Innovation", value: "Healthcare Innovation" },
        { label: "History", value: "History" },
        { label: "History and Philosophy of Science and Technology", value: "History and Philosophy of Science and Technology" },
        { label: "Human-Computer Interaction", value: "Human-Computer Interaction" },
        { label: "Indigenous Communities and Cultures", value: "Indigenous Communities and Cultures" },
        { label: "Information Science", value: "Information Science" },
        { label: "International Affairs", value: "International Affairs" },
        { label: "International Public Health", value: "International Public Health" },
        { label: "Japanese Language and Culture", value: "Japanese Language and Culture" },
        { label: "Jewish Culture and Religion", value: "Jewish Culture and Religion" },
        { label: "Korean Language and Culture", value: "Korean Language and Culture" },
        { label: "Latin American Culture and Society", value: "Latin American Culture and Society" },
        { label: "Law", value: "Law" },
        { label: "Law and Politics", value: "Law and Politics" },
        { label: "Library and Information Science", value: "Library and Information Science" },
        { label: "Linguistics", value: "Linguistics" },
        { label: "Marketing", value: "Marketing" },
        { label: "Materials Science and Engineering", value: "Materials Science and Engineering" },
        { label: "Mathematics", value: "Mathematics" },
        { label: "Mechanical Engineering", value: "Mechanical Engineering" },
        { label: "Media and Communication", value: "Media and Communication" },
        { label: "Medical Humanities", value: "Medical Humanities" },
        { label: "Medicine", value: "Medicine" },
        { label: "Microbiological Sciences and Immunology", value: "Microbiological Sciences and Immunology" },
        { label: "Museum Curation and Heritage", value: "Museum Curation and Heritage" },
        { label: "Music", value: "Music" },
        { label: "Natural Sciences", value: "Natural Sciences" },
        { label: "Near and Middle Eastern Languages and Cultures", value: "Near and Middle Eastern Languages and Cultures" },
        { label: "Neurobiology and Neurophysiology", value: "Neurobiology and Neurophysiology" },
        { label: "Nuclear Engineering", value: "Nuclear Engineering" },
        { label: "Nursing Science", value: "Nursing Science" },
        { label: "Oceanography", value: "Oceanography" },
        { label: "Operations Research", value: "Operations Research" },
        { label: "Organizational Behavior", value: "Organizational Behavior" },
        { label: "Philosophy", value: "Philosophy" },
        { label: "Pharmacology", value: "Pharmacology" },
        { label: "Physics", value: "Physics" },
        { label: "Planetary Astronomy and Science", value: "Planetary Astronomy and Science" },
        { label: "Political Science and Government", value: "Political Science and Government" },
        { label: "Product Design", value: "Product Design" },
        { label: "Psychology", value: "Psychology" },
        { label: "Public Administration", value: "Public Administration" },
        { label: "Public Health", value: "Public Health" },
        { label: "Public Policy", value: "Public Policy" },
        { label: "Queer Theory and Culture", value: "Queer Theory and Culture" },
        { label: "Real Estate", value: "Real Estate" },
        { label: "Religion", value: "Religion" },
        { label: "Robotics", value: "Robotics" },
        { label: "Romance Languages, Literatures, and Linguistics", value: "Romance Languages, Literatures, and Linguistics" },
        { label: "Russian Language and Culture", value: "Russian Language and Culture" },
        { label: "Social Innovation", value: "Social Innovation" },
        { label: "Sociology", value: "Sociology" },
        { label: "South Asian Languages and Cultures", value: "South Asian Languages and Cultures" },
        { label: "Southeast Asian Languages and Cultures", value: "Southeast Asian Languages and Cultures" },
        { label: "Statistics", value: "Statistics" },
        { label: "Systems Biology", value: "Systems Biology" },
        { label: "Technology Policy", value: "Technology Policy" },
        { label: "Theatre Arts", value: "Theatre Arts" },
        { label: "Theology", value: "Theology" },
        { label: "Theoretical Computer Science", value: "Theoretical Computer Science" },
        { label: "Urban Economics", value: "Urban Economics" },
        { label: "Urban Planning and Design", value: "Urban Planning and Design" },
        { label: "Visual and Performing Arts", value: "Visual and Performing Arts" },
        { label: "Women's History and Culture", value: "Women's History and Culture" },
        { label: "Other", value: "Other" },
    ];


    const [cities, setCities] = useState<Array<ICities>>();
    const [stateList, setStateList] = useState<Array<ICities>>();
    const handleGetStatesOfCountry = async (Country: string) => {
        try {
            if (!Country) return;
            const res = await axios.post(
                `${apiEndpoint}/Profile/GetCityStateList`,
                {
                    CountryId: Country,
                },
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );
            if (res.status === 200) {
                const statesList = res.data.Result;
                const formattedStateList = statesList?.StateData.map((item) => ({
                    value: item.Id.toString(),
                    label: item.StateName,
                }));
                setStateList(formattedStateList);
                const formattedCityList = res.data.Result?.CityData?.map((item) => ({
                    value: item.Id.toString(),
                    label: item.CityName,
                }));
                setCities(formattedCityList);
            }
        } catch (error) {
            console.error('Error fetching country list:', error);
        }
    }

    useEffect(() => {
        handleGetStatesOfCountry(selectedCountry);
    }, [selectedCountry])

    return (
        <div className='flex flex-col md:flex-row w-[95%] mx-auto justify-between gap-6'>
            <div className="w-full md:w-[20%] flex justify-center">
                <ImageUploadSection onImageSelect={(file) => { }} />
            </div>
            <div className="w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-6 mt-[6%]">
                <div className={`w-full grid grid-cols-1 md:grid-cols-3  gap-6 md:col-span-2`}>
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">First Name*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter first name"
                            {...register('FirstName')}
                        />
                        {typeof errors.FirstName?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.FirstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Last Name*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter last name"
                            {...register('LastName')}
                        />
                        {typeof errors.LastName?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.LastName.message}</p>
                        )}
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Website*</label>
                        <div className="flex items-center border border-gray-300 rounded-lg shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                            <span className="px-3 py-2 text-[16px] text-black-500 bg-gray-100 border-r border-gray-300 select-none">
                                https://
                            </span>
                            <input
                                type="text"
                                placeholder="www.example.com"
                                className="flex-1 px-4 py-3 text-[16px] font-normal text-black-500 focus:outline-none"
                                {...register('Website')}
                            />
                        </div>
                        {typeof errors.Website?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Website.message}</p>
                        )}
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 gap-6 md:col-span-2">
                    {/* Company Tagline */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Tagline/Position*</label>
                        <input
                            type="text"
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="A brief bio"
                            {...register('Tagline')}
                        />
                        {typeof errors.Tagline?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Tagline.message}</p>
                        )}
                    </div>
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2'>
                    {/* Country */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            Country
                        </label>

                        <div className="relative">
                            {/* Styled native select */}
                            <select
                                value={watch('Country') ?? ''}
                                onChange={(e) => setValue('Country', e.target.value)}
                                {...register('Country')}
                                className="w-full px-4 py-3 text-[16px] border border-gray-300 text-black-500 rounded-lg shadow-md focus:outline-none"
                            >
                                <option className='text-gray-500' value="" disabled>
                                    Select country
                                </option>
                                {locations.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {typeof errors.Country?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.Country.message}
                            </p>
                        )}
                    </div>

                    {/* State/Province */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            State/Province
                        </label>
                        <div className="relative">
                            {stateList ? (
                                <select {...register('State')} className="w-full px-4 py-3 text-[16px] border border-gray-300 text-black-500 rounded-lg shadow-md focus:outline-none" >
                                    {stateList && stateList?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <select className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none" >
                                    <option>
                                        Enter state/province
                                    </option>
                                    <option>
                                        Select Country first
                                    </option>
                                </select>
                            )}
                        </div>

                        {typeof errors.State?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.State.message}
                            </p>
                        )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">
                            City
                        </label>
                        <div className="relative">
                            {cities ? (
                                <select {...register('City')} className="w-full px-4 py-3 text-[16px] border border-gray-300 text-black-500 rounded-lg shadow-md focus:outline-none" >
                                    {cities && cities?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <select className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none" >
                                    <option>
                                        Enter Your City
                                    </option>
                                    <option>
                                        Select Country first
                                    </option>
                                </select>
                            )}
                        </div>

                        {typeof errors.City?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">
                                {errors.City.message}
                            </p>
                        )}
                    </div>

                </div>

                {/* Grouped Section */}
                <div className="w-full grid grid-cols-1 md:grid-cols-4 md:col-span-2 gap-6">

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Years of Experience*</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter years of experience"
                            {...register('YearsOfExperience', { valueAsNumber: true })}
                        />
                        {typeof errors.YearsOfExperience?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.YearsOfExperience.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Publications*</label>
                        <input
                            type="number"
                            min={0}
                            className="w-full text-[16px] font-normal text-black-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter # of publications"
                            {...register('Publications', { valueAsNumber: true })}
                        />
                        {typeof errors.Publications?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Publications.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Focus*</label>
                        <div onClick={() => { setOpenFocusDropdown(!openFocusDropdown) }} className={`w-full flex justify-between items-center text-[16px] font-normal ${(focusWatch == "" || focusWatch == null) ? "text-gray-500" : "text-black-500"}  px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                            <p>
                                {(focusWatch == "" || focusWatch == null) ? "Select focus" : focusWatch}
                            </p>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform duration-200 ${openFocusDropdown ? 'rotate-180' : ''
                                }`}>
                                <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z" fill="#667085" />
                            </svg>
                        </div>

                        <div className='w-full flex justify-end'>
                            {/* Dropdown options */}
                            {(openFocusDropdown && focusOptions.length > 0) && (
                                <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                    {focusOptions.map((rate) => (
                                        <div
                                            key={rate.value}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                            onClick={() => {
                                                setValue('Focus', rate.value);
                                                setOpenFocusDropdown(false);
                                            }}
                                        >
                                            {rate.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {typeof errors.Focus?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Focus.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[16px] font-semibold text-black-500">Geography*</label>
                        <div onClick={() => { setOpenGeographyDropdown(!openGeographyDropdown) }} className={`w-full flex justify-between items-center text-[16px] font-normal ${(geographyWatch == "" || geographyWatch == null) ? "text-gray-500" : "text-black-500"}  px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                            <p>
                                {(geographyWatch == "" || geographyWatch == null) ? "Select geography" : geographyWatch}
                            </p>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform duration-200 ${openGeographyDropdown ? 'rotate-180' : ''
                                }`}>
                                <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z" fill="#667085" />
                            </svg>
                        </div>

                        <div className='w-full flex justify-end'>
                            {/* Dropdown options */}
                            {(openGeographyDropdown && continentsOptions.length > 0) && (
                                <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                    {continentsOptions.map((rate) => (
                                        <div
                                            key={rate.value}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                            onClick={() => {
                                                setValue('Geography', rate.value);
                                                setOpenGeographyDropdown(false);
                                            }}
                                        >
                                            {rate.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {typeof errors.Geography?.message === 'string' && (
                            <p className="mt-1 text-[16px] text-red-600">{errors.Geography.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default BasicInformation;
