const resource = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/resource.svg`;
const community = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/community.svg`;
const funding = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/funding.svg`;
const directory = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/directory.svg`;
const mentorship = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/mentorship.svg`;
const expert = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/expert.svg`;
const safety = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/safety.svg`;
const transaction = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/transactions.svg`;
const matching = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/matching.svg`;
const discount = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/discount.svg`;
const privateChat = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/privateChat.svg`;
const publicP = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/icons/publicP.svg`;
const market = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/market.png`;
const board = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/board.png`;
const support = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/black-owned.png`;
const contract = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/contract.png`;
const purpose = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/purpose.png`;
const scientific = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/scientific.png`;
const exclusive = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/exclusive.png`;
const spend = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/spend.png`;
const study = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/study.png`;
const paris = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/paris.png`;
const instrument = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/instrument.png`;
const custom = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/custom.png`;
const write = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/write.png`;
const raise = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/raise.png`;
const social = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/social.png`;
const profile = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/profile.png`;

export const programs = [
  {
    img: resource,
    title: 'Resource Hub',
    details:
      'A comprehensive resource hub providing tools, guides, and information.',
  },
  {
    img: community,
    title: 'Community Network',
    details:
      'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
  },
  {
    img: funding,
    title: 'Funding Access',
    details:
      'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
  },
  {
    img: directory,
    title: 'Business Directory',
    details:
      'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
  },
  {
    img: mentorship,
    title: 'Mentorship Program',
    details:
      'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
  },
  {
    img: expert,
    title: 'Experts & experience',
    details:
      'Connect with industry experts and leverage their experience for professional growth.',
  },
  {
    img: safety,
    title: 'Safety & security',
    details:
      'Enjoy a secure platform with robust safety measures to protect your business information.',
  },
  {
    img: transaction,
    title: 'Escrow-based Transactions',
    details:
      'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
  },
  {
    img: matching,
    title: 'Matching',
    details:
      'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
  },
];

export const usersTypes = [
  {
    userType: 'black-owned-businesses',
    description1:
      'Black-owned businesses are at the center of Orisuun’s mission and system.',
    description2:
      'Our platform bridges the gap between Black-owned businesses and a network of investors, mentors, clients, professionals, and consultants eager to lend their expertise.',
    description3:
      'From investors seeking promising ventures to seasoned mentors offering invaluable guidance to professionals offering specialized services to potential clients seeking innovative solutions – our platform facilitates meaningful connections that will propel your business forward. Orisuun is your compass on the path to success.',
    getStarted: {
      heading: 'Build Something & Make a Difference',
      details:
        'Get funded! Find mentors, experts, consultants, and customers all eager to help you grow.',
    },
    programs: [
      {
        img: matching,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information tailored for Black-owned businesses.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with fellow Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience to grow your business effectively.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: discount,
        title: 'Discounts',
        details:
          'Access exclusive discounts on essential services and products to help your business save and grow.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      monthly: {
        card1: {
          title: 'Standard',
          price: '$5.00',
          period: '/Month',
        },
        card2: {
          title: 'Premium',
          price: '$8.00',
          period: '/Month',
        },
      },
      quarterly: {
        card1: {
          title: 'Standard',
          price: '$10.00',
          period: '/Quarter',
          button1: '$3.33/month',
          button2: '~33% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$16.00',
          period: '/Quarter',
          button1: '$5.33/month',
          button2: '~33% Savings',
        },
      },
      annually: {
        card1: {
          title: 'Standard',
          price: '$33.00',
          period: '/Year',
          button1: '$2.75/month',
          button2: '~45% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$56.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: raise,
        heading: 'Raise funds for your business',
        paragraph1:
          'Secure the capital you need to grow and expand your business by connecting with investors on the Orisuun platform.',
        paragraph2:
          'We provide a streamlined process to help you raise funds efficiently and effectively, ensuring you have the financial support necessary to reach your goals.',
        paragraph3: 'Our 1% charge is among the lowest you can find online.',
        buttonText: 'Raise funds',
        link1: '/signup',
      },
      section2: {
        image: social,
        heading: 'Hire Professionals with Confidence',
        paragraph1:
          'Find and hire top professionals, business consultants, and experts directly on our site.',
        paragraph2:
          'Orisuun provides a secure environment with our Escrow and Dispute Resolution System, ensuring the integrity and trustworthiness of your business transactions.',
        paragraph3: 'Our 1% charge is among the lowest you can find online.',
        buttonText: 'Find professionals',
        link1: '/signup',
      },
      section3: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup',
      },
      section4: {
        image: profile,
        heading:
          'Get found by eager potential clients and customers through our sophisticated database',
        paragraph1:
          'We have the most sophisticated and comprehensive database of Black-owned businesses in the world.',
        paragraph2:
          'We also have an exceptionally large constituent of members dedicated to finding new Black-owned businesses to support.',
        paragraph3: 'Get your business found!',
        buttonText: 'Get found',
        link1: '/signup',
      },
      section5: {
        image: spend,
        heading: 'Attract New Customers with Discounts',
        paragraph1:
          'Introduce your business to new customers by offering exclusive discounts.',
        paragraph2:
          "Utilize Orisuun's platform to reach a wider audience and incentivize potential clients to choose your services or products, boosting your customer base and sales.",
        buttonText: 'Find new customers',
        link1: 'business-discount-club',
      },
      section6: {
        image: custom,
        heading: 'Choose your own exclusive and custom Orisuun web address',
        paragraph1: 'All members have the option to create public profiles. ',
        paragraph2:
          'Use your profile to promote yourself and your accomplishments on Orisuun',
        buttonText: 'Choose web address',
      },
    },
  },
  {
    userType: 'professionals',
    description1:
      'Orisuun is where professionals meet purpose. Our innovative online platform seamlessly connects skilled professionals with a diverse array of Black-owned businesses, fostering impactful collaborations and supporting economic empowerment within the community.',
    description2:
      'Through our intuitive platform, professionals gain access to a robust collection of businesses eager to grow, spanning industries from technology to fashion and everything in between. Elevate your impact with Orisuun.',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details:
        'Get paid for your services while helping Black-owned businesses grow.',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      monthly: {
        card1: {
          title: 'Standard',
          price: '$5.00',
          period: '/Month',
        },
        card2: {
          title: 'Premium',
          price: '$8.00',
          period: '/Month',
        },
      },
      quarterly: {
        card1: {
          title: 'Standard',
          price: '$10.00',
          period: '/Quarter',
          button1: '$3.33/month',
          button2: '~33% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$16.00',
          period: '/Quarter',
          button1: '$5.33/month',
          button2: '~33% Savings',
        },
      },
      annually: {
        card1: {
          title: 'Standard',
          price: '$33.00',
          period: '/Year',
          button1: '$2.75/month',
          button2: '~45% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$56.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
    },
  },
  {
    userType: 'experts',
    description1:
      "At Orisuun, we recognize the invaluable role expertise plays in driving success. By democratizing access to expertise, we empower Black-owned businesses to thrive in today's competitive landscape, fostering innovation and sustainable growth.",
    description2:
      'Our platform serves as the nexus, seamlessly integrating entrepreneurs with the precise knowledge and skills they need to thrive. Welcome to a transformative space where experts and expertise meet opportunity, powering the growth and prosperity of Black-owned enterprises.',
    getStarted: {
      heading: 'Elevate your support for Black entrepreneurship on Orisuun',
      details:
        'Get paid for your expertise while helping Black-owned businesses grow',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      monthly: {
        card1: {
          title: 'Standard',
          price: '$5.00',
          period: '/Month',
        },
        card2: {
          title: 'Premium',
          price: '$8.00',
          period: '/Month',
        },
      },
      quarterly: {
        card1: {
          title: 'Standard',
          price: '$10.00',
          period: '/Quarter',
          button1: '$3.33/month',
          button2: '~33% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$16.00',
          period: '/Quarter',
          button1: '$5.33/month',
          button2: '~33% Savings',
        },
      },
      annually: {
        card1: {
          title: 'Standard',
          price: '$33.00',
          period: '/Year',
          button1: '$2.75/month',
          button2: '~45% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$56.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
    },
  },
  {
    userType: 'mentors',
    description1:
      "In today's competitive landscape, mentorship is not just a luxury but a necessity for success. From guidance on strategy to navigating challenges and building networks, we foster a supportive community for growth and success. Mentors are here to mark the playing field and give the guidance they wish they had.",
    description2: '',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details:
        'Get paid to use your experience to help Black-owned businesses grow',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      monthly: {
        card1: {
          title: 'Standard',
          price: '$5.00',
          period: '/Month',
        },
        card2: {
          title: 'Premium',
          price: '$8.00',
          period: '/Month',
        },
      },
      quarterly: {
        card1: {
          title: 'Standard',
          price: '$10.00',
          period: '/Quarter',
          button1: '$3.33/month',
          button2: '~33% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$16.00',
          period: '/Quarter',
          button1: '$5.33/month',
          button2: '~33% Savings',
        },
      },
      annually: {
        card1: {
          title: 'Standard',
          price: '$33.00',
          period: '/Year',
          button1: '$2.75/month',
          button2: '~45% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$56.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
    },
  },
  {
    userType: 'strategy-consultants',
    description1:
      "For Black-owned businesses, navigating the complex landscape of management consulting can be daunting. That's where we step in. Our platform simplifies the process, empowering businesses to access specialized knowledge and strategic guidance tailored to their unique challenges and goals. Whether it's streamlining operations, devising growth strategies, or enhancing organizational efficiency, our consultants bring a wealth of experience to the table, ready to drive tangible results and foster long-term sustainability.",
    description2:
      'Through our intuitive platform, strategy consultants gain access to a robust collection of businesses eager to grow, spanning industries from technology to fashion and everything in between. You are uniquely qualified for maximum impact. Get paid to make a difference.',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details:
        'Get paid for your unique skills while helping Black-owned businesses grow',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      monthly: {
        card1: {
          title: 'Standard',
          price: '$5.00',
          period: '/Month',
        },
        card2: {
          title: 'Premium',
          price: '$8.00',
          period: '/Month',
        },
      },
      quarterly: {
        card1: {
          title: 'Standard',
          price: '$10.00',
          period: '/Quarter',
          button1: '$3.33/month',
          button2: '~33% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$16.00',
          period: '/Quarter',
          button1: '$5.33/month',
          button2: '~33% Savings',
        },
      },
      annually: {
        card1: {
          title: 'Standard',
          price: '$33.00',
          period: '/Year',
          button1: '$2.75/month',
          button2: '~45% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$56.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
    },
  },

  {
    userType: 'partners',
    description1: "Orisuun's partners are a crucial part of what we do.",
    description2:
      'We provide a large number of avenues for our partners to get involved.',
    description3:
      'Our partners can match fundraising donations on individual campaigns or whole categories. The Discount Portal is designed to allow our partners to introduce themselves to a whole new set of potential clients and customers. The professionals and experts on your team are welcome sign up and serve through a custom affiliation program.',
    description4:
      "We encourage you to reach out to us for any custom arrangements that fit your needs. We'd be happy to discuss.",
    getStarted: {
      heading: 'Build Something & Make a Difference',
      details:
        'Grow your customer base, increase rention, and support Black-owned businesses - all in one place.',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with fellow Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience to grow your business effectively.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: discount,
        title: 'Discounts',
        details:
          'Access exclusive discounts on essential services and products to help your business save and grow.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      monthly: {
        card2: {
          title: '',
          price: 'Contact us',
          period: '',
        },
      },
      quarterly: {
        card2: {
          title: '',
          price: 'Contact us',
          period: '',
        },
      },
      annually: {
        card2: {
          title: '',
          price: 'Contact us',
          period: '',
        },
      },
    },
    sections: {
      section1: {
        image: purpose,
        heading:
          'Match Fundraising Campaign Donations for Black-Owned Businesses',
        paragraph1:
          'Amplify your impact by matching donations for fundraising campaigns of Black-owned businesses.',
        paragraph2:
          'By doubling contributions, you significantly boost their funding efforts, allowing them to expand and thrive more effectively.',
        buttonText: 'Match a campaign',
        
      },

      section2: {
        image: scientific,
        heading: 'Find New Vendors',
        paragraph1:
          'Expand your business network by finding new vendors through Orisuun.',
        paragraph2:
          'Discover reliable Black-owned vendors who can supply high-quality goods and services.',
        buttonText: 'Find vendors',
      },
      section3: {
        image: spend,
        heading: 'Attract New Customers with Discounts',
        paragraph1:
          'Introduce your business to new customers by offering exclusive discounts.',
        paragraph2:
          "Utilize Orisuun's platform to reach a wider audience and incentivize potential clients to choose your services or products, boosting your customer base and sales.",
        buttonText: 'Find new customers',
        link1: 'partners-discount-club',

      },
    },
  },
  {
    userType: 'investors',
    description1:
      'Orisuun is the premier online destination connecting investors with impactful opportunities in Black-owned businesses because we know investment is an effective tool for change.',
    description2:
      'By bridging the gap between investors and underrepresented entrepreneurs, Orisuun facilitates meaningful connections that drive economic growth and social impact. Orisuun stands at the forefront, providing a vital bridge between investors seeking impactful opportunities and entrepreneurs poised for success.',
    description3:
      'We’re offering investors a unique chance to diversify their portfolios while making a tangible difference in the communities they serve.',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details: 'Find untapped investment potential while making an impact',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      monthly: {
        card1: {
          title: 'Standard',
          price: '$5.00',
          period: '/Month',
        },
        card2: {
          title: 'Premium',
          price: '$8.00',
          period: '/Month',
        },
      },
      quarterly: {
        card1: {
          title: 'Standard',
          price: '$10.00',
          period: '/Quarter',
          button1: '$3.33/month',
          button2: '~33% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$16.00',
          period: '/Quarter',
          button1: '$5.33/month',
          button2: '~33% Savings',
        },
      },
      annually: {
        card1: {
          title: 'Standard',
          price: '$33.00',
          period: '/Year',
          button1: '$2.75/month',
          button2: '~45% Savings',
        },
        card2: {
          title: 'Premium',
          price: '$56.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
      section2: {
        image: board,
        heading: 'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
      section4: {
        image: contract,
        heading: 'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun. ',
        paragraph2:
          'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
    },
  },
  {
    userType: 'advocates',
    description1:
      "Orisuun is your go-to online destination for discovering and supporting Black-owned businesses. We're a platform that is revolutionizing the way consumers connect with Black-owned businesses right in their neighborhood and around the world.",
    description2:
      "Whether you're searching for restaurants, fashion boutiques, tech startups, or professional services, we've got you covered. Unlike any other platform, we're more than just a directory – we're a community-driven marketplace empowering consumers to connect directly with businesses that align with their values.",
    getStarted: {
      heading: 'Elevate your support for Black entrepreneurship on Orisuun',
      details: 'Here’s your chance to be a doer',
    },
    programs: [
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: publicP,
        title: 'Public and Private Reviews',
        details:
          'Let businesses know what you thought of their products, services, and general offerings. Share your feedback in public or private.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: privateChat,
        title: 'PrivateChat',
        details: 'Reach out directly to any other member.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
    ],
    priceCards: {
      monthly: {
        card1: {
          title: 'Standard',
          price: '$2.00',
          period: '/Month',
        },
      },
      quarterly: {
        card1: {
          title: 'Standard',
          price: '$4.00',
          period: '/Quarter',
          button1: '$1.33/month',
          button2: '~34% Savings',
        },
      },
      annually: {
        card1: {
          title: 'Standard',
          price: '$14.00',
          period: '/Year',
          button1: '$1.17/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section2: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=advocates',
        link2: '/signup?profile=advocates',
      },
      section3: {
        image: study,
        heading: 'Find Black-Owned Businesses in Your Neighborhood',
        paragraph1:
          'Locate Black-owned businesses right in your neighborhood and support local entrepreneurs.',
        paragraph2:
          'Strengthening local businesses contributes to the overall economic health of your community and encourages sustainable growth.',
        buttonText: 'Find businesses',
        link1: '/find-black-owned-restaurants',
        link2: '/signup?profile=advocates',
      },
      section4: {
        image: instrument,
        heading: 'Find Black-Owned Businesses Around the World',
        paragraph1:
          'Explore Black-owned businesses on a global scale and build international connections.',
        paragraph2:
          'Search worldwide, by country, city, or keyword and expand your market reach by engaging with global Black-owned businesses.',
        buttonText: 'Find businesses',
        link1: '/find-black-owned-businesses',
        link2: '/signup?profile=advocates',
      },
      section5: {
        image: write,
        heading: 'Write Reviews and Share Your Experience',
        paragraph1:
          'Share your experiences with Black-owned businesses by writing reviews on Orisuun.',
        paragraph2:
          'Your feedback helps other users make informed decisions and supports the businesses in improving their services and products.',
        paragraph3:
          'Tell businesses about your experience with public or private ratings and reviews.',
        buttonText: 'Share my experience',
        link2: '/signup?profile=advocates',
      },
      section6: {
        image: paris,
        heading: 'Rise Up Our Local, Regional, and Global Leaderboards',
        paragraph1:
          'Demonstrate your commitment to supporting Black-owned businesses by climbing our leaderboards.',
        paragraph2:
          'Show off your contributions and make sure dedication is recognized.',
        buttonText: 'See the leaderboard',
        link2: '/signup?profile=advocates',
      },
    },
  },
];

export const newUsersTypes = [
  {
    userType: 'black-owned-businesses',
    description1:
      'Black-owned businesses are at the center of Orisuun’s mission and system.',
    description2:
      'Our platform bridges the gap between Black-owned businesses and a network of investors, mentors, clients, professionals, and consultants eager to lend their expertise.',
    description3:
      'From investors seeking promising ventures to seasoned mentors offering invaluable guidance to professionals offering specialized services to potential clients seeking innovative solutions – our platform facilitates meaningful connections that will propel your business forward. Orisuun is your compass on the path to success.',
    getStarted: {
      heading: 'Build Something & Make a Difference',
      details:
        'Get funded! Find mentors, experts, consultants, and customers all eager to help you grow.',
    },
    programs: [
      {
        img: matching,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information tailored for Black-owned businesses.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with fellow Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience to grow your business effectively.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: discount,
        title: 'Discounts',
        details:
          'Access exclusive discounts on essential services and products to help your business save and grow.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      annually: {
        card: {
          title: 'Growth, Visibility and Collaboration',
          price: '$49.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: raise,
        heading: 'Raise funds for your business',
        paragraph1:
          'Secure the capital you need to grow and expand your business by connecting with investors on the Orisuun platform.',
        paragraph2:
          'We provide a streamlined process to help you raise funds efficiently and effectively, ensuring you have the financial support necessary to reach your goals.',
        paragraph3: 'Our 1% charge is among the lowest you can find online.',
        buttonText: 'Raise funds',
        link1: '/signup',
      },
      section2: {
        image: social,
        heading: 'Hire Professionals with Confidence',
        paragraph1:
          'Find and hire top professionals, business consultants, and experts directly on our site.',
        paragraph2:
          'Orisuun provides a secure environment with our Escrow and Dispute Resolution System, ensuring the integrity and trustworthiness of your business transactions.',
        paragraph3: 'Our 1% charge is among the lowest you can find online.',
        buttonText: 'Find professionals',
        link1: '/signup',
      },
      section3: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup',
      },
      section4: {
        image: profile,
        heading:
          'Get found by eager potential clients and customers through our sophisticated database',
        paragraph1:
          'We have the most sophisticated and comprehensive database of Black-owned businesses in the world.',
        paragraph2:
          'We also have an exceptionally large constituent of members dedicated to finding new Black-owned businesses to support.',
        paragraph3: 'Get your business found!',
        buttonText: 'Get found',
        link1: '/signup',
      },
      section5: {
        image: spend,
        heading: 'Attract New Customers with Discounts',
        paragraph1:
          'Introduce your business to new customers by offering exclusive discounts.',
        paragraph2:
          "Utilize Orisuun's platform to reach a wider audience and incentivize potential clients to choose your services or products, boosting your customer base and sales.",
        buttonText: 'Find new customers',
        link1: 'business-discount-club',
      },
      section6: {
        image: custom,
        heading: 'Choose your own exclusive and custom Orisuun web address',
        paragraph1: 'All members have the option to create public profiles. ',
        paragraph2:
          'Use your profile to promote yourself and your accomplishments on Orisuun',
        buttonText: 'Choose web address',
      },
    },
  },
  {
    userType: 'professionals',
    description1:
      'Orisuun is where professionals meet purpose. Our innovative online platform seamlessly connects skilled professionals with a diverse array of Black-owned businesses, fostering impactful collaborations and supporting economic empowerment within the community.',
    description2:
      'Through our intuitive platform, professionals gain access to a robust collection of businesses eager to grow, spanning industries from technology to fashion and everything in between. Elevate your impact with Orisuun.',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details:
        'Get paid for your services while helping Black-owned businesses grow.',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      annually: {
        card2: {
          title: 'Growth, Visibility and Collaboration',
          price: '$56.00',
          period: '/Year',
          button1: '$4.67/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=professionals',
        link2: '/signup?profile=professionals',
      },
    },
  },
  {
    userType: 'experts',
    description1:
      "At Orisuun, we recognize the invaluable role expertise plays in driving success. By democratizing access to expertise, we empower Black-owned businesses to thrive in today's competitive landscape, fostering innovation and sustainable growth.",
    description2:
      'Our platform serves as the nexus, seamlessly integrating entrepreneurs with the precise knowledge and skills they need to thrive. Welcome to a transformative space where experts and expertise meet opportunity, powering the growth and prosperity of Black-owned enterprises.',
    getStarted: {
      heading: 'Elevate your support for Black entrepreneurship on Orisuun',
      details:
        'Get paid for your expertise while helping Black-owned businesses grow',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      
      annually: {
        
        card: {
          title: 'Premium',
          price: '$49.00',
          period: '/Year',
          button1: '$4.08/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=experts',
        link2: '/signup?profile=experts',
      },
    },
  },
  {
    userType: 'mentors',
    description1:
      "In today's competitive landscape, mentorship is not just a luxury but a necessity for success. From guidance on strategy to navigating challenges and building networks, we foster a supportive community for growth and success. Mentors are here to mark the playing field and give the guidance they wish they had.",
    description2: '',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details:
        'Get paid to use your experience to help Black-owned businesses grow',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      annually: {
        card: {
          title: 'Growth, Visibility and Collaboration',
          price: '$49.00',
          period: '/Year',
          button1: '$4.08/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=mentors',
        link2: '/signup?profile=mentors',
      },
    },
  },
  {
    userType: 'strategy-consultants',
    description1:
      "For Black-owned businesses, navigating the complex landscape of management consulting can be daunting. That's where we step in. Our platform simplifies the process, empowering businesses to access specialized knowledge and strategic guidance tailored to their unique challenges and goals. Whether it's streamlining operations, devising growth strategies, or enhancing organizational efficiency, our consultants bring a wealth of experience to the table, ready to drive tangible results and foster long-term sustainability.",
    description2:
      'Through our intuitive platform, strategy consultants gain access to a robust collection of businesses eager to grow, spanning industries from technology to fashion and everything in between. You are uniquely qualified for maximum impact. Get paid to make a difference.',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details:
        'Get paid for your unique skills while helping Black-owned businesses grow',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      annually: {
        card: {
          title: 'Growth, Visibility and Collaboration',
          price: '$49.00',
          period: '/Year',
          button1: '$4.08/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
      section2: {
        image: board,
        heading:
          'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
      section4: {
        image: contract,
        heading:
          'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun.',
        paragraph2: 'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=strategy-consultants ',
        link2: '/signup?profile=strategy-consultants ',
      },
    },
  },

  {
    userType: 'partners',
    description1: "Orisuun's partners are a crucial part of what we do.",
    description2:
      'We provide a large number of avenues for our partners to get involved.',
    description3:
      'Our partners can match fundraising donations on individual campaigns or whole categories. The Discount Portal is designed to allow our partners to introduce themselves to a whole new set of potential clients and customers. The professionals and experts on your team are welcome sign up and serve through a custom affiliation program.',
    description4:
      "We encourage you to reach out to us for any custom arrangements that fit your needs. We'd be happy to discuss.",
    getStarted: {
      heading: 'Build Something & Make a Difference',
      details:
        'Grow your customer base, increase rention, and support Black-owned businesses - all in one place.',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with fellow Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience to grow your business effectively.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: discount,
        title: 'Discounts',
        details:
          'Access exclusive discounts on essential services and products to help your business save and grow.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      
      annually: {
        card: {
          title: 'Growth, Visibility and Collaboration',
          price: 'Contact us',
          period: '',
        },
      },
    },
    sections: {
      section1: {
        image: purpose,
        heading:
          'Match Fundraising Campaign Donations for Black-Owned Businesses',
        paragraph1:
          'Amplify your impact by matching donations for fundraising campaigns of Black-owned businesses.',
        paragraph2:
          'By doubling contributions, you significantly boost their funding efforts, allowing them to expand and thrive more effectively.',
        buttonText: 'Match a campaign',

      },

      section2: {
        image: scientific,
        heading: 'Find New Vendors',
        paragraph1:
          'Expand your business network by finding new vendors through Orisuun.',
        paragraph2:
          'Discover reliable Black-owned vendors who can supply high-quality goods and services.',
        buttonText: 'Find vendors',
      },
      section3: {
        image: spend,
        heading: 'Attract New Customers with Discounts',
        paragraph1:
          'Introduce your business to new customers by offering exclusive discounts.',
        paragraph2:
          "Utilize Orisuun's platform to reach a wider audience and incentivize potential clients to choose your services or products, boosting your customer base and sales.",
        buttonText: 'Find new customers',
        link1: 'partners-discount-club',

      },
    },
  },
  {
    userType: 'investors',
    description1:
      'Orisuun is the premier online destination connecting investors with impactful opportunities in Black-owned businesses because we know investment is an effective tool for change.',
    description2:
      'By bridging the gap between investors and underrepresented entrepreneurs, Orisuun facilitates meaningful connections that drive economic growth and social impact. Orisuun stands at the forefront, providing a vital bridge between investors seeking impactful opportunities and entrepreneurs poised for success.',
    description3:
      'We’re offering investors a unique chance to diversify their portfolios while making a tangible difference in the communities they serve.',
    getStarted: {
      heading: 'Elevate your impact with Orisuun',
      details: 'Find untapped investment potential while making an impact',
    },
    programs: [
      {
        img: resource,
        title: 'Resource Hub',
        details:
          'A comprehensive resource hub providing tools, guides, and information.',
      },
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: mentorship,
        title: 'Mentorship Program',
        details:
          'A structured mentorship program linking experienced entrepreneurs with those seeking guidance and support.',
      },
      {
        img: expert,
        title: 'Experts & experience',
        details:
          'Connect with industry experts and leverage their experience for professional growth.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
      {
        img: transaction,
        title: 'Escrow-based Transactions',
        details:
          'Contract with other members confidently with our escrow-based transaction system with dispute resolution.',
      },
      {
        img: matching,
        title: 'Matching',
        details:
          'Get matched with potential partners, investors, and collaborators to boost your business opportunities.',
      },
    ],
    priceCards: {
      annually: {
        card: {
          title: 'Growth, Visibility and Collaboration',
          price: '$49.00',
          period: '/Year',
          button1: '$4.08/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section1: {
        image: market,
        heading:
          'Let the Orisuun network know about business opportunities you offer and are seeking',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find opportunities',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
      section2: {
        image: board,
        heading: 'Find promising Black-owned businesses in your niche looking for co-founders or board members',
        paragraph1:
          'Broadcast the opportunities you offer and seek within the Orisuun network.',
        paragraph2:
          'Our platform enables you to communicate your business needs and offerings, fostering valuable connections and potential collaborations that can drive your business forward.',
        buttonText: 'Find businesses',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
      section3: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
      section4: {
        image: contract,
        heading: 'Work directly with Black-owned businesses on our platform safely and securely',
        paragraph1:
          'Contract with other members confidently, knowing that all transactions are handled securely by Stripe and that any disputes will be handled in a timely manner by Orisuun. ',
        paragraph2:
          'Take advantage of our low transaction fee (just 1%).',
        buttonText: 'Work with businesses',
        link1: '/signup?profile=investors',
        link2: '/signup?profile=investors',
      },
    },
  },
  {
    userType: 'advocates',
    description1:
      "Orisuun is your go-to online destination for discovering and supporting Black-owned businesses. We're a platform that is revolutionizing the way consumers connect with Black-owned businesses right in their neighborhood and around the world.",
    description2:
      "Whether you're searching for restaurants, fashion boutiques, tech startups, or professional services, we've got you covered. Unlike any other platform, we're more than just a directory – we're a community-driven marketplace empowering consumers to connect directly with businesses that align with their values.",
    getStarted: {
      heading: 'Elevate your support for Black entrepreneurship on Orisuun',
      details: 'Here’s your chance to be a doer',
    },
    programs: [
      {
        img: community,
        title: 'Community Network',
        details:
          'Connect with Black business owners to exchange insights, share experiences, and explore collaboration opportunities.',
      },
      {
        img: funding,
        title: 'Funding Access',
        details:
          'Gain access to exclusive funding opportunities, including grants, loans, and investments for Black-owned businesses.',
      },
      {
        img: publicP,
        title: 'Public and Private Reviews',
        details:
          'Let businesses know what you thought of their products, services, and general offerings. Share your feedback in public or private.',
      },
      {
        img: directory,
        title: 'Business Directory',
        details:
          'A searchable directory of Black-owned businesses to increase visibility and facilitate connections.',
      },
      {
        img: privateChat,
        title: 'PrivateChat',
        details: 'Reach out directly to any other member.',
      },
      {
        img: safety,
        title: 'Safety & security',
        details:
          'Enjoy a secure platform with robust safety measures to protect your business information.',
      },
    ],
    priceCards: {
      annually: {
        card: {
          title: 'Growth, Visibility and Collaboration',
          price: '$49.00',
          period: '/Year',
          button1: '$4.08/month',
          button2: '~42% Savings',
        },
      },
    },
    sections: {
      section2: {
        image: support,
        heading: 'Donate to Black-Owned Businesses',
        paragraph1:
          'Make a direct impact by donating to Black-owned businesses and providing them with the financial support they need.',
        paragraph2:
          'Your contributions help these businesses overcome financial barriers and achieve their goals, fostering economic growth within the community.',
        buttonText: 'Start donating',
        link1: '/signup?profile=advocates',
        link2: '/signup?profile=advocates',
      },
      section3: {
        image: study,
        heading: 'Find Black-Owned Businesses in Your Neighborhood',
        paragraph1:
          'Locate Black-owned businesses right in your neighborhood and support local entrepreneurs.',
        paragraph2:
          'Strengthening local businesses contributes to the overall economic health of your community and encourages sustainable growth.',
        buttonText: 'Find businesses',
        link1: '/find-black-owned-restaurants',
        link2: '/signup?profile=advocates',
      },
      section4: {
        image: instrument,
        heading: 'Find Black-Owned Businesses Around the World',
        paragraph1:
          'Explore Black-owned businesses on a global scale and build international connections.',
        paragraph2:
          'Search worldwide, by country, city, or keyword and expand your market reach by engaging with global Black-owned businesses.',
        buttonText: 'Find businesses',
        link1: '/find-black-owned-businesses',
        link2: '/signup?profile=advocates',
      },
      section5: {
        image: write,
        heading: 'Write Reviews and Share Your Experience',
        paragraph1:
          'Share your experiences with Black-owned businesses by writing reviews on Orisuun.',
        paragraph2:
          'Your feedback helps other users make informed decisions and supports the businesses in improving their services and products.',
        paragraph3:
          'Tell businesses about your experience with public or private ratings and reviews.',
        buttonText: 'Share my experience',
        link2: '/signup?profile=advocates',
      },
      section6: {
        image: paris,
        heading: 'Rise Up Our Local, Regional, and Global Leaderboards',
        paragraph1:
          'Demonstrate your commitment to supporting Black-owned businesses by climbing our leaderboards.',
        paragraph2:
          'Show off your contributions and make sure dedication is recognized.',
        buttonText: 'See the leaderboard',
        link2: '/signup?profile=advocates',
      },
    },
  },
];
