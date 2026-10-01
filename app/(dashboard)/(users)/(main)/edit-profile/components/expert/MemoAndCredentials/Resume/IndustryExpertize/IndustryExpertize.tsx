
import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export interface IndustryExpertiseSchema {
    Id: number;
    Field: string;
    Years: number;
}


const IndustryExpertise = ({ setDeleteIdsData }) => {
    const { register, watch, setValue, control, formState: { errors } } = useFormContext<{ ExpertIndustryExpertize: IndustryExpertiseSchema[] }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ExpertIndustryExpertize',
    });
    const [openDropdownIndex, setOpenDropdownIndex] = useState(-1)

    useEffect(() => {
        if (fields.length === 0) {
            append({
                Id: 0,
                Field: '',
                Years: 0,
            });
        }
    }, [fields, append]);

    function removeData(index: number, id: number) {
        if (id !== 0) {
            setDeleteIdsData((prev) => ({
                ...prev,
                industryExpertise: [...prev.industryExpertise, id],
            }));
        }
        remove(index);
    }

    const industryDropdown = [
        { label: "Accommodation", value: "Accommodation" },
        { label: "Accommodation and Food Services", value: "Accommodation and Food Services" },
        { label: "Administrative and Support Services", value: "Administrative and Support Services" },
        { label: "Administrative and Support and Waste Management and Remediation Services", value: "Administrative and Support and Waste Management and Remediation Services" },
        { label: "Agriculture, Forestry, Fishing and Hunting", value: "Agriculture, Forestry, Fishing and Hunting" },
        { label: "Air Transportation", value: "Air Transportation" },
        { label: "Ambulatory Health Care Services", value: "Ambulatory Health Care Services" },
        { label: "Amusement, Gambling, and Recreation Industries", value: "Amusement, Gambling, and Recreation Industries" },
        { label: "Animal Production", value: "Animal Production" },
        { label: "Apparel Manufacturing", value: "Apparel Manufacturing" },
        { label: "Arts, Entertainment, and Recreation", value: "Arts, Entertainment, and Recreation" },
        { label: "Beverage and Tobacco Product Manufacturing", value: "Beverage and Tobacco Product Manufacturing" },
        { label: "Broadcasting (except Internet", value: "Broadcasting (except Internet" },
        { label: "Building Material and Garden Equipment and Supplies Dealers", value: "Building Material and Garden Equipment and Supplies Dealers" },
        { label: "Chemical Manufacturing", value: "Chemical Manufacturing" },
        { label: "Clothing and Clothing Accessories Stores", value: "Clothing and Clothing Accessories Stores" },
        { label: "Computer and Electronic Product Manufacturing", value: "Computer and Electronic Product Manufacturing" },
        { label: "Construction", value: "Construction" },
        { label: "Construction of Buildings", value: "Construction of Buildings" },
        { label: "Couriers and Messengers", value: "Couriers and Messengers" },
        { label: "Credit Intermediation and Related Activities", value: "Credit Intermediation and Related Activities" },
        { label: "Crop Production", value: "Crop Production" },
        { label: "Data Processing, Hosting, and Related Services", value: "Data Processing, Hosting, and Related Services" },
        { label: "Education and Health Services", value: "Education and Health Services" },
        { label: "Educational Services", value: "Educational Services" },
        { label: "Electrical Equipment, Appliance, and Component Manufacturing", value: "Electrical Equipment, Appliance, and Component Manufacturing" },
        { label: "Electronics and Appliance Stores", value: "Electronics and Appliance Stores" },
        { label: "Fabricated Metal Product Manufacturing", value: "Fabricated Metal Product Manufacturing" },
        { label: "Finance and Insurance", value: "Finance and Insurance" },
        { label: "Financial Activities", value: "Financial Activities" },
        { label: "Fishing, Hunting and Trapping", value: "Fishing, Hunting and Trapping" },
        { label: "Food Manufacturing", value: "Food Manufacturing" },
        { label: "Food Services and Drinking Places", value: "Food Services and Drinking Places" },
        { label: "Food and Beverage Stores", value: "Food and Beverage Stores" },
        { label: "Forestry and Logging", value: "Forestry and Logging" },
        { label: "Funds, Trusts, and Other Financial Vehicles", value: "Funds, Trusts, and Other Financial Vehicles" },
        { label: "Furniture and Home Furnishings Stores", value: "Furniture and Home Furnishings Stores" },
        { label: "Furniture and Related Product Manufacturing", value: "Furniture and Related Product Manufacturing" },
        { label: "Gasoline Stations", value: "Gasoline Stations" },
        { label: "General Merchandise Stores", value: "General Merchandise Stores" },
        { label: "Goods-Producing Industries", value: "Goods-Producing Industries" },
        { label: "Health Care and Social Assistance", value: "Health Care and Social Assistance" },
        { label: "Health and Personal Care Stores", value: "Health and Personal Care Stores" },
        { label: "Heavy and Civil Engineering Construction", value: "Heavy and Civil Engineering Construction" },
        { label: "Hospitals", value: "Hospitals" },
        { label: "Information", value: "Information" },
        { label: "Insurance Carriers and Related Activities", value: "Insurance Carriers and Related Activities" },
        { label: "Internet Publishing and Broadcasting", value: "Internet Publishing and Broadcasting" },
        { label: "Leather and Allied Product Manufacturing", value: "Leather and Allied Product Manufacturing" },
        { label: "Leisure and Hospitality", value: "Leisure and Hospitality" },
        { label: "Lessors of Nonfinancial Intangible Assets (except Copyrighted Works", value: "Lessors of Nonfinancial Intangible Assets (except Copyrighted Works" },
        { label: "Machinery Manufacturing", value: "Machinery Manufacturing" },
        { label: "Management of Companies and Enterprises", value: "Management of Companies and Enterprises" },
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Merchant Wholesalers, Durable Goods", value: "Merchant Wholesalers, Durable Goods" },
        { label: "Merchant Wholesalers, Nondurable Goods", value: "Merchant Wholesalers, Nondurable Goods" },
        { label: "Mining (except Oil and Gas", value: "Mining (except Oil and Gas" },
        { label: "Mining, Quarrying, and Oil and Gas Extraction", value: "Mining, Quarrying, and Oil and Gas Extraction" },
        { label: "Miscellaneous Manufacturing", value: "Miscellaneous Manufacturing" },
        { label: "Miscellaneous Store Retailers", value: "Miscellaneous Store Retailers" },
        { label: "Monetary Authorities - Central Bank", value: "Monetary Authorities - Central Bank" },
        { label: "Motion Picture and Sound Recording Industries", value: "Motion Picture and Sound Recording Industries" },
        { label: "Motor Vehicle and Parts Dealers", value: "Motor Vehicle and Parts Dealers" },
        { label: "Museums, Historical Sites, and Similar Institutions", value: "Museums, Historical Sites, and Similar Institutions" },
        { label: "Natural Resources and Mining", value: "Natural Resources and Mining" },
        { label: "Nonmetallic Mineral Product Manufacturing", value: "Nonmetallic Mineral Product Manufacturing" },
        { label: "Nonstore Retailers", value: "Nonstore Retailers" },
        { label: "Nursing and Residential Care Facilities", value: "Nursing and Residential Care Facilities" },
        { label: "Oil and Gas Extraction", value: "Oil and Gas Extraction" },
        { label: "Other Information Services", value: "Other Information Services" },
        { label: "Other Services (except Public Administration", value: "Other Services (except Public Administration" },
        { label: "Paper Manufacturing", value: "Paper Manufacturing" },
        { label: "Performing Arts, Spectator Sports, and Related Industries", value: "Performing Arts, Spectator Sports, and Related Industries" },
        { label: "Personal and Laundry Services", value: "Personal and Laundry Services" },
        { label: "Petroleum and Coal Products Manufacturing", value: "Petroleum and Coal Products Manufacturing" },
        { label: "Pipeline Transportation", value: "Pipeline Transportation" },
        { label: "Plastics and Rubber Products Manufacturing", value: "Plastics and Rubber Products Manufacturing" },
        { label: "Postal Service", value: "Postal Service" },
        { label: "Primary Metal Manufacturing", value: "Primary Metal Manufacturing" },
        { label: "Printing and Related Support Activities", value: "Printing and Related Support Activities" },
        { label: "Private Households", value: "Private Households" },
        { label: "Professional and Business Services", value: "Professional and Business Services" },
        { label: "Professional, Scientific, and Technical Services", value: "Professional, Scientific, and Technical Services" },
        { label: "Publishing Industries (except Internet", value: "Publishing Industries (except Internet" },
        { label: "Rail Transportation", value: "Rail Transportation" },
        { label: "Real Estate", value: "Real Estate" },
        { label: "Real Estate and Rental and Leasing", value: "Real Estate and Rental and Leasing" },
        { label: "Religious, Grantmaking, Civic, Professional, and Similar Organizations", value: "Religious, Grantmaking, Civic, Professional, and Similar Organizations" },
        { label: "Rental and Leasing Services", value: "Rental and Leasing Services" },
        { label: "Repair and Maintenance", value: "Repair and Maintenance" },
        { label: "Retail Trade", value: "Retail Trade" },
        { label: "Scenic and Sightseeing Transportation", value: "Scenic and Sightseeing Transportation" },
        { label: "Securities, Commodity Contracts, and Other Financial Investments and Related Activities", value: "Securities, Commodity Contracts, and Other Financial Investments and Related Activities" },
        { label: "Service-Providing Industries", value: "Service-Providing Industries" },
        { label: "Social Assistance", value: "Social Assistance" },
        { label: "Specialty Trade Contractors", value: "Specialty Trade Contractors" },
        { label: "Sporting Goods, Hobby, Book, and Music Stores", value: "Sporting Goods, Hobby, Book, and Music Stores" },
        { label: "Support Activities for Agriculture and Forestry", value: "Support Activities for Agriculture and Forestry" },
        { label: "Support Activities for Mining", value: "Support Activities for Mining" },
        { label: "Support Activities for Transportation", value: "Support Activities for Transportation" },
        { label: "Telecommunications", value: "Telecommunications" },
        { label: "Textile Mills", value: "Textile Mills" },
        { label: "Textile Product Mills", value: "Textile Product Mills" },
        { label: "Trade, Transportation, and Utilities", value: "Trade, Transportation, and Utilities" },
        { label: "Transit and Ground Passenger Transportation", value: "Transit and Ground Passenger Transportation" },
        { label: "Transportation Equipment Manufacturing", value: "Transportation Equipment Manufacturing" },
        { label: "Transportation and Warehousing", value: "Transportation and Warehousing" },
        { label: "Truck Transportation", value: "Truck Transportation" },
        { label: "Utilities", value: "Utilities" },
        { label: "Warehousing and Storage", value: "Warehousing and Storage" },
        { label: "Waste Management and Remediation Services", value: "Waste Management and Remediation Services" },
        { label: "Water Transportation", value: "Water Transportation" },
        { label: "Wholesale Electronic Markets and Agents and Brokers", value: "Wholesale Electronic Markets and Agents and Brokers" },
        { label: "Wholesale Trade", value: "Wholesale Trade" },
        { label: "Wood Product Manufacturing", value: "Wood Product Manufacturing" }
    ];


    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Industry Expertise*</h2>
                    <h2 className="font-semibold text-gray-700 mb-2">Select which applies to you</h2>
                    {fields.map((field, index) => (
                        <div key={index} className={` rounded p-2 md:p-3`}>
                            <input
                                type="hidden"
                                {...register(`ExpertIndustryExpertize.${index}.Id`)}
                            />
                            <div className="grid grid-cols-3 gap-4">

                                <div>
                                    <div className={`w-full flex gap-2 md:gap-4 justify-between items-center text-[16px] font-normal text-gray-700 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                                        <div onClick={() => { openDropdownIndex == index ? setOpenDropdownIndex(-1) : setOpenDropdownIndex(index) }} className='flex-grow'>
                                            <div className='w-full flex justify-between items-center'>
                                                <p>
                                                    {watch(`ExpertIndustryExpertize.${index}.Field`)?.trim()
                                                        ? watch(`ExpertIndustryExpertize.${index}.Field`)
                                                        : 'Select expertise field'}
                                                </p>
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform duration-200 ${openDropdownIndex == index ? 'rotate-180' : ''
                                                    }`}>
                                                    <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z" fill="#667085" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        {/* Dropdown options */}
                                        {openDropdownIndex == index && (
                                            <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                                {industryDropdown.map((area) => (
                                                    <div
                                                        key={area.value}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                        onClick={() => {
                                                            setValue(`ExpertIndustryExpertize.${index}.Field`, area.value);
                                                            setOpenDropdownIndex(-1);
                                                        }}
                                                    >
                                                        {area.value}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.ExpertIndustryExpertize?.[index]?.Field?.message && (
                                        <span className="text-red-500">
                                            {errors.ExpertIndustryExpertize[index].Field.message}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type='number'
                                        placeholder="Years of experience in field"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md resize-none"
                                        {...register(`ExpertIndustryExpertize.${index}.Years`, { valueAsNumber: true })}
                                    />
                                    {errors.ExpertIndustryExpertize?.[index]?.Years?.message && (
                                        <span className="text-red-500">
                                            {errors.ExpertIndustryExpertize[index].Years.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center text-[14px] font-semibold text-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => removeData(index, field.Id)}
                                        className={`bg-gray-500 ${index == 0 ? "hidden" : ""} text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-600`}
                                        title="Remove"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1L1 13M1 1L13 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        append({
                            Id: 0,
                            Field: '',
                            Years: 0,
                        })
                    }
                    className="shadow-md text-[#1A4EFF] font-semibold mt-2 flex text-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                >＋ Add More
                </button>
            </div>
        </>
    )
}

export default IndustryExpertise;