export type Testimonial = {
    name: string;
    role: string;
    avatar: string;
    text?: string;
    memberType?: number;
};

export const testimonials: Testimonial[] = [
    // Row 1
    {
        name: 'Daniel Cruz', role: 'Marketing Strategist', avatar: '/homepage-new/testimonials/1.svg', memberType: 6,
        text: "The community chats are surprisingly useful. I've met founders there, then connected through DMs. The relationships feel a lot more natural than what happens on LinkedIn.",
    },
    {
        name: 'Ronald Lara', role: 'Cybersecurity Architect', avatar: '/homepage-new/testimonials/2.svg', memberType: 7,
        text: "What I like is that expertise is actually discoverable. If an owner needs help with cybersecurity, they can find me, see my background, and book time immediately. ",
    },
    {
        name: 'Amina Okafor', role: 'Serial Entrepreneur', avatar: '/homepage-new/testimonials/3.svg', memberType: 8,
        text: "I've had several founders schedule a quick call that turned into ongoing mentoring relationships. That's been really rewarding.",
    },
    {
        name: 'Henry', role: 'Small Business Advisor', avatar: '/homepage-new/testimonials/4.svg', memberType: 6,
        text: "The relationships tend to develop naturally. Sometimes a quick conversation turns into months of ongoing guidance. This platform was needed.",
    },
    {
        name: 'Naomi Cheun', role: 'Employment Attorney', avatar: '/homepage-new/testimonials/5.svg', memberType: 6,
        text: "I joined because a client mentioned the platform. I've built relationships with owners across several industries and picked up work I never would have otherwise.",
    },
    {
        name: 'Darnell Brooks', role: 'Venture Capital Partner', avatar: '/homepage-new/testimonials/6.svg', memberType: 7,
        text: "The opportunity matching feature is what hooked me. I was browsing one night and came across a founder looking for exactly the kind of connections I could help with. ",
    },
    {
        name: 'Huzaifa Anas', role: 'Growth Coach', avatar: '/homepage-new/testimonials/7.svg', memberType: 8,
        text: "What I like most is that founders can find support when they actually need it. The timing often feels much more organic than formal mentoring programs.",
    },
    {
        name: 'Marcus Adeyemi', role: 'Fractional HR Executive', avatar: '/homepage-new/testimonials/8.svg', memberType: 6,
        text: "I've connected with owners at every stage of growth. Some needed help making their first hire, while others were building out full teams. It's been a great way to keep my skills sharp.",
    },

    // Row 2
    {
        name: 'Neha Mayumi', role: 'Business Coach', avatar: '/homepage-new/testimonials/9.svg', memberType: 8,
        text: "One of the founders I work with booked me before we had one conversation. Six months later we're still meeting regularly. Those are the kinds of relationships I was hoping to build.",
    },
    {
        name: 'Boston Thomas', role: 'Fractional CFO', avatar: '/homepage-new/testimonials/10.svg', memberType: 6,
        text: "I joined mostly to see what was there. Within a few weeks I had two owners book calls with me just from my profile. Both ended up becoming long-term clients.",
    },
    {
        name: 'Kim Armstrong', role: 'Former SaaS Founder', avatar: '/homepage-new/testimonials/11.svg', memberType: 8,
        text: "I've mentored through accelerators before, but this feels different. People reach out because they genuinely want guidance, not because they were assigned to you.",
    },
    {
        name: 'Fred Thompson', role: 'Hospital Compliance Specialist', avatar: '/homepage-new/testimonials/12.svg', memberType: 6,
        text: "The booking system is great because people come into the conversation already knowing what I do. We can jump straight into their problem.",
    },
    {
        name: 'Leah Nguyen', role: 'Go-To-Market Strategist', avatar: '/homepage-new/testimonials/13.svg', memberType: 2,
        text: "The quality of conversations is what stands out most to me. People tend to get straight to what they're building and where they need help.",
    },
    {
        name: 'Shyla Bandhu', role: 'Operations - Revenue Growth Consultant', avatar: '/homepage-new/testimonials/14.svg', memberType: 2,
        text: "A lot of networking platforms feel passive. Here, I consistently find people who are actively looking to move their businesses forward. I can tell it is intentional.",
    },
    {
        name: 'Andrew Chen', role: 'Angel Investor', avatar: '/homepage-new/testimonials/15.svg', memberType: 7,
        text: "I signed up expecting another business directory. It turned out to be much more active than I expected. I've had several founders book time directly on my calendar.",
    },
    {
        name: 'Rose Hines', role: 'Commercial Real Estate Advisor', avatar: '/homepage-new/testimonials/16.svg', memberType: 6,
        text: "I've picked up a few clients from Orisuun, but honestly, the relationships are the biggest benefit. There are people I regularly talk to that I first met directly on my calendar.",
    },

    {
        name: 'Abbas', role: 'Business Performance Coach', avatar: '/homepage-new/testimonials/17.svg', memberType: 8,
        text: "I've picked up a few clients from Orisuun, but honestly, the relationships are the biggest benefit. There are people I regularly talk to that I first met directly on my calendar.",
    },
    {
        name: 'Nicholas', role: 'Seed Investor', avatar: '/homepage-new/testimonials/18.svg', memberType: 7,
        text: "I've picked up a few clients from Orisuun, but honestly, the relationships are the biggest benefit. There are people I regularly talk to that I first met directly on my calendar.",
    },
    
    // Row 3
    {
        name: 'Sarika Jain', role: 'Market Entry Specialist', avatar: '/homepage-new/testimonials/19.svg', memberType: 2,
        text: "A business posted an opportunity looking for help entering Mumbai and later all of India. We connected right away. I love that those kinds of opportunities are visible.",
    },
    {
        name: 'Eric Young', role: 'Impact Fund Manager', avatar: '/homepage-new/testimonials/20.svg', memberType: 7,
        text: "I like that there are multiple ways to watch get to know a business before a formal investment conversation. That's much more informative than a cold pitch deck.",
    },
    {
        name: 'Jessamine Mumtaz', role: 'Business Growth Consultant', avatar: '/homepage-new/testimonials/21.svg', memberType: 2,
        text: "The opportunity matching section is probably where I focus most. It's basically a feed of businesses looking for growth opportunities. For someone in strategy, that's incredibly valuable.",
    },
    {
        name: 'Rhea Hull', role: 'RH Angels - Angel Investor Syndicate ', avatar: '/homepage-new/testimonials/22.svg', memberType: 7,
        text: "The platform surfaces businesses and founders that I simply don't see elsewhere. That's become a major reason I keep coming back.",
    },
    {
        name: 'Emma Berger', role: 'Startup Advisor', avatar: '/homepage-new/testimonials/23.svg', memberType: 8,
        text: "The booking feature has saved a lot of time. Founders can see when I'm available and just schedule a call. No calendar gymnastics. It’s simple, but it makes a huge difference.",
    },
    {
        name: 'Sophia', role: 'Former Venture-Backed Founder', avatar: '/homepage-new/testimonials/24.svg', memberType: 8,
        text: "I've had some of the best mentoring conversations of my career through people I met here. That's saying a lot.",
    },
    {
        name: 'Albert Juan', role: 'Offshoring Executive', avatar: '/homepage-new/testimonials/25.svg', memberType: 8,
        text: "I wasn't looking for another networking platform. I was looking for people I could help. This gave me a direct path to finding them.",
    },
    {
        name: 'Luke Ronnev', role: 'Early Stage Investor', avatar: '/homepage-new/testimonials/26.svg', memberType: 7,
        text: "I appreciate being able to interact with founders long before they're raising capital. It creates a much more complete picture.",
    },
    {
        name: 'Koen Chegg', role: 'Partnership Development', avatar: '/homepage-new/testimonials/27.svg', memberType: 2,
        text: "One founder reached out about a potential partnership challenge. We talked for an hour and ended up identifying several opportunities neither of us had considered before.",
    },
    {
        name: 'Adam McCall', role: 'Commercial Contracts Attorney', avatar: '/homepage-new/testimonials/28.svg', memberType: 6,
        text: "The founders I've spoken with here tend to be very intentional. They usually know what they're looking for and come prepared for the conversation.",
    },
    {
        name: 'Stacy Pluntack', role: 'Manufacturing Process Engineer', avatar: '/homepage-new/testimonials/29.svg', memberType: 6,
        text: "I've been part of plenty of business communities. This is one of the few where I've actually seen relationships turn into projects.",
    },
    {
        name: 'Warren Daniels', role: 'Venture Scout', avatar: '/homepage-new/testimonials/30.svg', memberType: 8,
        text: "I've found some genuinely impressive businesses through the community. A few are now companies I continue to follow closely.",
    },
];
