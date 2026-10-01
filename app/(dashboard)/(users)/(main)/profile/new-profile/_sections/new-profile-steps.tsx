import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { apiEndpoint, cn } from '@/utils/utils';
import BasicInformation from './basic-info';
import BusinessInformation from './business-info';
import Qualifications from './qualifications';
import Charts from './charts';
import IndustrySelection from './industry-selection';
import SkillsAndExperiences from './skills-and-experience';
import Verification from './verification';
import Tick from '@/icons/tick';
import AdvocatePhotos from './advocate-photos';
import UserDetailsExperts from './basic-info/expert';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addProfileData } from '@/data/slices/user-slice';
import { toast } from 'react-toastify';
import Loader from '@/components/ui/loader';

type optionTypes = {
  name: string;
  componentName: string;
  id: number;
};
interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  steps: Array<optionTypes>;
  currentUser?: any;
}

const NewProfileSteps: React.FC<IProps> = ({
  steps,
  step,
  setStep,
  currentUser: user,
}) => {
  const [locations, setLocations] = useState([]);
  const [loader, setLoader] = useState(true);
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
  const componentMap: { [key: string]: React.ComponentType<any> } = {
    BasicInformation,
    UserDetailsExperts,
    BusinessInformation,
    SkillsAndExperiences,
    Qualifications,
    Charts,
    IndustrySelection,
    AdvocatePhotos,
    Verification
  };

  const renderComponent = (componentName: string) => {
    const Component = componentMap[componentName];
    return Component ? (
      <Component
        step={step}
        setStep={setStep}
        locations={locations}
        currentUser={currentUser}
        steps={steps}
      />
    ) : null;
  };
  const currentUser = user
    ? user
    : typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const dispatch = useDispatch();
  const fetchProfileData = async () => {
    // if (!currentUser?.UserId) return;

    // const profileType = getProfileTypeCategory(currentUser.UserProfileType);

    // let response;
    try {
      const response = await axios.post(
        `${apiEndpoint}/Profile/ViewUserProfileV1`,
        {
          UserProfileDetailId: currentUser.UserProfileDetailsId,
          UserId: currentUser.Id,
          Username: currentUser.UserName,
        },
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 200) {
        dispatch(addProfileData(response.data.Result));
        setLoader(false);
      } else {
        setLoader(false);
        throw new Error('Failed to fetch profile data');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error fetching profile data:', error);
      // toast('Failed to load profile data', { type: 'error' });
    }
  };

  // }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      fetchProfileData();
    }
  }, [step]);

  return loader ? (
    <Loader />
  ) : (
    <div>
      <ul className={`hidden p-6 ${steps.length == 3 ? 'grid-cols-3' : 'grid-cols-5'} md:grid`}>
        {steps.slice(0, 5).map((item: any, index: any) => (
          <li
            className={cn(
              'flex items-center gap-2 border-b-2 py-2 cursor-pointer',
              item.id === step ? 'border-b-omblue-700' : 'border-b-omblue-100'
            )}
            key={index}
            onClick={() => setStep(item.id)}
          >
            {step < index + 1 ? (
              <p
                className={cn(
                  'w-6 h-6 p-2 rounded-full text-xs border font-medium flex items-center justify-center',
                  item.id === step
                    ? 'border-omblue-500 bg-olblue-50 text-omblue-500'
                    : 'border-omblue-100 bg-transparent text-omblue-300'
                )}
              >
                {++index}
              </p>
            ) : (
              <button className="w-6 h-6 p-1.5 rounded-full bg-omblue-400 flex items-center justify-center">
                <Tick className="text-white" />
              </button>
            )}
            <p
              className={cn(
                'font-semibold text-h7',
                item.id === step ? 'text-omblue-700' : 'text-omblue-300'
              )}
            >
              {item.name}
            </p>
          </li>
        ))}
      </ul>

      <div>
        {steps.map(
          (item: optionTypes) =>
            item.id === step && renderComponent(item.componentName)
        )}
      </div>
    </div>
  );
};

export default NewProfileSteps;
