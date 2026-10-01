import Button from '@/components/ui/button';
import Featured from '@/icons/verification/featured';
import Like from '@/icons/verification/like';
import Megaphone from '@/icons/verification/megaphone';
import Money from '@/icons/verification/money';
import StyledTick from '@/icons/verification/styled-tick';
import Tag from '@/icons/verification/tag';
import Tick from '@/icons/verification/tick';
import Visibility from '@/icons/verification/visibility';
import React, {
  Dispatch,
  SetStateAction,
} from 'react';
import { RootState } from '@/data/store';
import { useSelector } from 'react-redux';
import Script from 'next/script';
import Rejected from '@/icons/verification/rejected';
import InProgress from '@/icons/verification/in-progress';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const VerificationStart: React.FC<IProps> = ({ step, setStep }) => {

  const { verificationData } = useSelector((state: RootState) => state.user);


  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://www.paypal.com/sdk/js?client-id=AaUvowFTOcB5La2vMnaWOsGyhZJMNUwRibg4wLIZ2IWTdl9fuG_hAppYHztt5Qd4EuojyYQBJzmfshRN"
        data-sdk-integration-source="button-factory"
      ></Script>

      <div className="grid grid-cols-8 gap-5 p-4 md:p-6">
        <div className="col-span-8 my-4 lg:col-span-4 md:mx-4 md:my-11">
          <div className="mb-6">
            <StyledTick className="mb-2 text-green-700" />
            <h1 className="font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">{`Let's Get You Verified!`}</h1>
          </div>
          <div className="mb-10">
            <h3 className="mb-4 font-semibold text-omblue-800 text-h7 2xl:text-scaled-h7">
              Verification Benefits
            </h3>
            <ul className="flex flex-col gap-4 font-medium text-blue-400 text-h8 2xl:text-scaled-h8">
              <li className="flex items-center gap-2">
                <Visibility />
                <p>2x-3x visibility</p>
              </li>
              <li className="flex items-center gap-2">
                <Like />
                <p>Increased credibility</p>
              </li>
              <li className="flex items-center gap-2">
                <Featured />
                <p>The chance to be featured on our pages</p>
              </li>
              <li className="flex items-center gap-2">
                <Money />
                <p>The ability to launch a fundraiser</p>
              </li>
              <li className="flex items-center gap-2">
                <Tag />
                <p>Access to the partner discount portal</p>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="mb-4 font-semibold text-omblue-800 text-h7 2xl:text-scaled-h7">
              To apply to become verified, you must
            </h3>
            <ul className="flex flex-col gap-4 font-medium text-blue-400 text-h8 2xl:text-scaled-h8">
              <li className="flex items-center gap-2">
                <Tick />
                <p>Be a premium member</p>
              </li>
              <li className="flex items-center gap-2">
                <Tick />
                <p>Submit the required documentation</p>
              </li>
              <li className="flex items-center gap-2">
                <Tick />
                <p>
                  Pay the review fee :{' '}
                  <span className="font-semibold cursor-pointer text-h5 2xl:text-scaled-h5 text-omblue-500">
                    $99
                  </span>
                </p>
              </li>
            </ul>
          </div>
          {/* <Note text="For team verifications, each member of the team must be individually verified. Verifications may require a video call." /> */}
        </div>
        <div className="flex flex-col col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4 md:my-11">
          <div className="flex-grow mb-4">
            <div className="flex flex-col w-full gap-4 p-6 border rounded-lg border-ol-blue-100 bg-olblue-50">
              <Megaphone />
              <h4 className="font-semibold text-h5 2xl:text-scaled-h5 text-olblue-800">
                Disclaimer / Statement on documents
              </h4>
              <p className="font-medium text-h8 2xl:text-scaled-h8 text-olblue-800">
                Although we do take every measure to protect your documents
                while they are in our possession and delete them after 90 days,
                we do ask, for your protection and as a matter of good data
                hygiene, that you not send any sensitive documents we did not
                ask for and that you redact any non-pertinent sensitive personal
                information in the documents we do need (e.g., personal
                addresses, etc.).
              </p>
            </div>
          </div>
          <div className="flex-grow mb-4">
            {verificationData?.Verification_status === 'Verify' && <div className="flex flex-col w-full gap-4 p-6 border rounded-lg border-green-300 bg-green-50">
              {/* <Status /> */}
              <div className='flex items-center justify-between '>
                <h4 className="font-semibold text-h5 2xl:text-scaled-h5 text-green-800">
                  Verification Status
                </h4>
                <p className="font-medium flex items-center gap-2 text-h8 2xl:text-scaled-h8 text-black-800">
                  <StyledTick className="text-green-700" />
                  <span>Verfied</span>
                </p>
              </div>
              <p className="font-medium text-h8 2xl:text-scaled-h8 text-black-300">
                Your Profile is verified.
              </p>
            </div>}
            {verificationData?.Verification_status === 'InProgress' && <div className="flex flex-col w-full gap-4 p-6 border rounded-lg border-orange-300 bg-orange-50">
              <div className='flex items-center justify-between '>
                <h4 className="font-semibold text-h5 2xl:text-scaled-h5 text-orange-800">
                  Verification Status
                </h4>
                <p className="font-medium flex items-center gap-2 text-h8 2xl:text-scaled-h8 text-black-800">
                  <InProgress className="text-orange-700" />
                  <span>In Progress</span>
                </p>
              </div>
              <p className="font-medium text-h8 2xl:text-scaled-h8 text-black-300">
                Currently your profile is in the moderation process which is under review.
              </p>
            </div>}
            {verificationData?.Verification_status === 'Rejected' && <div className="flex flex-col w-full gap-4 p-6 border rounded-lg border-red-300 bg-red-50">
              <div className='flex items-center justify-between '>
                <h4 className="font-semibold text-h5 2xl:text-scaled-h5 text-red-800">
                  Verification Status
                </h4>
                <p className="font-medium flex items-center gap-2 text-h8 2xl:text-scaled-h8 text-black-800">
                  <Rejected className="text-red-700" />
                  <span>Rejected</span>
                </p>
              </div>
              <p className="font-medium text-h8 2xl:text-scaled-h8 text-black-300">
                Your profile has been rejected for the any reason
              </p>
            </div>}
          </div>
          {(verificationData?.Verification_status !== 'Verify' && verificationData?.Verification_status !== 'InProgress') && <div className="py-4 flex justify-end">
            <Button
              className="mt-auto ml-auto px-4 py-3 bg-omblue-500 md:w-[170px] rounded-md text-h9 2xl:text-scaled-h9 font-semibold btn-secondary text-white w-full"
              title="Agree"
              onClick={() => setStep(step + 1)}
            />
          </div>}
        </div>
      </div>

    </>
  );
};

export default VerificationStart;
