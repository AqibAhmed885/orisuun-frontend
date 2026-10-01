import UserSearch from '@/icons/user-search';
import Users from '@/icons/users';
import Handshake from '@/icons/handshake';

export const profiles = [
    { icon: UserSearch, label: 'Business Development Opportunities', value: '1' },
    { icon: Users, label: 'Co-Founder Posts', value: '2' },
    { icon: Handshake, label: 'Board of Directors Member Posts', value: '3' },
  ];

  export const sortOptions = [
    { value: 'CreatedOn', label: 'Created Date' },
    { value: 'ExpirationDate', label: 'Expiration Date' }
];
