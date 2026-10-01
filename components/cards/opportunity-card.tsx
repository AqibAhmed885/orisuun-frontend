import { apiEndpoint, cn } from '@/utils/utils';
import React, { useCallback } from 'react';
import EditIcon from '@/icons/edit-icon';
import Trash from '@/icons/trash';
import GPS from '@/icons/gps';
import Handyman from '@/icons/handyman';
import CalenderClock from '@/icons/calender-clock';
import AccountTree from '@/icons/account-tree';
import Chip from '../ui/chip';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import {
  getBusinessOpportunityFacilitateList,
  getBusinessOpportunitySeekingList,
} from '@/server-actions/businessDevelopment';

interface IProps {
  id: number;
  onClick: () => void;
  borderless?: boolean;
  opportunity?: any;
  setSelectedOpportunity?: any;
  selectedOpportunity?: any;
  setSelectedOpportunityUserId?: any;
  SetBusinessOpportunityList?: any;
  selected?: any;
}

const OpportunityCard: React.FC<IProps> = ({
  id,
  borderless = false,
  onClick,
  opportunity,
  setSelectedOpportunity,
  setSelectedOpportunityUserId,
  selectedOpportunity,
  SetBusinessOpportunityList,
  selected,
}) => {
  const router = useRouter();
  const handleEdit = async (id) => {
    router.push(`business-development/update/${id}`);
  };


  const fetchBusinessOppotunityLists = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const teamData = JSON.parse(localStorage.getItem('teamData'));
      const data = {
        UserId: (teamData && teamData?.isActive) ? teamData.teamId : userData?.Id,
      };

      if (selected === 'Seeking') {
        const response = await getBusinessOpportunitySeekingList(data);
        const seekingList = response?.data?.BDSeekingList;
        if (seekingList?.length > 0) {
          SetBusinessOpportunityList(seekingList);
          setSelectedOpportunity(seekingList[0]?.BDId);
          setSelectedOpportunityUserId(seekingList[0]?.UserId);
        } else {
          SetBusinessOpportunityList([]); // Handle empty lists
        }
      } else if (selected === 'Facilitate') {
        const response = await getBusinessOpportunityFacilitateList(data);
        const facilitateList = response?.data?.BDFacilitateList;
        if (facilitateList?.length > 0) {
          SetBusinessOpportunityList(facilitateList);
          setSelectedOpportunity(facilitateList[0]?.BDId);
          setSelectedOpportunityUserId(facilitateList[0]?.UserId);
        } else {
          SetBusinessOpportunityList([]); // Handle empty lists
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.Message
      );
      console.error('Error fetching business opportunities:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const willDelete = await swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete this item? This action cannot be undone.',
        icon: 'warning',
        dangerMode: true,
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: 'swal-button--cancel',
            closeModal: true,
          },
          confirm: {
            text: 'Confirm',
            value: true,
            visible: true,
            className: 'swal-button--confirm',
            closeModal: false, // This keeps the modal open until you manually close it
          },
        },
      });

      if (willDelete) {
        // Proceed with deletion
        const res = await axios.post(
          `${apiEndpoint}/BusinessOpportunity/DeleteFacilateData`,
          {
            BDId: id,
          },
          {
            headers: {
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            },
          }
        );

        if (res.status === 200) {
          toast.success(res.data?.Message || 'Deleted successfully');
          fetchBusinessOppotunityLists();
          swal('Deleted!', 'Your item has been deleted!', 'success');
        } else {
          toast.error(res.data?.Message || 'Your opportunity was not deleted');
          swal('Failed!', 'Your opportunity was not deleted ', 'error');
        }
      } else {
        // User canceled the delete action
        swal('Cancelled', 'Your item is safe.', 'info');
      }
    } catch (error) {
      // Handle 404 or other errors
      if (error?.response?.status === 404) {
        toast.error('Item not found (404)');
      } else {
        toast.error(error?.response?.data?.Message || 'Your opportunity was not deleted');
      }
      swal('Failed!', 'Your opportunity was not deleted', 'error');
    }
  };

  return (
    <div
      className={cn(
        'rounded-md p-4',
        selectedOpportunity === opportunity?.BDId
          ? 'border-[#A0BCF9] border-2'
          : 'border-grey-600 border-2',
        { 'border-none': borderless }
      )}
      onClick={() => {
        setSelectedOpportunityUserId(opportunity?.UserId);
        setSelectedOpportunity(opportunity?.BDId);
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="space-y-2">
          <h5
            className="text-h5 2xl:text-scaled-h5 text-olblue-900 font-semibold"
            onClick={onClick}
          >
            {opportunity?.StrategyName
              ? opportunity?.StrategyName
              : 'Market Development'}
          </h5>
          <div className="flex md:flex-row flex-wrap flex-col items-start md:items-center gap-1.5">
            {opportunity?.TacticsName !== '' &&
              opportunity?.TacticsName.split(',')?.map(
                (item: any, index: any) => <Chip key={index} text={item} />
              )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center border border-[#BBCBED] text-[#204FB4]" title='Edit'>
            <EditIcon
              className="w-4 h-4"
              onClick={() => handleEdit(opportunity?.BDId)}
            />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center border border-[#F4C0C5] text-[#C8303F]" title='Delete'>
            <Trash
              className="w-4 h-4"
              onClick={() => handleDelete(opportunity?.BDId)}
            />
          </button>
        </div>
      </div>
      {(opportunity?.bDCitySelectionsDetails?.CityName?.length >0 || opportunity?.bDCitySelectionsDetails?.CountryName?.length>0) && (
        <div className="flex items-start gap-2 mb-5">
           <div title='Location'>
          <GPS className="text-omblue-600 w-6 h-6" />
          </div>
          <div className="text-h9 2xl:text-scaled-h9 text-blue-500 space-y-2 font-medium">
            {opportunity?.bDCitySelectionsDetails?.CityName?.map((city, index) => (
              <div key={`city-${index}`}>{city}</div>
            ))}
            {opportunity?.bDCitySelectionsDetails?.CountryName?.map((country, index) => (
              <div key={`country-${index}`}>{country}</div>
            ))}
          </div>
        </div>
      )}

      {opportunity?.bDIndustryDetails?.length > 0 && (
        <div className="flex items-start gap-2 mb-5">
           <div title='Industries'>
          <Handyman className="text-omblue-600 w-6 h-6" />{' '}
          </div>
          <div className="space-y-2">
            {opportunity?.bDIndustryDetails?.map((data, index) => (
              <p
                className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium"
                key={index}
              >
                {' '}
                {data?.IndustryName}
              </p>
            ))}
            {/* <p className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium">
            Vegetable and Melon Farming
          </p>
          <p className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium">
            Fruit and Tree Nut Farming
          </p> */}
          </div>
        </div>
      )}
      {opportunity?.timeLine && (
        <div className="flex items-center gap-2 mb-5">
           <div title='Timeline'>
          <CalenderClock className="text-omblue-600 w-6 h-6" />{' '}
          </div>
          <p className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium">
            {opportunity?.timeLine}
          </p>
        </div>
      )}
      {opportunity?.OpportunityStructure && (
        <div className="flex items-center gap-2 mb-5">
           <div title='Opportunity Structure'>
          <AccountTree className="text-omblue-600 w-6 h-6" />{' '}
          </div>
          <p className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium">
            {opportunity?.OpportunityStructure}
          </p>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;
