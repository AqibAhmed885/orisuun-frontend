import React from 'react';
import DoughnutChart from '../ui/dough-chat';
import LocationPin from '@/icons/location-pin';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';

const Fundamentals = () => {
  const { profileData } = useSelector((state: RootState) => state.user);
  const dataSet = [
    {
      title: profileData?.UserProfileTypeId == 7 ? "Investment Size": 'Service or Product Splits',
      sections: profileData && profileData?.UserProfileServices ? profileData?.UserProfileServices?.map(
        (item: any, index: number) => ({
          name: item?.ServiceName,
          color:
            index === 0
              ? '#5B657B'
              : index === 1
                ? '#6C8ED9'
                : index === 2
                  ? '#9BCCEF'
                  : '#D1E7F8',
          percent: item?.Percentage,
        })
      ): [],
    },
    {
      title:  profileData?.UserProfileTypeId == 7 ? "Debt vs. Equity":'Business Channels',
      sections: profileData &&profileData?.ChannelCategories ? profileData?.ChannelCategories?.map(
        (item: any, index: number) => ({
          name: item?.BusinessChannelName,
          color:
            index === 0
              ? '#5B657B'
              : index === 1
                ? '#6C8ED9'
                : index === 2
                  ? '#9BCCEF'
                  : '#D1E7F8',
          percent: item?.BusinessChannelPercentage,
        })
      ): [],
    },
    {
      title: 'Clients by Size',
      // sections: [
      //   {
      //     name: 'Individuals',
      //     color: '#5B657B',
      //     percent: profileData.ClientBySizes.IndividualsPercentage,
      //   },
      //   {
      //     name: 'Small Business',
      //     color: '#6C8ED9',
      //     percent: profileData.ClientBySizes.SmallBusinessPercentage,
      //   },
      //   {
      //     name: 'Mid Market',
      //     color: '#9BCCEF',
      //     percent: profileData.ClientBySizes.MidMarketPercentage,
      //   },
      //   {
      //     name: 'Enterprise',
      //     color: '#D1E7F8',
      //     percent: profileData.ClientBySizes.EnterprisePercentage,
      //   },
      // ],
      sections: profileData &&profileData?.ClientBySizes ? profileData?.ClientBySizes?.map(
        (item: any, index: number) => ({
          name: item?.BusinessType,
          color:
            index === 0
              ? '#5B657B'
              : index === 1
                ? '#6C8ED9'
                : index === 2
                  ? '#9BCCEF'
                  : '#D1E7F8',
          percent: item?.BusinessPercentage,
        })
      ) : [],
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {dataSet?.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-custom-combined p-8 border border-[#E3E3E2] rounded-md"
        >
          <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500 mb-8">
            {item.title}
          </h6>
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="w-full md:w-1/2">
              <DoughnutChart data={item || {title:"", sections:[]}} />
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {item && item?.sections?.map((section, ind) => (
                <div key={ind} className="flex items-center">
                  <div className="flex items-center gap-1.5 flex-grow">
                    <span
                      className={`w-3.5 h-3.5 rounded-sm`}
                      style={{ background: section.color }}
                    ></span>
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                      { section.name === "MidMarketBusiness" ? "Middle Market" : section.name == "SmallBusiness"?'Small Business' : section.name}
                    </p>
                  </div>
                  <p className="text-h8 2xl:text-scaled-h8 font-semibold text-blue-500">
                    {section.percent}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <ul className="bg-white shadow-custom-combined p-8 border border-[#E3E3E2] rounded-md">
        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500 mb-8">
          List of Locations
        </h6>
        <div className="space-y-3">
          {profileData && profileData?.UserProfileLocations?.map((location, index) => (
            <li key={index} className="flex items-center gap-2">
              <LocationPin className="text-omblue-500 w-6 h-6" />
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                {location.LocationName}
              </p>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default Fundamentals;
