import Card from '../../../../components/marketing/Card/Card';
import { cardData } from '../../../../data/marketing/how-you-can-help-us';
import { useState, useEffect } from 'react';

const TopContent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="md:mt-[91px] mt-[60px]">
      <div className={`lg:px-[80px] px-4 mx-auto text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex flex-col gap-20">
          <div className="flex flex-col gap-6">
            <h1 className="md:text-[64px] text-[36px] leading-[43.2px] font-semibold md:leading-[110%] text-blue-strong small-500:max-w-[288px] text-center mx-auto">
              Help us build Orisuun!
            </h1>
            <p className="md:text-xl text-[16px] font-medium leading-[150%] text-[#5B657B] mx-auto max-w-[457px]">
              We need you. We need your insights, your participation, your
              connections, your patience, and your faith.
            </p>
          </div>
          <div className="flex flex-col gap-8 md:gap-10">
            <h2 className="md:text-[40px] text-[24px] font-semibold leading-[44px] text-blue-strong">
              Be a Connector
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
              {cardData.map((card, index) => (
                <div
                  key={card.id}
                  className={`transition-all duration-1000 delay-${index * 200} flex ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <Card
                    imageSrc={card.imageSrc}
                    title={card.title}
                    description={card.description}
                    containerClassName={card.containerClassName}
                    titleClassName={card.titleClassName}
                    descriptionClassName={card.descriptionClassName}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopContent;
