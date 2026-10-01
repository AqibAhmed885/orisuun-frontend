import CalendarPage from './CalendarPage'

export const metadata = {
  title: ' Global Black Business Events Calendar | Orisuun ',
  description: "Discover Black business events worldwide with Orisuun's Global Calendar of Black business events—your hub for conferences, meetups, and webinars supporting Black entrepreneurs.Search events or add your own for free.",
  // keywords: 'Global, Black Business Events, Calendar, Meetups, Webinars, Launches, Conferences, Seminars, Mixers, workshops, grant deadlines, Global Black business events calendar, Black business events calendar',
  alternates: {
    canonical: 'https://orisuun.com/calendar',
  },
  openGraph: {
    title: 'Find Black-Focused and Other Business Events by Date and Location',
    description: "Explore a global calendar of Black-focused and general business events, searchable by date, event type, and location.",
    url: 'https://orisuun.com/calendar',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/calendar630.png',
        width: 1200,
        height: 630,
        alt: 'Orisuun Calendar',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Black-Focused and Other Business Events by Date and Location',
    description: "Explore a global calendar of Black-focused and general business events, searchable by date, event type, and location.",
    images: ['https://orisuun.com/og/calendar675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/calendar',
  },
  metadataBase: new URL('https://orisuun.com'),
};

export default function Calendar(){
  return (
    <div className='pb-48 pt-12'>
    <CalendarPage/>
    </div>
  )
}
