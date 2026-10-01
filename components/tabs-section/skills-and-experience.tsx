import { RootState } from '@/data/store';
import GoTo from '@/icons/go-to';
import React from 'react';
import { useSelector } from 'react-redux';

const SkillsAndExperience = () => {
  const { profileData } = useSelector((state: RootState) => state.user);

  const capabilities = {
    title: 'Capabilities and Skills',
    skills: profileData?.SkillsAndCapabilities
      ? profileData?.SkillsAndCapabilities?.map((skill) => ({
        name: skill.SkillsName,
        year: skill.SkillsYear,
      }))
      : [],
  };
  const education = {
    title: 'Education',
    skills: profileData?.ProfileEducations
      ? profileData?.ProfileEducations?.map((edu) => ({
        degree: edu.DegreeName,
        institute: edu.InstituteName,
        fromt: edu.FromYear,
        to: edu.ToYear,
      }))
      : [],
  };
  const experience = {
    title: 'Experience',
    skills: profileData?.Experiences
      ? profileData?.Experiences?.map((exp) => ({
        name: exp.RoleName,
        year: exp.FromDate,
        description: exp.Message,
      }))
      : [],
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
          {capabilities.title}
        </h6>
        <div className="flex items-center flex-wrap gap-3">
          {capabilities.skills.length ?
            capabilities.skills?.map((capability, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border border-olblue-200 bg-olblue-50 px-4 py-2"
              >
                <p className="text-h7 2xl:text-scaled-h7 font-semibold text-omblue-700">
                  {capability.name}
                </p>
                {capability.year ? (
                  <p className="text-h8 2xl:text-scaled-h8 font-semibold text-olblue-200">
                    {capability.year}
                  </p>
                ) : null}
              </div>
            )) :(
              <p className="text-h8 2xl:text-scaled-h8 font-medium text-blue-300">
                No capabilities and skills yet.
              </p>
            )}
        </div>
      </div>

      <div className="space-y-6">
        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
          {experience.title}
        </h6>
        <div className="flex flex-col items-start flex-wrap gap-3">
          {experience.skills.length ? (
            experience.skills?.map((capability, index) => (
              <div
                key={index}
                className="rounded-md p-6 border border-grey-600"
              >
                <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500 mb-2">
                  {capability.name}
                </h6>
                <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500 mb-4">
                  {capability.year}
                </p>
                <p className="text-h8 2xl:text-scaled-h8 font-medium text-blue-300">
                  {capability.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-h8 2xl:text-scaled-h8 font-medium text-blue-300">
              No experience yet.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
          {education.title}
        </h6>
        <div className="flex flex-col items-start flex-wrap gap-3">
          {education.skills.length ?
            education.skills?.map((edu: any, index: number) => (
              <div
                key={index}
                className="rounded-md p-6 border border-grey-600"
              >
                <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500 mb-2">
                  {edu.degree}
                </h6>
                <div className="flex items-center gap-2 w-full">
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500 mb-4">
                    {edu.institute}
                  </p>
                  <span className="w-1 h-1 bg-blue-100 rounded-full flex items-center mb-4 justify-center"></span>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500 mb-4">
                    {edu.to}
                  </p>
                </div>
                <p className="text-h8 2xl:text-scaled-h8 font-medium text-blue-300">
                  {/* {edu.to} */}
                </p>
              </div>
            )) : (
              <p className="text-h8 2xl:text-scaled-h8 font-medium text-blue-300">
                No education yet.
              </p>
            )}
        </div>
      </div>
      <div className="space-y-6">
        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
          Publications
        </h6>
        <button className="px-4 py-2 bg-[#EDF0F2] border border-[#D8DCE4] flex items-center gap-3">
          <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-500">
            Publication name
          </p>
          <GoTo className="w-4 h-4 text-blue-300" />
        </button>
      </div>
    </div>
  );
};

export default SkillsAndExperience;
