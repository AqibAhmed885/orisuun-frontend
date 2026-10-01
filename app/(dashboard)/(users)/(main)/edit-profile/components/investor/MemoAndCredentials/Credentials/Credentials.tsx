'use client';

import React, { useEffect} from 'react';
import { useFormContext } from 'react-hook-form';
import ProfessionalExperience from './ProfessionalExperience';
import EducationCertification from './EducationCertification';
import RecognitionAwards from './RecognitionAwards';
import PublicationsResearch from './PublicationsResearch';
import Skills from './Skills';

const Credentials = ({ currentUserData, setDeleteIdsData }) => {
    const { reset, formState: { errors } } = useFormContext();

    useEffect(() => {
        if (currentUserData) {
            const mappedData = {

                professionalExperience: currentUserData.UsersProfessionalExperience?.map(item => ({
                    Id: item.Id,
                    CompanyName: item.CompanyName,
                    StartDate: item.StartDate?.split('T')[0],
                    EndDate: item.EndDate?.split('T')[0],
                    Responsibility: item.Responsibility,
                })) || [],

                educationCertification: currentUserData.UsersEducationCertification?.map(item => ({
                    Id: item.Id,
                    School: item.School,
                    DegreeTypeId: item.DegreeType?.Id || 0,
                    StartDate: item.StartDate?.split('T')[0],
                    EndDate: item.EndDate?.split('T')[0],
                    AboutProgram: item.AboutProgram,
                })) || [],

                recognitionAward: currentUserData.UsersRecognitionAwards?.map(item => ({
                    Id: item.Id,
                    AwardingBody: item.AwardingBody,
                    Name: item.Name,
                })) || [],

                skills: currentUserData.UserSkills?.map(item => ({
                    Id: item.Id,
                    Skill: item.Skill
                })) || [],

                publicationResearch: currentUserData.UserPublicationResearch?.map(item => ({
                    Id: item.Id,
                    Title: item.Title
                })) || [],
            };
            reset(mappedData);
        }
    }, [currentUserData]);

    return (
        <>
            <div className='w-[95%] mt-10 mx-auto bg-white border-1 pb-5 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <ProfessionalExperience setDeleteIdsData={setDeleteIdsData}/>
            </div>
            <div className='w-[95%] mt-10 mx-auto bg-white border-1 pb-5 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <EducationCertification setDeleteIdsData={setDeleteIdsData}/>
            </div>
            <div className='w-[95%] mt-10 mx-auto bg-white border-1 pb-5 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <RecognitionAwards setDeleteIdsData={setDeleteIdsData}/>
            </div>
            {/* Skills */}
            <div className='w-[95%] mt-10 mx-auto bg-white border-1 pb-5 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <Skills setDeleteIdsData={setDeleteIdsData}/>
            </div>
            {/*  */}
            <div className='w-[95%] mt-10 mb-16 mx-auto bg-white border-1 pb-5 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <PublicationsResearch setDeleteIdsData={setDeleteIdsData}/>
            </div>
        </>
    );
};

export default Credentials;
