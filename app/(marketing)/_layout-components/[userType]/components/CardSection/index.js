import { usersTypes } from "../../../../../../data/marketing";
import { ImageFirst } from "./ImageFirst";
import { TextFirst } from "./TextFirst";

const CardSection = ({ userType }) => {
  return (
    <section>
      {usersTypes.map((item, i) => (
        <div key={i} className='flex flex-col gap-16 md:gap-32'>
          {item?.userType === userType && (
            <>
              {item?.sections?.section1 && (
                <ImageFirst
                  image={item?.sections?.section1?.image}
                  heading={item?.sections?.section1?.heading}
                  paragraph1={item?.sections?.section1?.paragraph1}
                  paragraph2={item?.sections?.section1?.paragraph2}
                  paragraph3={item?.sections?.section1?.paragraph3}
                  buttonText={item?.sections?.section1?.buttonText}
                />
              )}
              {item?.sections?.section2 && (
                <TextFirst
                  image={item?.sections?.section2?.image}
                  heading={item?.sections?.section2?.heading}
                  paragraph1={item?.sections?.section2?.paragraph1}
                  paragraph2={item?.sections?.section2?.paragraph2}
                  paragraph3={item?.sections?.section2?.paragraph3}
                  buttonText={item?.sections?.section2?.buttonText}
                />
              )}
              {item?.sections?.section3 && (
                <ImageFirst
                  image={item?.sections?.section3?.image}
                  heading={item?.sections?.section3?.heading}
                  paragraph1={item?.sections?.section3?.paragraph1}
                  paragraph2={item?.sections?.section3?.paragraph2}
                  paragraph3={item?.sections?.section3?.paragraph3}
                  buttonText={item?.sections?.section3?.buttonText}
                />
              )}
              {item?.sections?.section4 && (
                <TextFirst
                  image={item?.sections?.section4?.image}
                  heading={item?.sections?.section4?.heading}
                  paragraph1={item?.sections?.section4?.paragraph1}
                  paragraph2={item?.sections?.section4?.paragraph2}
                  paragraph3={item?.sections?.section4?.paragraph3}
                  buttonText={item?.sections?.section4?.buttonText}
                />
              )}
              {item?.sections?.section5 && (
                <ImageFirst
                  image={item?.sections?.section5?.image}
                  heading={item?.sections?.section5?.heading}
                  paragraph1={item?.sections?.section5?.paragraph1}
                  paragraph2={item?.sections?.section5?.paragraph2}
                  paragraph3={item?.sections?.section5?.paragraph3}
                  buttonText={item?.sections?.section5?.buttonText}
                />
              )}
              {item?.sections?.section6 && (
                <TextFirst
                  image={item?.sections?.section6?.image}
                  heading={item?.sections?.section6?.heading}
                  paragraph1={item?.sections?.section6?.paragraph1}
                  paragraph2={item?.sections?.section6?.paragraph2}
                  paragraph3={item?.sections?.section6?.paragraph3}
                  buttonText={item?.sections?.section6?.buttonText}
                />
              )}
            </>
          )}
        </div>
      ))}
    </section>
  );
};

export default CardSection;
