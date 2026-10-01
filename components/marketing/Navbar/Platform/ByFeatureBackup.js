import Link from 'next/link';
import { featureAndFunction } from '../../../../data/marketing/NavData';

const ByFeatureBackup = ({ closePopover }) => {
  const boldifyText = (text) => {
    const boldTextMap = [
      { word: 'Find', bold: true },
      { word: 'be found by', bold: true },
      { word: 'Raise money', bold: true },
      { word: 'Cut costs', bold: true },
      { word: 'Form teams', bold: true },
      { word: 'Group chat', bold: true },
      { word: 'Feedback', bold: true },
      { word: 'Reviews', bold: true },
      { word: 'Conduct business safely', bold: true },
      { word: 'Co-founders', bold: true },
      { word: 'Board members', bold: true },
      { word: 'Business development', bold: true },
      { word: 'Connect', bold: true },
    ];

    boldTextMap.forEach(({ word, bold }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      text = text.replace(
        regex,
        (match) => (bold ? `<span class="font-bold">${match}</span>` : match),
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {featureAndFunction.map((item, i) => (
        <Link href={item.link} onClick={closePopover} key={i} className="pt-0">
          <div className="flex gap-2 px-3 py-2.5 rounded-xl bg-[#F1F2F2]/60 mb-4">
            <h6 className="text-blue-strong font-bold w-full">
              <div className="w-full inline-block">{item.name}</div>
            </h6>
          </div>
          {item.subOptions.map((option, i) => (
            <div
              className="font-medium text-blue-strong flex flex-col w-full gap-3"
              key={i}
            >
              <p className="group hover:bg-[#F0F7FD]/60 hover:rounded-md px-3 py-2.5 flex items-center justify-between">
                {boldifyText(option)}
              </p>
            </div>
          ))}
        </Link>
      ))}
    </div>
  );
};

export default ByFeatureBackup;
