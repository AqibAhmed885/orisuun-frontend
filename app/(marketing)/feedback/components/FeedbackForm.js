'use client';
import {
  statementApply,
} from '../../../../data/marketing';
import { useState, Fragment, useEffect } from 'react';
import { Field, Label, Radio, RadioGroup, Dialog, Transition } from '@headlessui/react';
import { Button } from '../../../../components/marketing';
import { JoinSection, FeaturesSection, StatementsSection } from './QuestionSections';
import { submitFeedback } from '../../../api/marketing/feedback';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedbaackData } from '@/data/slices/user-slice';
const FeedbackForm = () => {
  const { feedbackData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const joinedOptions = ['Yes', 'No'];
  const [selected, setSelected] = useState('');
  const [formData, setFormData] = useState({
    joinReason: [],
    notJoinedReasons: [],
    mightJoinReasons: [],
    interestingFeatures: [],
    upcomingFeatures: [],
    statementApply: {},
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isValidate, setIsValidate] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    joinReason: '',
    notJoinedReasons: '',
    interestingFeatures: '',
    upcomingFeatures: '',
    statementApply: '',
  });

  const handleCheckboxChange = (name, value) => {
    setFormData((prevState) => {
      const currentValues = prevState[name];
      const isChecked = currentValues.includes(value);
      if (!isChecked && currentValues.length >= 3) {
        return prevState;
      }
      const updatedArray = isChecked
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prevState, [name]: updatedArray };
    });
  };

  const getSelectionOrder = (name, value) => {
    const index = formData[name].indexOf(value);
    return index !== -1 ? index + 1 : null;
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      statementApply: { ...prevState.statementApply, [name]: value },
    }));
  };

  const validateRequiredCheckboxes = () => {
    const newErrorMessages = {
      joinReason: '',
      notJoinedReasons: '',
      interestingFeatures: '',
      upcomingFeatures: '',
      statementApply: '',
    };
    if (selected === 'Yes' && formData.joinReason.length === 0) {
      newErrorMessages.joinReason = 'Please select at least one reason for joining.';
    }

    if (selected === 'No' && formData.notJoinedReasons.length === 0) {
      newErrorMessages.notJoinedReasons = 'Please select at least one reason for not joining.';
    }

    if (formData.interestingFeatures.length === 0) {
      newErrorMessages.interestingFeatures = 'Please select at least one feature that is interesting to you.';
    }

    if (formData.upcomingFeatures.length === 0) {
      newErrorMessages.upcomingFeatures = 'Please select at least one upcoming feature that is interesting to you.';
    }

    const allStatementsAnswered = statementApply.every(
      (statement) => formData.statementApply[statement?.label]
    );

    if (!allStatementsAnswered) {
      newErrorMessages.statementApply = 'Please select an answer for all statements.';
    }

    setErrorMessages(newErrorMessages);
    return !Object.values(newErrorMessages).some((message) => message);
  };

  useEffect(() => {
    if (isValidate) {
      validateRequiredCheckboxes();
    }
  }, [formData, isValidate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValidate(true);
    if (!validateRequiredCheckboxes()) {
      return;
    }

    const payload = {
      Id: feedbackData ? feedbackData?.Id : undefined,
      Have_you_joined: selected,
      Why_did_joined: formData.joinReason.join(','),
      Why_did_not_joined: formData.notJoinedReasons.join(','),
      Might_join_later: formData.mightJoinReasons.join(','),
      Current_most_interesting_feature: formData.interestingFeatures.join(','),
      Current_next_most_interesting_feature: formData.upcomingFeatures.join(','),
      // Announced_most_interesting_feature: "string",
      Will_you_come_back: formData.statementApply['I will come back to this website'],
      Orisuun_branding: formData.statementApply['I like Orisuun’s branding'],
      Easy_site_navigate: formData.statementApply['Site is easy to navigate'],
      Adequately_informative: formData.statementApply['Site is adequately informative for me'],
      Orisuun_trustworthy_organization: formData.statementApply['I believe Orisuun is a trustworthy organization'],
      Concept_works: formData.statementApply['Orisuun as a concept works'],
      Current_features: formData.statementApply['I like Orisuun\'s current features more than its announced features'],
      Announced_features: formData.statementApply['How likely are you to recommend Orisuun to friends, family, or colleagues?'],
    }

    try {
      const result = await submitFeedback(payload);
      dispatch(addFeedbaackData(result));
      toast.success("Your feedback has been saved. Thank you!", { containerId: "containerA" });
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <form
        className="md:border border-[#F1F2F2] md:shadow-md small-500:shadow-none w-[90%] small-500:w-full md:w-[70%] mx-auto md:mt-12 mt-20 md:p-10 md:mb-[100px] mb-[120px] space-y-8"
        data-aos="fade-up"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <h5 className="text-blue-strong text-3xl font-semibold w-full">
            Have you joined Orisuun?
          </h5>
          <RadioGroup
            value={selected}
            onChange={setSelected}
            aria-label="Server size"
            className="flex gap-2 !mt-5"
          >
            {joinedOptions.map((join, i) => (
              <Field key={i}>
                <Radio
                  value={join}
                  className="group font-medium py-1.5 px-5 border border-[#B2B3B3] text-[#6E6E6E] rounded-[54px] data-[checked]:bg-[#F2F7FC] data-[checked]:border-nav-blue data-[checked]:text-nav-blue data-[checked]:font-semibold cursor-pointer"
                >
                  <Label>{join}</Label>
                </Radio>
              </Field>
            ))}
          </RadioGroup>
        </div>

        <JoinSection
          selected={selected}
          formData={formData}
          handleCheckboxChange={handleCheckboxChange}
          getSelectionOrder={getSelectionOrder}
          errorMessages={errorMessages}
        />

        <FeaturesSection
          formData={formData}
          handleCheckboxChange={handleCheckboxChange}
          getSelectionOrder={getSelectionOrder}
          errorMessages={errorMessages}
        />

        <StatementsSection
          formData={formData}
          handleRadioChange={handleRadioChange}
          errorMessages={errorMessages}
        />

        <div className="grid justify-end">
          <Button type="submit">Submit feedback</Button>
        </div>
      </form>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[500]"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-end p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all mt-4 mr-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Feedback Submitted
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Thank you for your feedback! Your responses have been recorded.
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button type="button" onClick={() => setIsOpen(false)}>
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FeedbackForm;