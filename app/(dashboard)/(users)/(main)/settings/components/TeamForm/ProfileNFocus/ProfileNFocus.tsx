import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const ProfileNFocus = ({ availableProfileTypes }) => {
    const { setValue, watch, register, formState: { errors } } = useFormContext();
    const focusWatch = watch('FocusArea');
    const profileType1Watch = watch('ProfileType1')
    const profileType2Watch = watch('ProfileType2')
    const profileType3Watch = watch('ProfileType3')
    const [openFocusDropdown, setOpenFocusDropdown] = useState(false)
    const [selectedFocusArea, setSelectedFocusArea] = useState<string[]>([]);
    const [selectedProfileTypes, setSelectedProfileTypes] = useState([])

    useEffect(() => {
        if (!selectedFocusArea.length && focusWatch) {
            setSelectedFocusArea(focusWatch.split('|'));
        }
    }, [focusWatch]);

    useEffect(() => {
        if (!selectedProfileTypes.length) {
            setSelectedProfileTypes(
                [profileType1Watch, profileType2Watch, profileType3Watch].filter(Boolean)
            );
        }
    }, [profileType1Watch, profileType2Watch, profileType3Watch])

    function handleAddFocusArea(value: string) {
        if (!selectedFocusArea.includes(value)) {
            setSelectedFocusArea((prev) => [...prev, value]);
        }
    }

    function handleRemoveFocusArea(value: string) {
        setSelectedFocusArea((prev) => prev.filter((style) => style !== value));
    }

    useEffect(() => {
        const formattedStyles = selectedFocusArea.join('|');
        setValue('FocusArea', formattedStyles);
    }, [selectedFocusArea, setValue]);

    function handleClickProfileType(value: number) {
        if (selectedProfileTypes.includes(value)) {
            setSelectedProfileTypes(selectedProfileTypes.filter((i) => i !== value));
        } else if (selectedProfileTypes.length < 3) {
            setSelectedProfileTypes([...selectedProfileTypes, value]);
        }
    }

    useEffect(() => {
        selectedProfileTypes.forEach((val, idx) => {
            if (val > 0) {
                setValue(`ProfileType${idx + 1}` as 'ProfileType1' | 'ProfileType2' | 'ProfileType3', val);
            }
        });
    }, [selectedProfileTypes]);


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

    return (
        <div className='w-[95%] mx-auto bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md pt-2 md:pt-4 mt-5'>
            <h2 className='w-[95%] mx-auto text-[16px] font-semibold my-2 md:my-4 '>Focus</h2>
            <div className=" grid grid-cols-1 md:grid-cols-2 w-[95%] gap-2 md:gap-4 mx-auto h-auto bg-white md:pb-4">
                <div>
                    <h2 className='text-[16px] font-semibold text-gray-700'>Focus area</h2>
                    <div onClick={() => { setOpenFocusDropdown(!openFocusDropdown) }} className={`w-full flex justify-between items-center text-[16px] font-normal text-gray-700 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                        <p>
                            Select all focus areas
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
                                            handleAddFocusArea(rate.value);
                                            setOpenFocusDropdown(false);
                                        }}
                                    >
                                        {rate.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {typeof errors.FocusArea?.message === 'string' && (
                        <p className="mt-1 text-[16px] text-red-600">{errors.FocusArea.message}</p>
                    )}

                    <div className="flex flex-wrap mt-2 md:mt-3 gap-1 md:gap-2">
                        {selectedFocusArea.map((val, index) => (
                            <span
                                key={index}
                                className="flex items-center text-lg gap-x-1 bg-[#EFF8FF] text-[#194185] px-2 rounded-md border border-[#B2DDFF]"
                            >
                                {val}
                                <button
                                    type="button"
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => handleRemoveFocusArea(val)}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className='text-[16px] font-semibold text-gray-700'>Team Profile Type</h2>
                    <div className={`w-full flex gap-2 flex-wrap md:gap-3 items-center text-[16px] font-normal`}>
                        {availableProfileTypes && availableProfileTypes.map((type) => (
                            <div key={type.value} onClick={() => { handleClickProfileType(type.value) }} className={`px-4 py-3 border cursor-pointer ${(selectedProfileTypes.length >= 3 && !selectedProfileTypes.includes(type.value)) ? "border-gray-300 text-gray-500" : selectedProfileTypes.includes(type.value) ? "border-[#B2DDFF] bg-[#EFF8FF] text-[#194185]" : "border-gray-300 text-gray-900"}  rounded-lg shadow-md`}>
                                {type.label}
                            </div>
                        ))}
                    </div>
                    {typeof errors.ProfileType1?.message === 'string' && (
                        <p className="mt-1 text-[16px] text-red-600">{errors.ProfileType1.message}</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProfileNFocus;
