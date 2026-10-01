'use client';

import { CustomCheckbox, MightJoinCheckbox, Radios } from './FormComponents';
import {
    interestingFeatures,
    joinReason,
    notJoinedReasons,
    mightJoinReasons,
    statementApply,
    upcomingFeatures,
} from '../../../../data/marketing';

export const JoinSection = ({ selected, formData, handleCheckboxChange, getSelectionOrder, errorMessages }) => {
    return (
        <>
            {selected === 'Yes' && (
                <div className="space-y-2">
                    <h5 className="text-blue-strong text-xl font-semibold w-full">
                        Why did you join?
                    </h5>
                    <p className="text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                        Select three options in order of importance
                    </p>
                    {joinReason.map((data, i) => (
                        <CustomCheckbox
                            key={i}
                            label={data?.label}
                            checked={formData.joinReason.includes(data?.label)}
                            order={getSelectionOrder('joinReason', data?.label)}
                            onChange={() => handleCheckboxChange('joinReason', data?.label)}
                        />
                    ))}
                    {errorMessages.joinReason && (
                        <div className="text-red-500 font-medium text-[18px]">
                            {errorMessages.joinReason}
                        </div>
                    )}
                </div>
            )}

            {selected === 'No' && (
                <>
                    <div className="space-y-2">
                        <h5 className="text-blue-strong text-xl font-semibold w-full">
                            Why didn&apos;t you join?
                        </h5>
                        <p className="text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                            Select three options in order of importance
                        </p>
                        {notJoinedReasons.map((data, i) => (
                            <CustomCheckbox
                                key={i}
                                label={data?.label}
                                checked={formData.notJoinedReasons.includes(data?.label)}
                                order={getSelectionOrder('notJoinedReasons', data?.label)}
                                onChange={() => handleCheckboxChange('notJoinedReasons', data?.label)}
                            />
                        ))}
                        {errorMessages.notJoinedReasons && (
                            <div className="text-red-500 font-medium text-[18px]">
                                {errorMessages.notJoinedReasons}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 mt-4">
                        <h5 className="text-blue-strong text-xl font-semibold w-full">
                            Do you think you might join later?
                        </h5>
                        {mightJoinReasons.map((data, i) => (
                            <MightJoinCheckbox
                                key={i}
                                label={data?.label}
                                checked={formData.mightJoinReasons.includes(data?.label)}
                                onChange={() => handleCheckboxChange('mightJoinReasons', data?.label)}
                            />
                        ))}
                        {errorMessages.mightJoinReasons && (
                            <div className="text-red-500 font-medium text-[18px]">
                                {errorMessages.mightJoinReasons}
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export const FeaturesSection = ({ formData, handleCheckboxChange, getSelectionOrder, errorMessages }) => {
    return (
        <>
            <div className="space-y-2">
                <h5 className="text-blue-strong text-xl font-semibold w-full">
                    Which of our features are most interesting to you?
                </h5>
                <p className="text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                    Select three options in order of importance
                </p>
                <div className="flex flex-col gap-4">
                    {interestingFeatures.map((data, i) => (
                        <CustomCheckbox
                            key={i}
                            label={data?.label}
                            checked={formData.interestingFeatures.includes(data?.label)}
                            order={getSelectionOrder('interestingFeatures', data?.label)}
                            onChange={() => handleCheckboxChange('interestingFeatures', data?.label)}
                        />
                    ))}
                </div>
                {errorMessages.interestingFeatures && (
                    <div className="text-red-500 font-medium text-[18px]">
                        {errorMessages.interestingFeatures}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <h5 className="text-blue-strong text-xl font-semibold w-full">
                    Which of our announced upcoming features is most interesting to you?
                </h5>
                <p className="text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                    Select three options in order of importance
                </p>
                {upcomingFeatures.map((data, i) => (
                    <CustomCheckbox
                        key={i}
                        label={data?.label}
                        checked={formData.upcomingFeatures.includes(data?.label)}
                        order={getSelectionOrder('upcomingFeatures', data?.label)}
                        onChange={() => handleCheckboxChange('upcomingFeatures', data?.label)}
                    />
                ))}
                {errorMessages.upcomingFeatures && (
                    <div className="text-red-500 font-medium text-[18px]">
                        {errorMessages.upcomingFeatures}
                    </div>
                )}
            </div>
        </>
    );
};

export const StatementsSection = ({ formData, handleRadioChange, errorMessages }) => {
    return (
        <div className="space-y-4 flex flex-col gap-[12px] md:gap-[24px]">
            <h5 className="text-blue-strong text-xl text-[20px] w-full font-semibold">
                Please tell us how these statements apply to you
            </h5>
            <div className="md:grid md:grid-cols-10 hidden md:place-items-center">
                <div className="col-span-1 md:col-span-3 md:block hidden" />
                <p className="text-[#6E6E6E] font-medium text-[18px] text-left">
                    Strongly <br /> disagree
                </p>
                <div className="col-span-3 md:col-span-2 md:block hidden" />
                <p className="text-[#6E6E6E] font-medium text-[18px] md:block hidden text-center">
                    Neutral
                </p>
                <div className="col-span-3 md:col-span-2 md:block hidden" />
                <p className="text-[#6E6E6E] font-medium text-[18px] md:text-left text-right">
                    Strongly <br /> agree
                </p>
            </div>
            <div className="flex flex-col gap-[32px] md:gap-[20px]">
                {statementApply.map((data, i) => (
                    <div key={i}>
                        <div className="grid grid-cols-10 md:gap-y-2 gap-4 mb-4 items-center">
                            <p className="col-span-10 md:col-span-3 text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                                {data?.label}
                            </p>
                            <div className="col-span-10 md:col-span-7 md:grid grid-cols-7 flex justify-between items-center">
                                <Radios
                                    name={data?.label}
                                    value={formData.statementApply[data?.label]}
                                    onChange={handleRadioChange}
                                />
                            </div>
                        </div>
                        <div className="md:hidden flex justify-between items-center">
                            <div className="col-span-1 md:col-span-3 md:block hidden" />
                            <p className="text-[#6E6E6E] font-medium text-[12px] text-left">
                                Strongly <br /> disagree
                            </p>
                            <div className="col-span-3 md:col-span-2 md:block hidden" />
                            <p className="text-[#6E6E6E] font-medium text-[18px] md:block hidden text-center">
                                Neutral
                            </p>
                            <div className="col-span-3 md:col-span-2 md:block hidden" />
                            <p className="text-[#6E6E6E] font-medium text-[12px] md:text-left text-right">
                                Strongly <br /> agree
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {errorMessages.statementApply && (
                <div className="text-red-500 font-medium text-[18px]">
                    {errorMessages.statementApply}
                </div>
            )}
        </div>
    );
};