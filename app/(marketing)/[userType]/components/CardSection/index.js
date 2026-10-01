import { usersTypes } from '../../../../../data/marketing';
import { ImageFirst } from './ImageFirst';
import { TextFirst } from './TextFirst';

const CardSection = ({ userType }) => {
  return (
    <section>
      {userType == 'experts' && (
        <>
          <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>List Your Expertise. Get Matched. Make a Difference</p>
          <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>Create your expert profile and start connecting with founders who need your insight to grow and scale</p>
        </>
      )}
      {userType == 'black-owned-businesses' && (
        <>
          <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>Connections. Capital. Confidence.</p>
          <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>Orisuun is more than a listing — it’s a growth ecosystem. Get matched with investors, advisors, and opportunities tailored for you.</p>
        </>
      )}
      {userType == 'professionals' && (
          <>
          <div className='w-full flex flex-col items-center'>
            <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>Grow Your Practice. Amplify Your Impact</p>
            <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>Orisuun is more than a listing — it’s a growth ecosystem. Get matched with investors, advisors, and opportunities tailored for you.</p>
          </div>
          </>
        )}
        {userType == 'mentors' && (
          <>
          <div className='w-full flex flex-col items-center'>
            <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>Share What You Know. See What It Grows.</p>
            <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>Your insight can change someone’s business - and their life</p>
          </div>
          </>
        )}
        {userType == 'strategy-consultants' && (
          <>
          <div className='w-full flex flex-col items-center'>
            <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>List Your Services. Get Hired For What You Know.</p>
            <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>Create your strategy consultant profile and start working with businesses that need smart , 
actionable plans to grow and thrive</p>
          </div>
          </>
        )}
        {userType == 'partners' && (
          <>
          <div className='w-full flex flex-col items-center'>
            <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>Smarter Way to Support Black Entrepreneurship</p>
            <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>This is where your impact starts</p>
          </div>
          </>
        )}
        {userType == 'investors' && (
          <>
          <div className='w-full flex flex-col items-center'>
            <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>Overlooked Potential with Big Returns</p>
            <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>Search, filter, and connect with investment-ready Black-owned businesses</p>
          </div>
          </>
        )}
        {userType == 'advocates' && (
          <>
          <div className='w-full flex flex-col items-center'>
            <p className='text-[28px] md:text-[48px] text-[#001E5F] font-[500px] text-center mt-3 mb-3'>Turn Small Actions into Big Impact!</p>
            <p className='text-[18px] text-[#5B657B] font-normal text-center mb-14'>You don’t need capital to create change</p>
          </div>
          </>
        )}
      {usersTypes.map((item, i) => (
        <div key={i} className="flex flex-col gap-16 md:gap-32">
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
                  link1={item?.sections?.section1?.link1}
                  link2={item?.sections?.section1?.link2}
                />
              )}
              {userType == 'experts' && item?.sections?.section3 && (
                <TextFirst
                  image={item?.sections?.section3?.image}
                  heading={item?.sections?.section3?.heading}
                  paragraph1={item?.sections?.section3?.paragraph1}
                  paragraph2={item?.sections?.section3?.paragraph2}
                  paragraph3={item?.sections?.section3?.paragraph3}
                  buttonText={item?.sections?.section3?.buttonText}
                  link1={item?.sections?.section3?.link1}
                  link2={item?.sections?.section3?.link2}
                />
              )}
              {item?.sections?.section2 && userType != 'experts' && (
                <TextFirst
                  image={item?.sections?.section2?.image}
                  heading={item?.sections?.section2?.heading}
                  paragraph1={item?.sections?.section2?.paragraph1}
                  paragraph2={item?.sections?.section2?.paragraph2}
                  paragraph3={item?.sections?.section2?.paragraph3}
                  buttonText={item?.sections?.section2?.buttonText}
                  link2={item?.sections?.section2?.link2}

                />
              )}
              {userType == 'partners' && item?.sections?.section3 ? (
                <ImageFirst
                  image={item?.sections?.section3?.image}
                  heading={item?.sections?.section3?.heading}
                  paragraph1={item?.sections?.section3?.paragraph1}
                  paragraph2={item?.sections?.section3?.paragraph2}
                  paragraph3={item?.sections?.section3?.paragraph3}
                  buttonText={item?.sections?.section3?.buttonText}
                  link1={item?.sections?.section3?.link1}
                  link2={item?.sections?.section3?.link2}
                />
              ) : (userType != 'experts' &&
                <ImageFirst
                  image={item?.sections?.section3?.image}
                  heading={item?.sections?.section3?.heading}
                  paragraph1={item?.sections?.section3?.paragraph1}
                  paragraph2={item?.sections?.section3?.paragraph2}
                  paragraph3={item?.sections?.section3?.paragraph3}
                  buttonText={item?.sections?.section3?.buttonText}
                  link1={item?.sections?.section3?.link1}
                  link2={item?.sections?.section3?.link2}
                />
              )}
              {item?.sections?.section4 && userType != 'experts' && (
                <TextFirst
                  image={item?.sections?.section4?.image}
                  heading={item?.sections?.section4?.heading}
                  paragraph1={item?.sections?.section4?.paragraph1}
                  paragraph2={item?.sections?.section4?.paragraph2}
                  paragraph3={item?.sections?.section4?.paragraph3}
                  buttonText={item?.sections?.section4?.buttonText}
                  link1={item?.sections?.section4?.link1}
                  link2={item?.sections?.section4?.link2}
                />
              )}
              {(userType == 'black-owned-businesses' || userType == 'advocates') && userType != 'experts' &&
                item?.sections?.section5 && (
                  <ImageFirst
                    image={item?.sections?.section5?.image}
                    heading={item?.sections?.section5?.heading}
                    paragraph1={item?.sections?.section5?.paragraph1}
                    paragraph2={item?.sections?.section5?.paragraph2}
                    paragraph3={item?.sections?.section5?.paragraph3}
                    buttonText={item?.sections?.section5?.buttonText}
                  link1={item?.sections?.section5?.link1}
                  link2={item?.sections?.section5?.link2}
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
                  link2={item?.sections?.section6?.link2}
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
