'use client';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
import CustomSelect from '@/components/ui/select';
import Loader from '@/components/ui/loader';
import Pagination from '@/components/ui/pagination';
import { reports } from '@/app/api/dashboard/reports';
import { getNewsletterStats } from '@/app/api/admin/newsletter';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [loader, setLoader] = useState(true);
  const [profileData, setProfileData] = useState([]);
  const [newsletterStats, setNewsletterStats] = useState<any>(null);
  const [profileType, setProfileType] = useState({
    label: 'All',
    value: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [profileTypes, setProfileTypes] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const fetchProfileTypes = async () => {
    try {
      const response = await reports.getProfileTypes();
        setProfileTypes(response);
      }
     catch (error) {
      console.error('Error fetching profile types:', error);
    }
  };

  const fetchProfileData = async () => {
    setLoader(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await reports.getProfileData(0, userData.Id, false)
      if (response.status === 200) {
        setProfileData(response.data.Result);
        setFilteredProfiles(response.data.Result)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProfileData([])
    } finally {
      setLoader(false);
    }
  };

  const fetchNewsletterStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await getNewsletterStats(userData.Token);
      setNewsletterStats(response || {});
    } catch (error) {
      console.error('Error fetching newsletter stats:', error);
      setNewsletterStats({});
    }
  };

  useEffect(() => {
    fetchProfileTypes();
    fetchProfileData();
    fetchNewsletterStats();
  }, []);

  const handleProfileTypeChange = (selectedOption) => {
    setProfileType(selectedOption);
  };

  useEffect(() => {
    if (profileType.label == 'All') {
      setFilteredProfiles(profileData)
    }
    else {
      setFilteredProfiles(profileData.filter(item => item.ProfileType === profileType.label))
    }
    setCurrentPage(1)
  }, [profileType, profileData])

  const totalPages = Math.ceil(profileData.length / pageSize);

  // Slice the filtered contracts to show the current page
  const paginatedData = filteredProfiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size) => {
    setPageSize(Number(size)); // Update pageSize and convert to a number
    setCurrentPage(1); // Reset current page to 1 when page size changes
  };

  function handleDownload() {
    const fileName = 'profiles.xlsx';
    const headers = [
      "S.No.",
      "Name",
      "Username",
      "Email",
      "Phone Number",
      "Profile Type",
      "City",
      "Country",
      "Member Since",
      "Subscription Plan",
      "Subscription Status",
      "Billing Frequency"
    ];

    // Map the data to match header order
    const formattedData = paginatedData.map((profile,i) => ({
      "S.No." : i+1,
      "Name": profile.Name,
      "Username": profile.UserName,
      "Email": profile.Email,
      "Phone Number": profile.PhoneNumber,
      "Profile Type": profile.ProfileType,
      "City" : profile.City,
      "Country" : profile.Country,
      "Member Since" : profile.MemberSince,
      "Subscription Plan": profile.SubscriptionPlanType,
      "Subscription Status": profile.SubscriptionStatus,
      "Billing Frequency": profile.BillingFrequency
    }));

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profiles');

    // Convert to Blob and download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(file, fileName);
  }

  return loader ? (
    <Loader />
  ) : (
    <div className="p-6 tracking-wide">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-5">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`py-4 px-1 border-b-2 text-[17px] ${activeTab === 'profiles' ? 'border-[#0B1636] font-semibold text-[#0B1636]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Profiles
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`py-4 px-1 border-b-2 text-[17px] ${activeTab === 'newsletter' ? 'border-[#0B1636] font-semibold text-[#0B1636]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Newsletter
            </button>
          </nav>
        </div>

        {activeTab === 'profiles' && (
          <div>
            <label className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mt-8 mb-3">
              Profiles
            </label>
      <div className="w-full flex flex-wrap justify-between items-center gap-1 mt-2">
        <div className='min-w-[250px] inline-block'>
          <CustomSelect
            placeholder="Select Profile Type"
            options={profileTypes.map((type) => ({
              value: type.Id,
              label: type.UserProfileName,
            }))}
            onChange={handleProfileTypeChange}
            value={profileType}
            className="w-auto"
          />
        </div>
        <Button
          className={`bg-[#2A4FC1] text-white font-medium py-2 px-4 rounded`}
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full table-fixed bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                S.No.
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Username
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Phone Number
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Profile Type
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                City
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Country
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Member Since
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Subscription Plan
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Subscription Status
              </th>
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Billing Frequency
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((profile, index) => (
                <tr key={index}>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {index+1}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.Name}
                  </td><td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.UserName}
                  </td><td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.Email}
                  </td><td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.PhoneNumber}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.ProfileType}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.City}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.Country}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.MemberSince.split("T")[0]}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.SubscriptionPlanType}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.SubscriptionStatus}
                  </td><td className="px-2 py-3 text-sm text-gray-800 border-t">
                    {profile.BillingFrequency}
                  </td>
                </tr>
              ))
            ) : (
              <p className='mt-5 text-center'>No profiles available</p>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 hidden md:flex items-center gap-2">
          <p>Shows</p>
          <CustomSelect
            options={[10, 20, 50, 100].map((size) => ({
              value: size.toString(),
              label: `${size}`,
            }))}
            onChange={(option) => handlePageSizeChange(option.value)}
            value={{ label: pageSize.toString(), value: pageSize.toString() }}
            className="w-20"
            placeholder="10"
          />

          <p>entries</p>
        </div>
        <Pagination
          total={filteredProfiles.length}
          show={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
          </div>
        )}

        {activeTab === 'newsletter' && (
          <div className="mt-6">
            <label className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-3">
              Newsletter Subscription Stats
            </label>

            {newsletterStats ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm font-medium">Total Subscriptions</h3>
                    <p className="text-3xl font-bold text-[#0B1636] mt-2">
                      {newsletterStats.TotalSubscriptions || 0}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm font-medium">Active Subscriptions</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {newsletterStats.ActiveSubscriptions || 0}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm font-medium">Unsubscribed</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {newsletterStats.UnsubscribedCount || 0}
                    </p>
                  </div>
                </div>

                {/* By Profile Type */}
                <div className="mt-8">
                  <h3 className="text-black-500 text-lg font-semibold mb-4">By Profile Type</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                            Profile Type
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                            Total Subscriptions
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                            Active
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                            Unsubscribed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterStats.ByProfileType?.map((stat: any) => (
                          <tr key={stat.ProfileTypeId}>
                            <td className="px-4 py-3 text-sm text-gray-800 border-t">
                              {stat.ProfileTypeName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800 border-t">
                              {stat.TotalSubscriptions}
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600 border-t font-medium">
                              {stat.ActiveSubscriptions}
                            </td>
                            <td className="px-4 py-3 text-sm text-red-600 border-t font-medium">
                              {stat.UnsubscribedCount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Subscriptions */}
                <div className="mt-8">
                  <h3 className="text-black-500 text-lg font-semibold mb-4">Recent Subscriptions</h3>
                  <div className="overflow-x-auto">
                    {newsletterStats.RecentSubscriptions?.length > 0 ? (
                      <table className="min-w-full bg-white shadow rounded-lg">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                              Email
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                              Profile Type
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                              Subscribed Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {newsletterStats.RecentSubscriptions.map((sub: any) => (
                            <tr key={sub.Id}>
                              <td className="px-4 py-3 text-sm text-gray-800 border-t">
                                {sub.Name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800 border-t">
                                {sub.Email}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800 border-t">
                                {sub.ProfileType}
                              </td>
                              <td className="px-4 py-3 text-sm border-t">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${sub.IsSubscribed
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                  {sub.IsSubscribed ? 'Active' : 'Unsubscribed'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800 border-t">
                                {new Date(sub.CreatedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center text-gray-500">No recent subscriptions</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-5 text-center">Loading newsletter data...</p>
            )}
          </div>
        )}
    </div>
  );
};

export default Reports;