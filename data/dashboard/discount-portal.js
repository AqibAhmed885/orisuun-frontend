import allDiscount from '@/public/images/vector/discount-portal/discount.svg';
import businessType from '@/public/images/vector/discount-portal/business.svg';
import offer from '@/public/images/vector/discount-portal/offer.svg';
import online from '@/public/images/vector/discount-portal/online.svg';
import store from '@/public/images/vector/discount-portal/store.svg';
import person from '@/public/images/vector/discount-portal/person.svg';
import rocket from '@/public/images/vector/discount-portal/rocket.svg';
import handshake from '@/public/images/vector/handshake.svg';
import members from '@/public/images/vector/discount-portal/members.svg';

export const data = [
  { image: allDiscount, text: 'All Discounts', key: 'ByAllDiscounts' },
  { image: businessType, text: 'By Business Type', key: 'ByBusinessType' },
  { image: offer, text: 'By Offer Type', key: 'ByOfferType' },
  { image: online, text: 'Online', key: 'ByOnline' },
  { image: store, text: 'In store', key: 'ByInStore' },
  { image: person, text: 'New Customers Only', key: 'ByNewCustomers' },
  { image: rocket, text: 'For Start Ups', key: 'ByStartUps' },
  { image: handshake, text: 'Partner Discounts Only', key: 'ByPartnerDiscounts' },
  { image: members, text: 'Member Discounts Only', key: 'ByMemberDiscounts' },
];

export const steps = [
  {
    name: 'Company Info',
    id: 0,
    icon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12H14M10 8H14M14 21V18C14 17.4696 13.7893 16.9609 13.4142 16.5858C13.0391 16.2107 12.5304 16 12 16C11.4696 16 10.9609 16.2107 10.5858 16.5858C10.2107 16.9609 10 17.4696 10 18V21M6 10H4C3.46957 10 2.96086 10.2107 2.58579 10.5858C2.21071 10.9609 2 11.4696 2 12V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V9C22 8.46957 21.7893 7.96086 21.4142 7.58579C21.0391 7.21071 20.5304 7 20 7H18M6 21V5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3H16C16.5304 3 17.0391 3.21071 17.4142 3.58579C17.7893 3.96086 18 4.46957 18 5V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
  },
  {
    name: 'Discount Info',
    id: 1,
      icon:
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.9992 8.99912L8.99922 14.9991M8.99922 8.99912H9.00922M14.9992 14.9991H15.0092M3.84922 8.61912C3.70326 7.96165 3.72567 7.27796 3.91437 6.63146C4.10308 5.98496 4.45196 5.39657 4.92868 4.92084C5.40541 4.44512 5.99453 4.09747 6.64142 3.91012C7.28832 3.72277 7.97205 3.70179 8.62922 3.84912C8.99093 3.28342 9.48922 2.81788 10.0782 2.49541C10.6671 2.17293 11.3278 2.00391 11.9992 2.00391C12.6707 2.00391 13.3313 2.17293 13.9203 2.49541C14.5092 2.81788 15.0075 3.28342 15.3692 3.84912C16.0274 3.70114 16.7123 3.72203 17.3602 3.90983C18.0081 4.09764 18.598 4.44626 19.0751 4.92327C19.5521 5.40029 19.9007 5.99019 20.0885 6.63812C20.2763 7.28605 20.2972 7.97095 20.1492 8.62912C20.7149 8.99083 21.1805 9.48912 21.5029 10.0781C21.8254 10.667 21.9944 11.3277 21.9944 11.9991C21.9944 12.6706 21.8254 13.3312 21.5029 13.9202C21.1805 14.5091 20.7149 15.0074 20.1492 15.3691C20.2966 16.0263 20.2756 16.71 20.0882 17.3569C19.9009 18.0038 19.5532 18.5929 19.0775 19.0697C18.6018 19.5464 18.0134 19.8953 17.3669 20.084C16.7204 20.2727 16.0367 20.2951 15.3792 20.1491C15.018 20.717 14.5193 21.1845 13.9293 21.5084C13.3394 21.8324 12.6772 22.0022 12.0042 22.0022C11.3312 22.0022 10.669 21.8324 10.0791 21.5084C9.48914 21.1845 8.99045 20.717 8.62922 20.1491C7.97205 20.2965 7.28832 20.2755 6.64142 20.0881C5.99453 19.9008 5.40541 19.5531 4.92868 19.0774C4.45196 18.6017 4.10308 18.0133 3.91437 17.3668C3.72567 16.7203 3.70326 16.0366 3.84922 15.3791C3.27917 15.0184 2.80963 14.5193 2.48426 13.9283C2.1589 13.3374 1.98828 12.6737 1.98828 11.9991C1.98828 11.3245 2.1589 10.6609 2.48426 10.0699C2.80963 9.47895 3.27917 8.97988 3.84922 8.61912Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
,
  },
  {
    name: 'Expiration',
    id: 2,
    icon:
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1.66602H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 1.66602V4.99935" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.0001 21.6667C16.6025 21.6667 20.3334 17.9357 20.3334 13.3333C20.3334 8.73096 16.6025 5 12.0001 5C7.39771 5 3.66675 8.73096 3.66675 13.3333C3.66675 17.9357 7.39771 21.6667 12.0001 21.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.93628 10.2695L12.0003 13.3335" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19 3.66602L21.6667 6.33268" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
,
  },
  {
    name: 'Details',
    id: 3,
    icon:
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 7.99918C16.7761 7.99918 17 7.77533 17 7.49918C17 7.22304 16.7761 6.99918 16.5 6.99918C16.2239 6.99918 16 7.22304 16 7.49918C16 7.77533 16.2239 7.99918 16.5 7.99918Z" fill="#7E7E7E" />
        <path d="M2.586 17.4132C2.2109 17.7882 2.00011 18.2968 2 18.8272V20.9992C2 21.2644 2.10536 21.5188 2.29289 21.7063C2.48043 21.8938 2.73478 21.9992 3 21.9992H6C6.26522 21.9992 6.51957 21.8938 6.70711 21.7063C6.89464 21.5188 7 21.2644 7 20.9992V19.9992C7 19.734 7.10536 19.4796 7.29289 19.2921C7.48043 19.1045 7.73478 18.9992 8 18.9992H9C9.26522 18.9992 9.51957 18.8938 9.70711 18.7063C9.89464 18.5188 10 18.2644 10 17.9992V16.9992C10 16.734 10.1054 16.4796 10.2929 16.2921C10.4804 16.1045 10.7348 15.9992 11 15.9992H11.172C11.7024 15.9991 12.211 15.7883 12.586 15.4132L13.4 14.5992C14.7898 15.0833 16.3028 15.0815 17.6915 14.5939C19.0801 14.1064 20.2622 13.162 21.0444 11.9153C21.8265 10.6686 22.1624 9.19336 21.9971 7.73092C21.8318 6.26849 21.1751 4.90544 20.1344 3.86475C19.0937 2.82407 17.7307 2.16737 16.2683 2.00207C14.8058 1.83678 13.3306 2.17268 12.0839 2.95482C10.8372 3.73697 9.89279 4.91906 9.40525 6.3077C8.91771 7.69635 8.91585 9.20935 9.4 10.5992L2.586 17.4132Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16.5 7.99918C16.7761 7.99918 17 7.77533 17 7.49918C17 7.22304 16.7761 6.99918 16.5 6.99918C16.2239 6.99918 16 7.22304 16 7.49918C16 7.77533 16.2239 7.99918 16.5 7.99918Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
,
  },
];

export const sections = [
  {
    title: 'By Business type',
    options: [
      {
        id: 'med-equip',
        label: 'Medical equipment and supplies manufacturers',
      },
      { id: 'merchant-wholesalers', label: 'Merchant wholesalers' },
      { id: 'health-stores', label: 'Health & Personal Care Stores' },
      { id: 'warehousing', label: 'Warehousing' },
      { id: 'health-services', label: 'Health care services' },
    ],
  },
  {
    title: 'Type of usage',
    options: [
      { id: 'Online', label: 'Online' },
      { id: 'In store', label: 'In store' },
    ],
  },
  {
    title: 'Type of discount',
    options: [
      { id: 'Partner discounts', label: 'Partner discounts' },
      { id: 'Member discounts', label: 'Member discounts' },
    ],
  },
];
