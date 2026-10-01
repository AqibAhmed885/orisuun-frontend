import React, { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import Button from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';

type optionTypes = {
    name: string;
    componentName: string;
    id: number;
};

interface IProps {
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    steps: Array<optionTypes>
}

const Verification: React.FC<IProps> = ({ step, setStep, steps }) => {
    const { profileData } = useSelector((state: RootState) => state.user);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const currentUser = JSON.parse(localStorage.getItem('userData'));
    const Form = steps?.find((item) => item.componentName === 'Verification').name;



    const onSubmit = () => {
        // Example: Move to next step (if applicable)
        router.push(
            `/profile/${add2040ToProfileDetailsId(
                currentUser.UserProfileDetailsId
            )}`
        );
    };

    const handleGetCitiesOfCountry = async (Country: string) => {
        try {
            if (!Country) return;
            const response = await axios.get(
                `${apiEndpoint}/MyProfile/GetCityList/${Country}`,
                {
                    headers: {
                        XApiKey:
                            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );
            if (response.status === 200 && response.data.Result) {

            } else {

            }
        } catch (error) {
            console.error(error);

        }
    };



    const onEdit = (i) => {
        // Example: Move to next step (if applicable)
        setStep(i);
    };

    let content;
    switch (Form) {
        case 'Verify IndividualForm':
            content = (
                <div className="flex flex-col items-start justify-center max-w-[95%] mx-auto md:my-16 px-4 py-5 gap-10">
                    <h3 className="text-lg font-semibold text-blue-500">Review Your Details</h3>

                    <div className='w-[100%] flex justify-between'>
                        <div className="w-[50%] h-[50%] bg-gray-100 p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="font-semibold text-blue-500">Basic Information</h5>
                                <Button
                                    className="btn-secondary text-white text-sm px-4 py-2 w-[10%]"
                                    title="Edit"
                                    onClick={() => onEdit(0)}
                                />
                            </div>

                            <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                                <tbody className="text-base text-gray-800 border-none">
                                    <tr>
                                        <td className="font-bold text-black !w-[20%] border-none align-top ">Name:</td>
                                        <td className='border-none tracking-wide'>{profileData?.CompanyName || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[10%] border-none align-top">Work Title:</td>
                                        <td className='border-none tracking-wide'>{profileData?.WorkTitle || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[10%] border-none align-top">Race:</td>
                                        <td className='border-none tracking-wide'>{profileData?.Race || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[10%] border-none align-top">Nationality:</td>
                                        <td className='border-none tracking-wide'>{profileData?.phone || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[10%] border-none align-top">About You*:</td>
                                        <td className='border-none tracking-wide'>{profileData?.AboutYou || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[10%] border-none align-top">Description:</td>
                                        <td className='border-none tracking-wide'>
                                            {profileData?.UserAdditionalAboutYouDetails && profileData.UserAdditionalAboutYouDetails.length > 0 ? (
                                                <ul className="list-disc list-inside">
                                                    {profileData.UserAdditionalAboutYouDetails.map((detail) => (
                                                        <li key={detail.Id}>{detail.AboutYouDetail}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[10%] border-none align-top">Search Tags:</td>
                                        <td className='border-none tracking-wide'>
                                            {profileData?.Tags && profileData.Tags.length > 0
                                                ? profileData.Tags.join(', ')
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[10%] border-none align-top">Video Link*:</td>
                                        <td className='border-none tracking-wide'>{profileData?.AboutCompany || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="w-[45%] bg-gray-100 p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="font-semibold text-blue-500">Skills & Experience</h5>
                                <Button
                                    className="btn-secondary text-white text-sm px-4 py-2 w-[10%]"
                                    title="Edit"
                                    onClick={() => onEdit(1)}
                                />
                            </div>

                            <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                                <tbody className="text-base text-gray-800 border-none">
                                    <tr>
                                        <td className="font-bold text-black border-none align-top">Capabilities and Skills:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.SkillsAndCapabilities && profileData.SkillsAndCapabilities.length > 0 ? (
                                                <ul>
                                                    {profileData.SkillsAndCapabilities.map((skill) => (
                                                        <li key={skill.Id}>
                                                            {skill.SkillsName} ({skill.SkillsYear})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black border-none align-top">Experience:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.Experiences && profileData.Experiences.length > 0 ? (
                                                <ul>
                                                    {profileData.Experiences.map((experience) => (
                                                        <li key={experience.Id}>
                                                            <p>{experience.RoleName}</p> ({experience.Date})
                                                            <p>{experience.Message}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black border-none align-top">Education:</td>
                                        <td className="border-none tracking-wide"></td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black border-none align-top">Graduation in experts:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.ProfileEducations && profileData.ProfileEducations.length > 0 ? (
                                                <ul>
                                                    {profileData.ProfileEducations.map((education) => (
                                                        <li key={education.Id}>
                                                            {education.InstitutionName} ({education.FromYear} - {education.ToYear})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='w-[100%] flex justify-between'>
                        <div className='w-[40%] flex flex-col justify-between'>
                            <div className="w-[90%] h-[45%] bg-gray-100 p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="font-semibold text-blue-500">Qualifications</h5>
                                    <Button
                                        className="btn-secondary text-white text-sm !px-2 py-2 !w-[2%]"
                                        title="Edit"
                                        onClick={() => onEdit(2)}
                                    />
                                </div>

                                <table className="w-full table-auto border-none">
                                    <tbody className="text-base text-gray-800 border-none">
                                        <tr>
                                            <td className="font-bold text-black border-none !m-0 !p-0">Affiliations:</td>
                                            <td className="border-none tracking-wide !m-0 !p-0">
                                                {profileData?.AffliationsInformation && profileData.AffliationsInformation.length > 0 ? (
                                                    profileData.AffliationsInformation.map((affiliation, index) => (
                                                        <p key={index}>{affiliation.AffiliationsName}</p>
                                                    ))
                                                ) : (
                                                    'None'
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold text-black border-none">Certifications:</td>
                                            <td className="border-none tracking-wide">
                                                {profileData?.Certificates && profileData.Certificates.length > 0 ? (
                                                    profileData.Certificates.map((certificate, index) => (
                                                        <p key={index}>{certificate.Name}</p>
                                                    ))
                                                ) : (
                                                    'None'
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold text-black border-none">Recognition:</td>
                                            <td className="border-none tracking-wide">
                                                {profileData?.RecognitionInformation && profileData.RecognitionInformation.length > 0 ? (
                                                    profileData.RecognitionInformation.map((recognition, index) => (
                                                        <p key={index}>{recognition.Name}</p>
                                                    ))
                                                ) : (
                                                    'None'
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-[90%] h-[45%] bg-gray-100 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="font-semibold text-blue-500">Industry Selection</h5>
                                    <Button
                                        className="btn-secondary text-white text-sm px-4 py-2 md:w-[10%]"
                                        title="Edit"
                                        onClick={() => onEdit(4)}
                                    />
                                </div>

                                <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                                    <tbody className="text-base text-gray-800 border-none">
                                        <tr>
                                            <td className="border-none tracking-wide">
                                                {profileData?.UserProfileIndustrySelectionInformation?.length > 0 ? (
                                                    profileData.UserProfileIndustrySelectionInformation.map((industry, index) => (
                                                        <p key={index}>{industry.IndustryName}</p>
                                                    ))
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-[60%] bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="font-semibold text-blue-500">Charts</h5>
                                <Button
                                    className="btn-secondary text-white text-sm px-4 py-2 md:w-[10%]"
                                    title="Edit"
                                    onClick={() => onEdit(3)}
                                />
                            </div>

                            <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                                <tbody className="text-base text-gray-800 border-none">
                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Service or Product Splits*:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.UserProfileServices?.length > 0 ? (
                                                profileData.UserProfileServices.map((service, index) => (
                                                    <p key={index}>
                                                        {service.ServiceName} ({service.Percentage}%)
                                                    </p>
                                                ))
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Business Channel Categories:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.ChannelCategories?.length > 0 ? (
                                                profileData.ChannelCategories.map((category, index) => (
                                                    <p key={index}>
                                                        {category.BusinessChannelName} ({category.BusinessChannelPercentage}%)
                                                    </p>
                                                ))
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">List of Locations:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.UserProfileLocations?.length > 0 ? (
                                                profileData.UserProfileLocations.map((location, index) => (
                                                    <p key={index}>{location.LocationName}</p>
                                                ))
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Clients By Size*:</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Individuals:</td>
                                        <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[0]?.BusinessPercentage || 'None'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Small Businesses (less than $8 million in annual revenue) :</td>
                                        <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[1]?.BusinessPercentage || 'None'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Midmarket Businesses ($8M to $1B annual revenue):</td>
                                        <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[2]?.BusinessPercentage || 'None'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Enterprise (more than $1 billion in annual revenue):</td>
                                        <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[3]?.BusinessPercentage || 'None'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse w-full mt-auto md:mx-4 md:ml-auto md:flex-row">
                        <Button
                            className="text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold w-full px-4 py-3 me-3 justify-end mb-2"
                            title="Back"
                            onClick={() => setStep(step - 1)}
                        />
                        <Button
                            className="w-full mb-2 btn-secondary text-[30px] xl:text-scaled-h6 ms-1 md:w-[10%] text-white"
                            title="Submit"
                            onClick={onSubmit}
                        />
                    </div>
                </div>
            );
            break;
        case 'Verify Advocate Form': content = (
            <div className="w-full bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-blue-500">Basic Information</h5>
                </div>

                <table className="w-[35%] table-auto border-none border-separate border-spacing-y-2">
                    <tbody className="text-base text-gray-800 border-none">
                        <tr>
                            <td className="font-bold text-black !w-[25%] border-none">Name:</td>
                            <td className="border-none tracking-wide">{profileData?.CompanyName || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-black border-none">Work Title:</td>
                            <td className="border-none tracking-wide">{profileData?.WorkTitle || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-black border-none">Race:</td>
                            <td className="border-none tracking-wide">{profileData?.Race || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-black border-none">Nationality:</td>
                            <td className="border-none tracking-wide">{profileData?.CountryOfOriginName || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-black border-none align-top">About You*:</td>
                            <td className="border-none tracking-wide">{profileData?.AboutYou || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-black border-none align-top">Search Tags:</td>
                            <td className="border-none tracking-wide">
                                {profileData?.Tags && profileData.Tags.length > 0 ? (
                                    profileData.Tags.map((tag, index) => (
                                        <p key={index}>{tag}</p>
                                    ))
                                ) : (
                                    'N/A'
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex flex-col-reverse w-[30%] mt-auto md:mx-4 md:ml-auto md:flex-row">
                    <Button
                        className="text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold w-full px-4 py-3 me-3 justify-end mb-2"
                        title="Back"
                        onClick={() => setStep(step - 1)}
                    />
                    <Button
                        className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 md:min-w-[170px] w-full text-white"
                        title="Submit"
                        onClick={onSubmit}
                    />
                </div>
            </div>
        );
            break;
        case 'Verify BusinessForm': content = (

            <div className="flex flex-col items-start justify-center max-w-[95%] mx-auto md:my-16 px-4 py-5 gap-10">
                <h3 className="text-lg font-semibold text-blue-500">Review Your Details</h3>
                <div className='w-[100%] flex justify-between'>
                    <div className="w-[65%] h-[50%] bg-gray-100 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-semibold text-blue-500">Basic Information</h5>
                            <Button
                                className="btn-secondary text-white text-sm px-4 py-2 w-[10%]"
                                title="Edit"
                                onClick={() => onEdit(0)}
                            />
                        </div>

                        <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                            <tbody className="text-base text-gray-800 border-none">
                                <tr>
                                    <td className="font-bold text-black !w-[20%] border-none align-top ">Company Name:</td>
                                    <td className='border-none tracking-wide'>{profileData?.CompanyName || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[10%] border-none align-top">Slogan:</td>
                                    <td className='border-none tracking-wide'>{profileData?.Tagline || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[10%] border-none align-top">Country:</td>
                                    <td className='border-none tracking-wide'>{profileData?.CountryOfOriginName || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[10%] border-none align-top">City:</td>
                                    <td className='border-none tracking-wide'>{profileData?.phone || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[10%] border-none align-top">Custom URL*:</td>
                                    <td className='border-none tracking-wide'>
                                        {profileData?.SocialMediaUrls?.length > 0 ? (
                                            profileData.SocialMediaUrls.map((url, index) => (
                                                <span key={index}>
                                                    {url.SocialMediaUrl}
                                                    {index < profileData.SocialMediaUrls.length - 1 && ', '}
                                                </span>
                                            ))
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[10%] border-none align-top">About Company*:</td>
                                    <td className='border-none tracking-wide'>{profileData?.AboutCompany || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[10%] border-none">Search Tags:</td>
                                    <td className='border-none tracking-wide'>{profileData?.phone || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='w-[30%] flex flex-col justify-between'>
                        <div className="w-[100%] h-[45%] bg-gray-100 p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="font-semibold text-blue-500">Qualifications</h5>
                                <Button
                                    className="btn-secondary text-white text-sm !px-2 py-2 !w-[2%]"
                                    title="Edit"
                                    onClick={() => onEdit(2)}
                                />
                            </div>

                            <table className="w-full table-auto border-none">
                                <tbody className="text-base text-gray-800 border-none">
                                    <tr>
                                        <td className="font-bold text-black border-none !m-0 !p-0">Affiliations:</td>
                                        <td className="border-none tracking-wide !m-0 !p-0">
                                            {profileData?.AffliationsInformation && profileData.AffliationsInformation.length > 0 ? (
                                                profileData.AffliationsInformation.map((affiliation, index) => (
                                                    <p key={index}>{affiliation.AffiliationsName}</p>
                                                ))
                                            ) : (
                                                'None'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black border-none">Certifications:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.Certificates && profileData.Certificates.length > 0 ? (
                                                profileData.Certificates.map((certificate, index) => (
                                                    <p key={index}>{certificate.Name}</p>
                                                ))
                                            ) : (
                                                'None'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-black border-none">Recognition:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.RecognitionInformation && profileData.RecognitionInformation.length > 0 ? (
                                                profileData.RecognitionInformation.map((recognition, index) => (
                                                    <p key={index}>{recognition.Name}</p>
                                                ))
                                            ) : (
                                                'None'
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="w-[100%] h-[45%] bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="font-semibold text-blue-500">Industry Selection</h5>
                                <Button
                                    className="btn-secondary text-white text-sm px-4 py-2 md:w-[10%]"
                                    title="Edit"
                                    onClick={() => onEdit(4)}
                                />
                            </div>

                            <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                                <tbody className="text-base text-gray-800 border-none">
                                    <tr>
                                        <td className="font-bold text-black w-[20%] border-none align-top">Industries:</td>
                                        <td className="border-none tracking-wide">
                                            {profileData?.UserProfileIndustrySelectionInformation?.length > 0 ? (
                                                profileData.UserProfileIndustrySelectionInformation.map((industry, index) => (
                                                    <p key={index}>{industry.IndustryName}</p>
                                                ))
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='w-[100%] flex justify-between'>
                    <div className="w-[45%] bg-gray-100 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-semibold text-blue-500">Business Information</h5>
                            <Button
                                className="btn-secondary text-white text-sm px-4 py-2 w-[10%]"
                                title="Edit"
                                onClick={() => onEdit(1)}
                            />
                        </div>

                        <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                            <tbody className="text-base text-gray-800 border-none">
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Location:</td>
                                    <td className='border-none tracking-wide'>{profileData?.AddressLine1 || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Address:</td>
                                    <td className='border-none tracking-wide'>{profileData?.AddressLine2 || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Country:</td>
                                    <td className='border-none tracking-wide'>{profileData?.Country || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">State:</td>
                                    <td className='border-none tracking-wide'>{profileData?.State || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">City:</td>
                                    <td className='border-none tracking-wide'>{profileData?.City || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Pincode:</td>
                                    <td className='border-none tracking-wide'>{profileData?.Code || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Website:</td>
                                    <td className='border-none tracking-wide'>{profileData?.WebsiteUrl || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">No. of Employees:</td>
                                    <td className='border-none tracking-wide'>{profileData?.NumberOfEmployess || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Email - Queries:</td>
                                    <td className='border-none tracking-wide'>{profileData?.EmailIdForQueries || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Email - Business Dev:</td>
                                    <td className='border-none tracking-wide'>{profileData?.EmailIdForBusinessDevelopment || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Black Ownership %:</td>
                                    <td className='border-none tracking-wide'>{profileData?.BlackOwnershipPercentage || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Languages:</td>
                                    <td className='border-none tracking-wide'>
                                        {profileData?.Languages?.length > 0
                                            ? profileData.Languages.join(', ')
                                            : 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Phone Number:</td>
                                    <td className='border-none tracking-wide'>{profileData?.PhoneNumber || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Hours:</td>
                                    <td className='border-none tracking-wide'>{profileData?.Hours || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">Business Type:</td>
                                    <td className='border-none tracking-wide'>{profileData?.BussinessType || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black border-none align-top">In Business Since:</td>
                                    <td className='border-none tracking-wide'>{profileData?.BusinessSince || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="w-[50%] bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-semibold text-blue-500">Charts</h5>
                            <Button
                                className="btn-secondary text-white text-sm px-4 py-2 md:w-[10%]"
                                title="Edit"
                                onClick={() => onEdit(3)}
                            />
                        </div>

                        <table className="w-full table-auto border-none border-separate border-spacing-y-2">
                            <tbody className="text-base text-gray-800 border-none">
                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">Service or Product Splits*:</td>
                                    <td className="border-none tracking-wide">
                                        {profileData?.UserProfileServices?.length > 0 ? (
                                            profileData.UserProfileServices.map((service, index) => (
                                                <p key={index}>
                                                    {service.ServiceName} ({service.Percentage}%)
                                                </p>
                                            ))
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">Business Channel Categories:</td>
                                    <td className="border-none tracking-wide">
                                        {profileData?.ChannelCategories?.length > 0 ? (
                                            profileData.ChannelCategories.map((category, index) => (
                                                <p key={index}>
                                                    {category.BusinessChannelName} ({category.BusinessChannelPercentage}%)
                                                </p>
                                            ))
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">List of Locations:</td>
                                    <td className="border-none tracking-wide">
                                        {profileData?.UserProfileLocations?.length > 0 ? (
                                            profileData.UserProfileLocations.map((location, index) => (
                                                <p key={index}>{location.LocationName}</p>
                                            ))
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">Clients By Size*:</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">Individuals:</td>
                                    <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[0]?.BusinessPercentage || 'N/A'}%</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">Small Businesses (less than $8 million in annual revenue) :</td>
                                    <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[1]?.BusinessPercentage || 'N/A'}%</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">Midmarket Businesses ($8M to $1B annual revenue):</td>
                                    <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[2]?.BusinessPercentage || 'N/A'}%</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-black w-[20%] border-none align-top">Enterprise (more than $1 billion in annual revenue):</td>
                                    <td className='border-none tracking-wide'>{profileData?.ClientBySizes?.[3]?.BusinessPercentage || 'N/A'}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col-reverse w-full mt-auto md:mx-4 md:ml-auto md:flex-row">
                    <Button
                        className="text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold w-full px-4 py-3 me-3 justify-end mb-2"
                        title="Back"
                        onClick={() => setStep(step - 1)}
                    />
                    <Button
                        className="w-full mb-2 btn-secondary text-[30px] xl:text-scaled-h6 ms-1 md:w-[10%] text-white"
                        title="Submit"
                        onClick={onSubmit}
                    />
                </div>
            </div>
        );
            break;

    }
    return content;
};

export default Verification;

