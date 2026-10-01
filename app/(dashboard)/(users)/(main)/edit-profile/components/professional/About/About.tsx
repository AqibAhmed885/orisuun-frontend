import Editor from './Editor';
import { useFormContext } from "react-hook-form";

const AboutBusiness = ({ProfessionalType}) => {
    const { setValue, watch, register, formState: { errors } } = useFormContext();
    const languages = (watch('Languages')?.split(',') || []).map(lang => lang.trim()).filter(Boolean);

    return (
        <div className='w-[95%] mx-auto bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
            <div className="max-w-full mx-auto">
                <div className="w-[95%] mx-auto bg-white rounded-t-2xl h-auto relative py-4">
                    <div className='pb-5'>
                        <h2 className='text-[16px] font-semibold'>{ProfessionalType == 'firm' ? "About Organization" : "About You"}</h2>
                    </div>

                    <Editor
                        label={ProfessionalType == 'firm' ? "Tell us about organization*" : "Tell us about yourself*"}
                        placeholder={ProfessionalType == 'firm' ? "Describe your organization and what makes your organization unique...": "Describe yourself and what makes you unique..."}
                        name="About"
                    />
                    {typeof errors.About?.message === 'string' && (
                        <p className="mb-5 text-[16px] text-red-600">{errors.About.message}</p>
                    )}

                    <Editor
                        label={ProfessionalType == 'firm' ? "Tell us about your organzation's mission*" : "Tell us about your mission*"}
                        placeholder={ProfessionalType == 'firm' ? "Describe your  organzation's mission" : "Describe your mission"}
                        name="Mission"
                    />
                    {typeof errors.Mision?.message === 'string' && (
                        <p className="mb-5 text-[16px] text-red-600">{errors.Mision.message}</p>
                    )}

                    <Editor
                        label={ProfessionalType == 'firm' ? "Tell us about your organzation's vision*" : "Tell us about your vision*"}
                        placeholder={ProfessionalType == 'firm' ? "Describe your  organzation's vision" : "Describe your vision"}
                        name="Vision"
                    />
                    {typeof errors.Vision?.message === 'string' && (
                        <p className="mb-5 text-[16px] text-red-600">{errors.Vision.message}</p>
                    )}

                    {/* Language Selector */}
                    <div className="mt-4">
                        <h2 className='text-[16px] text-gray-700 font-semibold'>Languages</h2>
                        <h2 className='text-[14px] text-gray-700 font-semibold mb-2'>{ProfessionalType == 'firm' ? "Select all the languages of the organization" : "Select as many language as you speak"}</h2>

                        <div className="w-full border border-gray-300 rounded-md p-2 min-h-[48px] flex flex-wrap gap-2 items-center">
                            {languages.map((lang, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#EFF8FF] text-[#194185] border border-[#B2DDFF] px-3 py-1 rounded-md flex items-center text-[14px] font-medium"
                                >
                                    {lang}
                                    <button
                                        type="button"
                                        className="ml-2 text-[#2357C6] hover:text-gray-200"
                                        onClick={() => {
                                            const updated = languages.filter((_, i) => i !== idx);
                                            setValue('Languages', updated.join(','));
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                placeholder="Select language"
                                className="flex-grow outline-none text-[16px] px-2 py-1"
                                onKeyDown={(e) => {
                                    if ((e.key === 'Enter' || e.key === ',') && e.currentTarget.value.trim()) {
                                        e.preventDefault();
                                        const newLang = e.currentTarget.value.trim();
                                        if (!languages.includes(newLang)) {
                                            const updated = [...languages, newLang];
                                            setValue('Languages', updated.join(','));
                                        }
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            {typeof errors.Languages?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">{errors.Languages.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutBusiness;
