import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Field, RadioGroup } from "@headlessui/react";
import Radio from "@/components/ui/radio";
import { statementApply } from "@/data/marketing";

const CustomCheckbox = ({ label, checked, order, onChange }) => {
    return (
        <div className="flex items-start gap-[10px] ">
            <div className="size-[24px] border rounded">
                <div
                    className={`relative size-[24px]  ${checked ? 'bg-[#2357C6] text-white  ' : 'border-gray-400'
                        }`}
                    onClick={onChange}
                >
                    {checked && (
                        <span className="absolute inset-0 flex items-center justify-center font-bold  p-1 text-[14px]">
                            {order}
                        </span>
                    )}
                </div>
            </div>

            <label className="text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                {label}
            </label>
        </div>
    );
};



const Radios = ({ name, value, onChange }) => {
    const labels = ['-3', '-2', '-1', '0', '1', '2', '3'];
    return (
        <>
            {labels.map((label, i) => (
                <div key={i} className="grid place-items-center">
                    <input
                        type="radio"
                        name={name}
                        id={name + label}
                        value={label}
                        checked={value === label}
                        onChange={onChange}
                        className="md:size-7 size-6"
                    />
                    <label
                        className="text-[#808181] md:text-sm text-[12px] font-medium"
                        htmlFor={name + label}
                    >
                        {label}
                    </label>
                </div>
            ))}
        </>
    );
};

const ShowFeedback = ({ feedbackData }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const [selected, setSelected] = useState(feedbackData?.Have_you_joined || "");


    const formData = {
        joinReason: feedbackData?.Why_did_joined?.split(",") || [],
        notJoinedReasons: feedbackData?.Why_did_not_joined?.split(",") || [],
        mightJoinReasons: feedbackData?.Might_join_later?.split(",") || [],
        interestingFeatures: feedbackData?.Current_most_interesting_feature?.split(",") || [],
        upcomingFeatures: feedbackData?.Current_next_most_interesting_feature?.split(",") || [],
        statementApply: {
            'I will come back to this website': feedbackData?.Will_you_come_back || "",
            'I like Orisuun’s branding': feedbackData?.Orisuun_branding || "",
            'Site is easy to navigate': feedbackData?.Easy_site_navigate || "",
            'Site is adequately informative for me': feedbackData?.Adequately_informative || "",
            'I believe Orisuun is a trustworthy organization': feedbackData?.Orisuun_trustworthy_organization || "",
            'Orisuun as a concept works': feedbackData?.Concept_works || "",
            'I like Orisuun\'s current features more than its announced features': feedbackData?.Current_features || "",
            'How likely are you to recommend Orisuun to friends, family, or colleagues?': feedbackData?.Announced_features || "",
        },
    };

    const getSelectionOrder = (name, value) => {

        const index = formData[name].indexOf(value);
        return index !== -1 ? index + 1 : null;
    };

    // Reset form when feedbackData is available
    useEffect(() => {
        if (feedbackData) {
            reset({
                // Have_you_joined: feedbackData.Have_you_joined || "",
                joinReason: feedbackData.Why_did_joined?.split(",") || [],
                notJoinedReasons: feedbackData.Why_did_not_joined?.split(",") || [],
                mightJoinReasons: feedbackData.Might_join_later?.split(",") || [],
                interestingFeatures: feedbackData.Current_most_interesting_feature?.split(",") || [],
                upcomingFeatures: feedbackData.Current_next_most_interesting_feature?.split(",") || [],
                statementApply: {
                    'I will come back to this website': feedbackData?.Will_you_come_back || "",
                    'I like Orisuun’s branding': feedbackData?.Orisuun_branding || "",
                    'Site is easy to navigate': feedbackData?.Easy_site_navigate || "",
                    'Site is adequately informative for me': feedbackData?.Adequately_informative || "",
                    'I believe Orisuun is a trustworthy organization': feedbackData?.Orisuun_trustworthy_organization || "",
                    'Orisuun as a concept works': feedbackData?.Concept_works || "",
                    'I like Orisuun\'s current features more than its announced features': feedbackData?.Current_features || "",
                    'How likely are you to recommend Orisuun to friends, family, or colleagues?': feedbackData?.Announced_features || "",
                },
            });
            setSelected(feedbackData.Have_you_joined)
        }
    }, [feedbackData, reset]);

    // const onSubmit = (data) => {
    //     const payload = {
    //         Id: feedbackData ? feedbackData?.Id : undefined,
    //         Have_you_joined: selected,
    //         Why_did_joined: data.joinReason.join(","),
    //         Why_did_not_joined: data.notJoinedReasons.join(","),
    //         Might_join_later: data.mightJoinReasons.join(","),
    //         Current_most_interesting_feature: data.interestingFeatures.join(","),
    //         Current_next_most_interesting_feature: data.upcomingFeatures.join(","),
    //         Will_you_come_back: data.statementApply['I will come back to this website'],
    //         Orisuun_branding: data.statementApply['I like Orisuun’s branding'],
    //         Easy_site_navigate: data.statementApply['Site is easy to navigate'],
    //         Adequately_informative: data.statementApply['Site is adequately informative for me'],
    //         Orisuun_trustworthy_organization: data.statementApply['I believe Orisuun is a trustworthy organization'],
    //         Concept_works: data.statementApply['Orisuun as a concept works'],
    //         Current_features: data.statementApply['I like Orisuun\'s current features more than its announced features'],
    //         Announced_features: data.statementApply['How likely are you to recommend Orisuun to friends, family, or colleagues?'],
    //     };
    // };

    const handleCheckboxChange = (field, value) => {
        setValue(field, value);
    };


    return (
        <form
            className="md:border border-[#F1F2F2] min-h-[calc(100vh-200px)]  md:shadow-md small-500:shadow-none w-[90%] small-500:w-full md:w-[70%] mx-auto md:mt-12 mt-20 md:p-10  md:mb-[100px] mb-[120px] space-y-8"
            data-aos="fade-up"
        // onSubmit={handleSubmit(onSubmit)}
        >
            {/* Have You Joined Section */}
            <div className="space-y-4">
                <h5 className="text-blue-strong text-3xl font-semibold w-full">
                    Have you joined Orisuun?
                </h5>
                {selected}
            </div>

            {/* Why did you join? */}
            {selected === 'Yes' && (
                <div className="space-y-2">
                    <h5 className="text-blue-strong text-xl font-semibold  w-full">
                        Why did you join?
                    </h5>
                    {formData.joinReason.map((data, i) => {
                        return (
                            <>
                                <CustomCheckbox
                                    key={i}
                                    label={data}
                                    checked={formData.joinReason.includes(data)}
                                    order={getSelectionOrder('joinReason', data)}
                                />
                            </>
                        )
                    })}
                </div>
            )}

            {/* Why did you not join? */}
            {selected === 'No' && (
                <div className="space-y-2">
                    <h5 className="text-blue-strong text-xl font-semibold  w-full">
                        Why didn&apos;t you join?
                    </h5>
                    {formData.notJoinedReasons.map((data, i) => {
                        return (
                            <>
                                <CustomCheckbox
                                    key={i}
                                    label={data}
                                    checked={formData.notJoinedReasons.includes(data)}
                                    order={getSelectionOrder('notJoinedReasons', data)}
                                />
                            </>
                        )
                    })}
                </div>
            )}

            {/* Might Join Later */}
            {selected === 'Maybe later' && (
                <div className="space-y-2">
                    <h5 className="text-blue-strong text-xl font-semibold  w-full">
                        Do you think you might join later?
                    </h5>
                    {formData.mightJoinReasons.map((data, i) => {
                        return (
                            <>
                                < CustomCheckbox
                                    key={i}
                                    label={data}
                                    checked={formData.mightJoinReasons.includes(data)}
                                    order={getSelectionOrder('mightJoinReasons', data)}
                                // onChange={() =>
                                //     handleCheckboxChange('mightJoinReasons', data)
                                // }
                                />
                            </>
                        )
                    })}
                </div>
            )}

            {/* Interesting Features */}
            <div className="space-y-2">
                <h5 className="text-blue-strong text-xl md:mt-0 mt-10 font-semibold  w-full">
                    Which of our features are most interesting to you?
                </h5>
                {formData.interestingFeatures.map((data, i) => {
                    return (
                        <>
                            < CustomCheckbox
                                key={i}
                                label={data}
                                checked={formData.interestingFeatures.includes(data)}
                                order={getSelectionOrder('interestingFeatures', data)}
                                onChange={() =>
                                    handleCheckboxChange('interestingFeatures', data)
                                }
                            />
                        </>
                    )
                })}

            </div>

            {/* Upcoming Features */}
            <div className="space-y-2">
                <h5 className="text-blue-strong text-xl font-semibold w-full">
                    Next Most Interesting Features
                </h5>
                {formData.upcomingFeatures.map((data, i) => {
                    return (
                        <>
                            < CustomCheckbox
                                key={i}
                                label={data}
                                checked={formData.upcomingFeatures.includes(data)}
                                order={getSelectionOrder('upcomingFeatures', data)}
                            />
                        </>
                    )
                })}
            </div>

            {/* Statements Section */}
            <div className="space-y-4">
                <h5 className="text-blue-strong text-xl font-semibold w-full">
                    Please indicate how much you agree or disagree with the following
                    statements
                </h5>
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
                                />
                            </div>
                        </div>
                        <div className="md:hidden flex justify-between items-center  ">
                            <div className="col-span-1 md:col-span-3 md:block hidden" />
                            <p className="text-[#6E6E6E] font-medium text-[12px] text-left">
                                Strongly <br /> disagree
                            </p>
                            <div className="col-span-3 md:col-span-2 md:block hidden " />
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
        </form >
    );
};

export default ShowFeedback;
