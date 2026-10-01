import { RootState } from '@/data/store';
import React from 'react';
import { useSelector } from 'react-redux';

const credentials: {
  title: string;
  sections: { name: string; year?: number }[];
}[] = [
    {
      title: 'Affiliations',
      sections: [
        { name: 'MIT' },
        { name: 'Guardian Protect' },
        { name: 'Tech for Change' },
        { name: 'Black Girls Code' },
        { name: 'One Love Project' },
        { name: 'Tech for Change' },
      ],
    },
    {
      title: 'Certifications',
      sections: [
        { name: 'Certification 101', year: 2019 },
        { name: 'Certification 101', year: 2019 },
      ],
    },
    {
      title: 'Recognition',
      sections: [
        { name: 'Recognition', year: 2019 },
        { name: 'Recognition', year: 2019 },
      ],
    },
  ];

const Credentials = () => {
  const { profileData } = useSelector((state: RootState) => state.user);

  const credentials: {
    title: string;
    sections: { name: string; year?: number }[];
  }[] = [
      {
        title: 'Affiliations',
        sections: profileData.AffliationsInformation?.map((item: any) => ({
          name: item.AffiliationsName,
        })),
      },
      {
        title: 'Cerifications and Licenses',
        sections: profileData?.Certificates?.map((item: any) => ({
          name: item.Name,
          year: item.Year,
        })),
      },
      {
        title: 'Recognition',
        sections: profileData?.RecognitionInformation?.map((item: any) => ({
          name: item.Name,
          year: item?.Year,
        })),
      },
    ];

  return (
    <div>
      {credentials?.map((credential, index) => (
        <div key={index} className="mb-12">
          <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500 mb-5">
            {credential.title}
          </h6>
          <div className="flex items-center flex-wrap gap-3">
            {credential.sections?.map((section, ind) => (
              <div
                key={ind}
                className="border border-[#D8DCE4] bg-[#EDF0F2] px-4 py-2 rounded-md flex items-center"
              >
                <div className="flex items-center gap-3">
                  <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-500">
                    {section.name}
                  </p>
                  {section.year ? (
                    <p className="text-h8 2xl:text-scaled-h8 font-semibold text-blue-100">
                      {section.year}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Credentials;
