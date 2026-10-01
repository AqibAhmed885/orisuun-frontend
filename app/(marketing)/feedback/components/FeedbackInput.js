'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { saveFeedbackInput } from '../../../api/marketing/feedback';
import { FeedbackAccord } from '../../../../components/marketing/Accordion';
import { feedbackInput } from '../../../../data/marketing';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedbaackData } from '@/data/slices/user-slice';
const FeedbackInput = () => {
  const dispatch = useDispatch();
  const { feedbackData } = useSelector((state) => state.user);

  // Initialize responses with the feedback data if available
  const [responses, setResponses] = useState({
    Do_you_find_error: feedbackData?.Do_you_find_error || '',
    Think_about_our_branding: feedbackData?.Think_about_our_branding || '',
    Suggestion_related_website: feedbackData?.Suggestion_related_website || '',
    Did_we_get_right: feedbackData?.Did_we_get_right || '',
    Think_of_the_orisuun_concept: feedbackData?.Think_of_the_orisuun_concept || '',
    Feature_suggestions_do_you_have: feedbackData?.Feature_suggestions_do_you_have || '',
    Share_thought_about_orisuun: feedbackData?.Share_thought_about_orisuun || ''
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleAnswerSubmit = async (question, answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [question]: answer
    }));

    const payload = {
      Id: feedbackData ? feedbackData?.Id : undefined,
      Do_you_find_error: question === "Did you find any typos or errors on our site?" ? answer : responses.Do_you_find_error,
      Think_about_our_branding: question === "Please share any other thought you have about Orisuun." ? answer : responses.Think_about_our_branding,
      Suggestion_related_website: question === "What feature suggestions do you have?" ? answer : responses.Suggestion_related_website,
      Did_we_get_right: question === "What did we get right?" ? answer : responses.Did_we_get_right,
      Think_of_the_orisuun_concept: question === "What do you think of the Orisuun concept?" ? answer : responses.Think_of_the_orisuun_concept,
      Feature_suggestions_do_you_have: question === "What feature suggestions do you have?" ? answer : responses.Feature_suggestions_do_you_have,
      Share_thought_about_orisuun: question === "Tell us what you think about our branding, please." ? answer : responses.Share_thought_about_orisuun,
    };

    try {
      const result = await saveFeedbackInput(payload);
      dispatch(addFeedbaackData(result));
      toast.success("Your feedback has been saved. Thank you!", { containerId: "containerA" });
      setIsOpen(true);
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback");
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <div
        className="w-[90%] small-500:w-full md:w-[70%] mx-auto mt-12"
        data-aos="fade-up"
      >
        {feedbackInput.map((item, i) => (
          <FeedbackAccord
            key={i}
            question={item?.question}
            initialAnswer={responses[item.question]} // Prepopulate with current response
            onSubmit={(answer) => handleAnswerSubmit(item.question, answer)}
          />
        ))}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed top-5 right-5 z-[500]"
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

          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Response Submitted
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your response has been recorded!
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FeedbackInput;
