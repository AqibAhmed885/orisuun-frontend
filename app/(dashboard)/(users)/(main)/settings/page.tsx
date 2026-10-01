'use client';
import PasswordCloseEye from '@/icons/password-close-eye';
import PasswordEye from '@/icons/password-eye';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import Modal from '@/components/ui/modal/modal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CreditCardPayment from './components/CreditCardPayment';
import StyledTick from '@/icons/verification/styled-tick';
import Download from '@/icons/download';
import Hamburger from '@/icons/sidebar/hamburger';
import { settings } from '../../../../api/dashboard/settings';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { chatApi } from '../../../../api/dashboard/chats';
import Tooltip from '@/components/ui/tooltip';
import TeamProfile from './components/TeamProfileImage.jsx'
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/data/store';
import { addTeamData, setTeamDataLocal } from '@/data/slices/user-slice';
import Cookies from 'js-cookie';

import dynamic from 'next/dynamic';
import DeleteAccountFeedback from './components/DeleteAccountFeedback';

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  { ssr: false }
);

// Dynamic import for ChatSettings to avoid SSR issues
const ChatSettings = dynamic(
  () => import('./components/chats/ChatSettings'),
  { ssr: false }
);

const Settings = () => {
  type SwitchTeamData = {
    isActive: boolean;
    teamId: number | string;
    teamName: string;
    teamMembers: [];
    isBusiness: boolean;
    isPremium: boolean;
    isVerified: boolean;
  };
  const [activeTab, setActiveTab] = useState('team');
  const [billingData, setBillingData] = useState<any>([]);
  const [walletUrl, setWalletUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [teamList, setTeamList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUser, setFilteredUsers] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [teamInvites, setTeamInvites] = useState([]);
  const [switchTeamData, setSwitchTeamData] = useState<SwitchTeamData | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const prevSwitchDetails = useSelector((state: RootState) => state.user.teamData);

  useEffect(() => {
    setSwitchTeamData(prevSwitchDetails)
  }, [prevSwitchDetails])

  useEffect(() => {
    dispatch(setTeamDataLocal());
  }, [])

  const goToTeamPage = (teamId, pageName) => {
    if (pageName == 'teamPage') {
      router.push(`/settings/teamprofile/${teamId}`);
    }

    else if (pageName == 'createTeam') {
      router.push(`/settings/create-team-profile/${teamId}`);
    }
    else if (pageName == 'editTeam') {
      router.push(`/settings/edit-team-profile/${teamId}`);
    }
    else if (pageName == 'teamPage') {
      router.push(`/settings/teamprofile/${teamId}`);
    }
  };

  function switchFunctionality(team) {
    if (switchTeamData != null && switchTeamData.teamId == team.TeamId && switchTeamData.isActive == true) {
      const teamDetails = null
      dispatch(addTeamData(teamDetails));
      localStorage.setItem('teamData', JSON.stringify((teamDetails)));
      Cookies.set('teamData', JSON.stringify(teamDetails), { expires: 7 });
    }
    else {
      if (!team.IsProfileCreated) {
        // router.push(`/settings/create-team-profile/${team.TeamId}`);
        toast.error("You need to create team page first!")
      }
      else {
        if (team.IsProfileCreated) {
          const teamDetails = {
            isActive: true,
            teamId: team.TeamId,
            teamName: team.TeamName,
            teamMembers: team.TeamMembers,
            teamAdmin: team.AdminId,
            isBusiness: team.TeamMembers[0].ProfileTypeId == 1 ? true : false,
            isPremium: team.IsPremium,
            isVerified: team.IsVerified
          }
          dispatch(addTeamData(teamDetails));
          localStorage.setItem('teamData', JSON.stringify((teamDetails)));
          Cookies.set('teamData', JSON.stringify(teamDetails), { expires: 7 });
        }
      }
    }
  }

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  // const stripePromise = loadStripe((process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string));

  const fetchInvitations = async () => {
    try {
      const response = await settings.getTeamInvites(currentUser?.Id);
      if (response.status === 200) {
        setTeamInvites(response.data.Result);
      }
    } catch (error) {
      console.error('Error fetching team invites:', error);
      toast.error('Failed to fetch invitations');
    }
  };
  useEffect(() => {
    if (currentUser?.Id) {
      fetchInvitations();
    }
  }, [currentUser?.Id]);
  // const invitedMembers = teamList?.filter(
  //   (member) => member.Status !== 'Invite'
  // );
  const passwordSchema = z
    .object({
      CurrentPassword: z
        .string()
        .min(8, 'Current password must be at least 8 characters long'),
      Password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[\W_]/, 'Password must contain at least one special character'),
      ConfirmNewPassword: z
        .string()
        .min(8, 'Confirm password must be at least 8 characters long'),
    })
    .refine(
      (data) => {
        if (data.Password !== data.ConfirmNewPassword) {
          return false;
        }
        return true;
      },
      {
        path: ['ConfirmNewPassword'], // Point to the Ethinicity field for the error
        message: 'Confirm Password is not matches with the password',
      }
    );
  const {
    register,
    getValues,
    trigger,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      CurrentPassword: '',
      Password: '',
      ConfirmNewPassword: '',
      CurrentPasswordDelete: ''
    },
  });
  const [switches, setSwitches] = useState({
    Message: false,
    Review: false,
    Match: false,
    AnyTransaction: false,
  });
  const values = getValues();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showCurrentPasswordDelete, setShowCurrentPasswordDelete] = useState(false);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [sentInvites, setSentInvites] = useState([])
  const [invitationTab, setInvitationTab] = useState<'received' | 'sent'>('received');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add this state at the top of your component with other states
  const [showNameTeamModal, setShowNameTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  //manage member
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [currentTeamMembers, setCurrentTeamMembers] = useState([]);
  const [selectedTeamForManagement, setSelectedTeamForManagement] = useState(null);
  const [searchQueryForManagement, setSearchQueryForManagement] = useState('');
  const [filteredUsersForManagement, setFilteredUsersForManagement] = useState([]);
  const [showDeleteFeedback, setShowDeleteFeedback] = useState(false);


  const handleManageMembers = (teamId) => {
    const team = teamList.find(t => t.TeamId === teamId);
    if (team) {
      setCurrentTeamMembers(team.TeamMembers);
      setSelectedTeamForManagement(teamId);
      setShowManageMembersModal(true);
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    try {
      const response = await settings.removeTeamMember(teamId, userId);
      if (response.status === 200) {
        toast.success('Member removed successfully');
        fetchTeamData();
        // Update current members in modal
        setCurrentTeamMembers(prev => prev.filter(m => m.UserId !== userId));
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Failed to remove member');
    }
  };

  const handleAddMember = async (teamId, userId) => {
    try {
      const invitationData = {
        senderId: String(currentUser?.Id),
        receiverId: String(userId),
        teamId: String(teamId)
      };
      const response = await settings.AddMember(invitationData);
      if (response.status === 200) {
        toast.success('Invitation sent successfully');
        // Update search results by removing the added user
        setFilteredUsersForManagement(prev => prev.filter(u => u.UserProfileId !== userId));
        setSearchQueryForManagement('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Failed to send invitation');
    }
  };

  const handleLeaveTeam = async (teamId: number) => {
    try {
      const response = await settings.removeTeamMember(String(teamId), currentUser?.Id);
      if (response.status === 200) {
        toast.success('You have successfully left the team');
        fetchTeamData();
        setShowManageMembersModal(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Failed to leave team');
    }
  };
  useEffect(() => {
    if (searchQueryForManagement === '') {
      setFilteredUsersForManagement([]);
    } else {
      const searchUsers = async () => {
        try {
          const result = await chatApi.searchUserByNameList(searchQueryForManagement);
          const transformedResults = result.map(user => ({
            UserProfileId: user.UserId,
            Name: user.FullName,
            ProfilePicture: user.ProfilePicture,
            UserProfileTypeId: user.UserProfileTypeId
          }));

          // Filter out users who are already in the team
          const filtered = transformedResults.filter(user =>
            !currentTeamMembers.some(member => member.UserId === user.UserProfileId)
          );

          // Additional filtering based on user type
          const finalFiltered = currentUser?.UserProfileTypeId === 1
            ? filtered.filter(user => user.UserProfileTypeId === 1 && user.UserProfileId !== currentUser?.Id)
            : filtered.filter(user => user.UserProfileTypeId !== 4 && user.UserProfileTypeId !== 1 && user.UserProfileId !== currentUser?.Id);

          setFilteredUsersForManagement(finalFiltered);
        } catch (error) {
          console.error('Error searching users:', error);
          setFilteredUsersForManagement([]);
        }
      };
      searchUsers();
    }
  }, [searchQueryForManagement, currentTeamMembers]);
  // Add this function to handle team name submission
  const handleNameTeamSubmit = async () => {
    if (!selectedTeamId || !teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    try {
      const response = await settings.updateTeamName(String(selectedTeamId), teamName);
      if (response.StatusCode === 200) {
        toast.success('Team name added successfully');
        setTeamList(prevList =>
          prevList.map(team =>
            team.TeamId === selectedTeamId
              ? { ...team, TeamName: teamName }
              : team
          )
        );
        setShowNameTeamModal(false);
        setTeamName('');
        setSelectedTeamId(null);
      }
      else {
        toast.error('Failed to add team name');
        setShowNameTeamModal(false);
        setTeamName('');
        setSelectedTeamId(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Failed to add team name');
      console.error('Error add team name:', error);
    } finally {
      fetchTeamData()
    }
  };


  const deleteTeam = async (userId, teamId) => {
    try {
      const response = await settings.deleteTeam(userId, teamId);
      if (response.status == 200) {
        toast.success('Team Deleted Successfully!')
        fetchTeamData()
        if (switchTeamData.teamId == teamId) {
          const teamDetails = null
          dispatch(addTeamData(teamDetails));
          localStorage.setItem('teamData', JSON.stringify((teamDetails)));
          Cookies.set('teamData', JSON.stringify(teamDetails), { expires: 7 });
        }
      }
      else {
        toast.error('Failed to delete team!');
      }
    }
    catch {
      toast.error('Failed to delete team!');

    }
  }

  const resendInvite = async (teamId, userId) => {
    try {
      const response = await settings.resendInvite(teamId, userId);
      if (response.status == 200) {
        toast.success('Reinvited Successfully!')
        fetchTeamData()
      }
      else {
        toast.error('Failed to reinvite!');
      }
    }
    catch {
      toast.error('Failed to reinvite!');

    }
  }
  const toggleDropdown = (teamId: number) => {
    setActiveDropdown(activeDropdown === teamId ? null : teamId);
  };

  const handleSwitchChange = (event) => {
    const { id, checked } = event.target;
    setSwitches((prevSwitches) => ({
      ...prevSwitches,
      [id]: checked,
    }));
    handleNotificationSubmit(id, checked);
  };


  const handleSubmitInvitation = async (data, Status) => {
    try {
      const response = await settings.submitInvitation(
        data.TeamId,
        currentUser?.Id,
        Status
      );

      if (response.status === 200) {
        toast.success(`You have accepted the team invitation`)
      }
    } catch (error) {
      console.error('Error submitting invitation:', error);
      toast.error('Failed to submit invitation');
    } finally {
      fetchInvitations()
      fetchTeamData()
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notificationResponse, billingResponse] = await Promise.all([
          settings.getNotificationDetails(currentUser?.Id),
          settings.getBillingData(currentUser?.Id)
        ]);

        if (notificationResponse.status === 200) {
          const result = {
            Message: notificationResponse.data.Result.IsNotificationMessage,
            Review: notificationResponse.data.Result.IsNotificationReview,
            Match: notificationResponse.data.Result.IsNotificationMatch,
            AnyTransaction: notificationResponse.data.Result.IsNotificationAnyTransaction,
          };
          setSwitches(result);
        }

        if (billingResponse.status === 200) {
          setBillingData(billingResponse.data.Result);
          setWalletUrl(billingResponse.data.Result.userData.OnboardingUrl);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch settings data');
      }
    };

    fetchData();
  }, [currentUser?.Id]);

  const fetchTeamData = async () => {
    try {
      const response = await settings.getTeamList(currentUser?.Id);
      if (response.status === 200) {
        const data = response.data.Result;
        setTeamList(data);
        const sentInvitations = []
        data.forEach((item) => {
          if (item?.AdminId == currentUser.Id) {
            item?.TeamMembers.forEach((member) => {
              if (member.UserId != currentUser.Id) {
                const invitation = {
                  UserId: member.UserId,
                  TeamId: item.TeamId,
                  Name: member.Name,
                  Status: member.Status == "member" ? "accepted" : member.Status,
                  ProfilePicture: member.ProfilePicture
                }
                sentInvitations.push(invitation)
              }
            })
          }
        });
        setSentInvites(sentInvitations)
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      // toast.error('Failed to fetch team data');
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [currentUser?.Id]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers([]);
    } else {
      // Replace the local filtering with API call
      const searchUsers = async () => {
        try {
          const result = await chatApi.searchUserByNameList(searchQuery);
          const transformedResults = result.map(user => ({
            UserProfileId: user.UserId,
            Name: user.FullName,
            ProfilePicture: user.ProfilePicture,
            Status: 'Invite',
            UserProfileTypeId: user.UserProfileTypeId
          }));
          const Filtered = currentUser?.UserProfileTypeId === 1
            ? transformedResults.filter(user => user.UserProfileTypeId === 1 && user.UserProfileId !== currentUser?.Id)
            : transformedResults.filter(user => user.UserProfileTypeId !== 4 && user.UserProfileTypeId !== 1 && user.UserProfileId !== currentUser?.Id);
          setFilteredUsers(Filtered);
        } catch (error) {
          console.error('Error searching users:', error);
          setFilteredUsers([]);
        }
      };
      searchUsers();
    }
  }, [searchQuery]);

  const handleNotificationSubmit = async (Key, Value) => {
    try {
      const response = await settings.updateNotificationDetails(
        currentUser?.Id,
        Key,
        Value.toString()
      );
      if (response.status === 200) {
        toast.success(response.data.Message);
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification settings');
    }
  };

  const handlePasswordSubmit = async (values) => {
    const currentPasswordValid = await trigger('CurrentPassword');
    const passwordValid = await trigger('Password');
    const confirmPasswordValid = await trigger('ConfirmNewPassword');

    if (currentPasswordValid && passwordValid && confirmPasswordValid) {
      try {
        const response = await settings.changePassword(currentUser?.Id, {
          ConfirmNewPassword: values.ConfirmNewPassword,
          CurrentPassword: values.CurrentPassword,
          Password: values.Password,
        });

        if (response.status === 200) {
          toast.success(response.data.Message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.Message || 'Failed to change password');
        console.error('Error changing password:', error);
      }
    }
  };

  const HandleDeleteAccount = async (feedbackString: string) => {
  const password = getValues('CurrentPasswordDelete');

  if (!isDeleteConfirmed) {
    toast.error('Please confirm that you want to delete your account.');
    return;
  }

  if (!password) {
    toast.error('Please enter your current password to delete your account.');
    return;
  }

  try {
    setLoader(true);

    // call delete endpoint (existing API)
    const response = await settings.deleteAccount(
      currentUser?.Id,
      password,
      feedbackString
    );

    if (response.status === 200) {
      toast.success(response.data?.Message || 'Account deleted successfully');
      // clear local storage / cookies and redirect
      localStorage.clear();
      Cookies.remove('teamData');
      window.location.href = '/';
    } else {
      toast.error(response?.data?.Message || 'Failed to delete account');
    }
  } catch (error: any) {
    const errorMsg = error?.response?.data?.Message;
    if (errorMsg === 'Incorrect password') {
      toast.error('The password you entered is incorrect.');
    } else {
      toast.error(errorMsg || 'Failed to delete account');
    }
    console.error('Error deleting account:', error);
  } finally {
    setLoader(false);
    setShowDeleteFeedback(false);
  }
};



  const base64ToBlob = (base64String, type) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the binary data
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    setInvoice(url);
    if (type === 1) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Invoice.pdf';

      // Append the link to the document and simulate a click
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  const generateInvoice = async (data, type) => {
    try {
      const response = await settings.generateInvoice(
        currentUser?.Id,
        data.EscrowTranId
      );

      if (response.status === 200) {
        const base64String = response.data.Result;
        base64ToBlob(base64String, type);
        type === 0 && setShowInvoice(true);
      }
    } catch (error) {
      toast.error('Failed to generate invoice');
      console.error('Error generating invoice:', error);
    }
  };
  const handleConnectWallet = async () => {
    try {
      setLoader(true);
      const response = await settings.createConnectAccount(currentUser?.Id);

      if (response.status === 200) {
        toast.success('Your account has been created successfully. To connect your account to Stripe, please use the link below');
        setWalletUrl(response.data.Result.onboardingUrl);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error connecting wallet:', error);
    } finally {
      setLoader(false);
    }
  };
  const refreshLink = async () => {
    try {
      const response = await settings.refreshOnboardingLink(billingData.userData.TempAccountId);

      if (response.status === 200) {
        setWalletUrl(response.data.onboardingUrl);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error refreshing link:', error);
    }
  };



  const handleSendInvitation = async (data) => {
    try {
      const invitationData = {
        senderId: String(currentUser?.Id),
        receiverId: String(data.UserProfileId),
      };

      const response = await settings.sendInvitation(invitationData);

      if (response.status === 200) {

        setTeamList((prevList) => [
          ...prevList,
          {
            InvitedUserProfileId: data.UserProfileId,
            Name: data.Name,
            ProfilePicture: data.ProfilePicture,
            Status: 'Invited',
            IsCreator: true
          }
        ]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error sending invitation:', error);
    } finally {
      toast.success(`invitation sent`);
      fetchTeamData();
      fetchInvitations();
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="lg:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Settings
        </p>
        <Image
          src={
            currentUser?.ProfilePicture || BASE_URL
          }
          alt="user"
          width={32}
          height={32}
          className="rounded-full h-8 w-8 me-2"
        />
      </div>
      <div className="p-6 tracking-wide">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex border-b border-gray-200 overflow-x-scroll">
            <div className="flex">
              <button
                className={`w-[150px] md:w-[200px] tab-button rounded-t-lg py-3 px-2 md:px-4 focus:outline-none ${activeTab === 'team'
                  ? 'bg-[#E9EEF8] text-gray-800 font-semibold'
                  : 'bg-white text-gray-400 hover:text-gray-800 font-normal hover:font-semibold'
                  }`}
                onClick={() => handleTabClick('team')}
              >
                Form a Team
              </button>
              <button
                className={`w-[150px] md:w-[200px] tab-button rounded-t-lg py-3 px-2 md:px-4 focus:outline-none ${activeTab === 'billing'
                  ? 'bg-[#E9EEF8] text-gray-800 font-semibold'
                  : 'bg-white text-gray-400 hover:text-gray-800 font-normal hover:font-semibold'
                  }`}
                onClick={() => handleTabClick('billing')}
              >
                Billing
              </button>
              <button
                className={`w-[150px] md:w-[200px] tab-button rounded-t-lg py-3 px-2 md:px-4 focus:outline-none ${activeTab === 'notifications'
                  ? 'bg-[#E9EEF8] text-gray-800 font-semibold'
                  : 'bg-white text-gray-400 hover:text-gray-800 font-normal hover:font-semibold'
                  }`}
                onClick={() => handleTabClick('notifications')}
              >
                Notifications
              </button>
              <button
                className={`w-[150px] md:w-[200px] tab-button rounded-t-lg py-3 px-2 md:px-4 focus:outline-none ${activeTab === 'password'
                  ? 'bg-[#E9EEF8] text-gray-800 font-semibold'
                  : 'bg-white text-gray-400 hover:text-gray-800 font-normal hover:font-semibold'
                  }`}
                onClick={() => handleTabClick('password')}
              >
                Account Management
              </button>{' '}
              {currentUser?.UserProfileTypeId != 10 && (
                <button
                  className={`w-[150px] md:w-[200px] tab-button rounded-t-lg py-3 px-2 md:px-4 focus:outline-none ${activeTab === 'wallet'
                    ? 'bg-[#E9EEF8] text-gray-800 font-semibold'
                    : 'bg-white text-gray-400 hover:text-gray-800 font-normal hover:font-semibold'
                    }`}
                  onClick={() => handleTabClick('wallet')}
                >
                  Wallet
                </button>
              )}{' '}
              {/* chats management */}
              <button
                className={`w-[150px] md:w-[200px] tab-button rounded-t-lg py-3 px-2 md:px-4 focus:outline-none ${activeTab === 'chats'
                  ? 'bg-[#E9EEF8] text-gray-800 font-semibold'
                  : 'bg-white text-gray-400 hover:text-gray-800 font-normal hover:font-semibold'
                  }`}
                onClick={() => handleTabClick('chats')}
              >
                Chats Management
              </button>
            </div>
          </div>


          {activeTab === 'team' && (
            <>

              <div id="team" className="tab-content active-tab mt-6">
                <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
                  <div className="h-10 w-[6px] rounded-r-lg bg-[#0B1636]"></div>
                  <span className="text-lg font-semibold">
                    Search Members to Form a Team
                  </span>
                </h2>
                <input
                  type="text"
                  placeholder="Search for users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block mt-4 w-full border border-[#457EA2] outline-none rounded-md py-2 px-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
                <ul className="mt-4 border rounded max-h-[300px] overflow-y-auto">
                  {filteredUser.length > 0 &&
                    filteredUser.map((member) => (

                      <li
                        key={member.UserProfileId}
                        className="p-3 border-b border-gray-300"
                      >
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                member?.ProfilePicture != null
                                  ? member?.ProfilePicture
                                  : BASE_URL
                              }
                              className="w-[30px] h-[30px] rounded-full"
                            />
                            <p className="text-h9">{member.Name}</p>
                          </div>
                          <span
                            className={`${member.Status === 'Invited'
                              ? 'text-omblue-500'
                              : member?.Status === 'Rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'text-green-700 cursor-pointer'
                              } text-h9`}
                            onClick={() =>
                              member.Status !== 'Invited' &&
                              handleSendInvitation(member)
                            }
                          >
                            {' '}
                            {member.Status}
                          </span>

                        </div>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mb-10 bg-white rounded-lg shadow-sm">
                <div className="pt-6">
                  <div className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
                    <div className="h-10 w-[6px] rounded-r-lg bg-[#0B1636]"></div>
                    <span className="text-h6 font-semibold">Teams</span>
                  </div>

                  {
                    teamList.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {
                        (Array.isArray(teamList) ? teamList : []).map((team, index) => (
                          <div key={team.id} className={`flex items-center justify-between p-4 border rounded-lg 
                          ${(switchTeamData != null && switchTeamData.teamId == team.TeamId && switchTeamData.isActive == true) ? 'bg-sky-100' : 'hover:bg-gray-50'}`} >
                            <div className="flex items-center gap-4">
                              <TeamProfile members={team.TeamMembers} count={team.NoOfMembers} />

                              {/* <Image
                              alt='users'
                              width={32}
                              height={32}
                              src="https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"
                              className="rounded-full"
                            /> */}
                              <div>
                                <div className="font-medium flex justify-center items-center gap-2">{team.TeamName || "(*Unnamed team)"}
                                  {
                                    team.IsVerified ? (
                                      <svg width="148" height="32" viewBox="0 0 148 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <mask id="mask0_6270_1722" maskUnits="userSpaceOnUse" x="0" y="4" width="24" height="24">
                                          <rect y="4" width="24" height="24" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_6270_1722)">
                                          <path d="M8.81128 25.8655L7.02668 22.8578L3.63823 22.1155L3.969 18.627L1.67285 16.0001L3.969 13.3732L3.63823 9.88477L7.02668 9.14247L8.81128 6.13477L11.9997 7.48862L15.1882 6.13477L16.9728 9.14247L20.3612 9.88477L20.0305 13.3732L22.3266 16.0001L20.0305 18.627L20.3612 22.1155L16.9728 22.8578L15.1882 25.8654L11.9997 24.5116L8.81128 25.8655ZM10.9497 19.2039L16.2536 13.9001L15.1997 12.8155L10.9497 17.0655L8.79973 14.9463L7.7459 16.0001L10.9497 19.2039Z" fill="#1A9E78" />
                                        </g>
                                        <path d="M35.626 21L32.14 10.99H33.498L35.962 18.438L36.354 19.782H36.382C36.5407 19.1847 36.6713 18.7367 36.774 18.438L39.21 10.99H40.526L37.012 21H35.626ZM43.616 21.196C42.5426 21.196 41.6886 20.8367 41.054 20.118C40.4286 19.39 40.116 18.48 40.116 17.388C40.116 16.3147 40.4333 15.414 41.068 14.686C41.712 13.9487 42.538 13.58 43.546 13.58C44.61 13.58 45.4313 13.9533 46.01 14.7C46.5886 15.4373 46.878 16.422 46.878 17.654H41.278C41.3246 18.4193 41.5486 19.0447 41.95 19.53C42.3606 20.006 42.916 20.244 43.616 20.244C44.6986 20.244 45.366 19.7493 45.618 18.76H46.724C46.556 19.5347 46.2013 20.1367 45.66 20.566C45.1186 20.986 44.4373 21.196 43.616 21.196ZM45.058 15.092C44.694 14.6813 44.19 14.476 43.546 14.476C42.902 14.476 42.3886 14.6907 42.006 15.12C41.6326 15.5493 41.3993 16.1093 41.306 16.8H45.66C45.6226 16.072 45.422 15.5027 45.058 15.092ZM49.1208 13.762V14.966H49.1488C49.3821 14.5833 49.6855 14.2753 50.0588 14.042C50.4321 13.7993 50.8475 13.678 51.3048 13.678C51.4728 13.678 51.6268 13.706 51.7668 13.762V14.854H51.7248C51.5848 14.8073 51.4168 14.784 51.2208 14.784C50.6421 14.784 50.1475 14.9893 49.7368 15.4C49.3261 15.8013 49.1208 16.3287 49.1208 16.982V21H47.9868V13.762H49.1208ZM52.7856 21V13.762H53.9196V21H52.7856ZM52.7856 12.39V10.99H53.9196V12.39H52.7856ZM55.0033 14.686V13.762H55.9973V12.6C55.9973 12.0027 56.1606 11.5733 56.4873 11.312C56.814 11.0413 57.29 10.906 57.9153 10.906C58.0926 10.906 58.284 10.9153 58.4893 10.934V11.9C58.3586 11.8907 58.2373 11.886 58.1253 11.886C57.7613 11.886 57.5046 11.942 57.3553 12.054C57.206 12.166 57.1313 12.3667 57.1313 12.656V13.762H58.4753V14.686H57.1313V21H55.9973V14.686H55.0033ZM59.4413 21V13.762H60.5753V21H59.4413ZM59.4413 12.39V10.99H60.5753V12.39H59.4413ZM65.2038 21.196C64.1305 21.196 63.2765 20.8367 62.6418 20.118C62.0165 19.39 61.7038 18.48 61.7038 17.388C61.7038 16.3147 62.0212 15.414 62.6558 14.686C63.2998 13.9487 64.1258 13.58 65.1338 13.58C66.1978 13.58 67.0192 13.9533 67.5978 14.7C68.1765 15.4373 68.4658 16.422 68.4658 17.654H62.8658C62.9125 18.4193 63.1365 19.0447 63.5378 19.53C63.9485 20.006 64.5038 20.244 65.2038 20.244C66.2865 20.244 66.9538 19.7493 67.2058 18.76H68.3118C68.1438 19.5347 67.7892 20.1367 67.2478 20.566C66.7065 20.986 66.0252 21.196 65.2038 21.196ZM66.6458 15.092C66.2818 14.6813 65.7778 14.476 65.1338 14.476C64.4898 14.476 63.9765 14.6907 63.5938 15.12C63.2205 15.5493 62.9872 16.1093 62.8938 16.8H67.2478C67.2105 16.072 67.0098 15.5027 66.6458 15.092ZM72.3747 21.21C71.3854 21.21 70.6014 20.8693 70.0227 20.188C69.4534 19.4973 69.1687 18.5687 69.1687 17.402C69.1687 16.226 69.4674 15.2973 70.0647 14.616C70.662 13.9347 71.4227 13.594 72.3467 13.594C73.3267 13.594 74.0827 13.9907 74.6147 14.784H74.6427V10.99H75.7767V21H74.6427V20.118H74.6147C74.0454 20.846 73.2987 21.21 72.3747 21.21ZM72.4167 20.258C73.1914 20.258 73.7654 20.0013 74.1387 19.488C74.5214 18.9747 74.7127 18.284 74.7127 17.416C74.7127 16.5573 74.5074 15.8667 74.0967 15.344C73.6954 14.8213 73.1307 14.56 72.4027 14.56C71.74 14.56 71.2267 14.826 70.8627 15.358C70.508 15.8807 70.3307 16.5667 70.3307 17.416C70.3307 18.2653 70.508 18.9513 70.8627 19.474C71.2267 19.9967 71.7447 20.258 72.4167 20.258Z" fill="#1A9E78" />
                                      </svg>

                                    ) : (
                                      <svg width="148" height="32" viewBox="0 0 148 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <mask id="mask0_6270_31428" maskUnits="userSpaceOnUse" x="0" y="4" width="24" height="24">
                                          <rect y="4" width="24" height="24" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_6270_31428)">
                                          <path d="M8.39998 20.6538L12 17.0538L15.6 20.6538L16.6538 19.6L13.0538 16L16.6538 12.4L15.6 11.3462L12 14.9462L8.39998 11.3462L7.34615 12.4L10.9461 16L7.34615 19.6L8.39998 20.6538ZM12.0016 25.5C10.6877 25.5 9.45268 25.2506 8.29655 24.752C7.1404 24.2533 6.13472 23.5765 5.2795 22.7217C4.42427 21.8669 3.74721 20.8616 3.24833 19.706C2.74944 18.5504 2.5 17.3156 2.5 16.0017C2.5 14.6877 2.74933 13.4527 3.248 12.2966C3.74667 11.1404 4.42342 10.1347 5.27825 9.2795C6.1331 8.42427 7.13834 7.74721 8.29398 7.24833C9.44959 6.74944 10.6844 6.5 11.9983 6.5C13.3122 6.5 14.5473 6.74933 15.7034 7.248C16.8596 7.74667 17.8652 8.42342 18.7205 9.27825C19.5757 10.1331 20.2527 11.1383 20.7516 12.294C21.2505 13.4496 21.5 14.6844 21.5 15.9983C21.5 17.3122 21.2506 18.5473 20.752 19.7034C20.2533 20.8596 19.5765 21.8652 18.7217 22.7205C17.8669 23.5757 16.8616 24.2527 15.706 24.7516C14.5504 25.2505 13.3156 25.5 12.0016 25.5Z" fill="#E88206" />
                                        </g>
                                        <path d="M32.938 21V10.99H34.268L38.832 17.948L39.56 19.236H39.588V10.99H40.764V21H39.476L34.884 14.028L34.142 12.782H34.114V21H32.938ZM48.105 20.104C47.4704 20.832 46.6257 21.196 45.571 21.196C44.5164 21.196 43.667 20.832 43.023 20.104C42.3884 19.376 42.071 18.4707 42.071 17.388C42.071 16.3053 42.3884 15.4 43.023 14.672C43.667 13.944 44.5164 13.58 45.571 13.58C46.6257 13.58 47.4704 13.944 48.105 14.672C48.7397 15.4 49.057 16.3053 49.057 17.388C49.057 18.4707 48.7397 19.376 48.105 20.104ZM43.835 19.446C44.2457 19.978 44.8244 20.244 45.571 20.244C46.3177 20.244 46.8917 19.978 47.293 19.446C47.6944 18.9047 47.895 18.2187 47.895 17.388C47.895 16.548 47.6897 15.862 47.279 15.33C46.8777 14.7887 46.3084 14.518 45.571 14.518C44.8244 14.518 44.2457 14.7887 43.835 15.33C43.4337 15.8713 43.233 16.5573 43.233 17.388C43.233 18.2187 43.4337 18.9047 43.835 19.446ZM49.5893 14.686V13.762H50.6393V11.48H51.7733V13.762H53.1733V14.686H51.7733V19.39C51.7733 19.838 52.0159 20.062 52.5013 20.062C52.7066 20.062 52.9073 20.0293 53.1033 19.964H53.1453V20.944C52.8373 21.0093 52.5339 21.042 52.2353 21.042C51.1713 21.042 50.6393 20.5753 50.6393 19.642V14.686H49.5893ZM59.4287 21L55.9427 10.99H57.3007L59.7647 18.438L60.1567 19.782H60.1847C60.3434 19.1847 60.4741 18.7367 60.5767 18.438L63.0127 10.99H64.3287L60.8147 21H59.4287ZM67.4187 21.196C66.3454 21.196 65.4914 20.8367 64.8567 20.118C64.2314 19.39 63.9187 18.48 63.9187 17.388C63.9187 16.3147 64.236 15.414 64.8707 14.686C65.5147 13.9487 66.3407 13.58 67.3487 13.58C68.4127 13.58 69.234 13.9533 69.8127 14.7C70.3914 15.4373 70.6807 16.422 70.6807 17.654H65.0807C65.1274 18.4193 65.3514 19.0447 65.7527 19.53C66.1634 20.006 66.7187 20.244 67.4187 20.244C68.5014 20.244 69.1687 19.7493 69.4207 18.76H70.5267C70.3587 19.5347 70.004 20.1367 69.4627 20.566C68.9214 20.986 68.24 21.196 67.4187 21.196ZM68.8607 15.092C68.4967 14.6813 67.9927 14.476 67.3487 14.476C66.7047 14.476 66.1914 14.6907 65.8087 15.12C65.4354 15.5493 65.202 16.1093 65.1087 16.8H69.4627C69.4254 16.072 69.2247 15.5027 68.8607 15.092ZM72.9235 13.762V14.966H72.9515C73.1849 14.5833 73.4882 14.2753 73.8615 14.042C74.2349 13.7993 74.6502 13.678 75.1075 13.678C75.2755 13.678 75.4295 13.706 75.5695 13.762V14.854H75.5275C75.3875 14.8073 75.2195 14.784 75.0235 14.784C74.4449 14.784 73.9502 14.9893 73.5395 15.4C73.1289 15.8013 72.9235 16.3287 72.9235 16.982V21H71.7895V13.762H72.9235ZM76.5884 21V13.762H77.7224V21H76.5884ZM76.5884 12.39V10.99H77.7224V12.39H76.5884ZM78.806 14.686V13.762H79.8V12.6C79.8 12.0027 79.9634 11.5733 80.29 11.312C80.6167 11.0413 81.0927 10.906 81.718 10.906C81.8954 10.906 82.0867 10.9153 82.292 10.934V11.9C82.1614 11.8907 82.04 11.886 81.928 11.886C81.564 11.886 81.3074 11.942 81.158 12.054C81.0087 12.166 80.934 12.3667 80.934 12.656V13.762H82.278V14.686H80.934V21H79.8V14.686H78.806ZM83.244 21V13.762H84.378V21H83.244ZM83.244 12.39V10.99H84.378V12.39H83.244ZM89.0066 21.196C87.9332 21.196 87.0792 20.8367 86.4446 20.118C85.8192 19.39 85.5066 18.48 85.5066 17.388C85.5066 16.3147 85.8239 15.414 86.4586 14.686C87.1026 13.9487 87.9286 13.58 88.9366 13.58C90.0006 13.58 90.8219 13.9533 91.4006 14.7C91.9792 15.4373 92.2686 16.422 92.2686 17.654H86.6686C86.7152 18.4193 86.9392 19.0447 87.3406 19.53C87.7512 20.006 88.3066 20.244 89.0066 20.244C90.0892 20.244 90.7566 19.7493 91.0086 18.76H92.1146C91.9466 19.5347 91.5919 20.1367 91.0506 20.566C90.5092 20.986 89.8279 21.196 89.0066 21.196ZM90.4486 15.092C90.0846 14.6813 89.5806 14.476 88.9366 14.476C88.2926 14.476 87.7792 14.6907 87.3966 15.12C87.0232 15.5493 86.7899 16.1093 86.6966 16.8H91.0506C91.0132 16.072 90.8126 15.5027 90.4486 15.092ZM96.1774 21.21C95.1881 21.21 94.4041 20.8693 93.8254 20.188C93.2561 19.4973 92.9714 18.5687 92.9714 17.402C92.9714 16.226 93.2701 15.2973 93.8674 14.616C94.4648 13.9347 95.2254 13.594 96.1494 13.594C97.1294 13.594 97.8854 13.9907 98.4174 14.784H98.4454V10.99H99.5794V21H98.4454V20.118H98.4174C97.8481 20.846 97.1014 21.21 96.1774 21.21ZM96.2194 20.258C96.9941 20.258 97.5681 20.0013 97.9414 19.488C98.3241 18.9747 98.5154 18.284 98.5154 17.416C98.5154 16.5573 98.3101 15.8667 97.8994 15.344C97.4981 14.8213 96.9334 14.56 96.2054 14.56C95.5428 14.56 95.0294 14.826 94.6654 15.358C94.3108 15.8807 94.1334 16.5667 94.1334 17.416C94.1334 18.2653 94.3108 18.9513 94.6654 19.474C95.0294 19.9967 95.5474 20.258 96.2194 20.258Z" fill="#E88206" />
                                      </svg>

                                    )
                                  }
                                </div>
                                <div className="text-sm text-gray-600">{team.NoOfMembers} members</div>
                              </div>
                            </div>

                            <div className="relative" ref={dropdownRef}>

                              <button
                                className="text-gray-600 hover:text-gray-800 "
                                onClick={() => toggleDropdown(team.TeamId)}
                              >
                                <svg width="6" height="24" viewBox="0 0 6 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.625 20.75C5.625 21.4462 5.34844 22.1139 4.85616 22.6062C4.36387 23.0984 3.69619 23.375 3 23.375C2.30381 23.375 1.63613 23.0984 1.14384 22.6062C0.651561 22.1139 0.375 21.4462 0.375 20.75C0.375 20.0538 0.651561 19.3861 1.14384 18.8938C1.63613 18.4016 2.30381 18.125 3 18.125C3.69619 18.125 4.36387 18.4016 4.85616 18.8938C5.34844 19.3861 5.625 20.0538 5.625 20.75ZM5.625 12C5.625 12.6962 5.34844 13.3639 4.85616 13.8562C4.36387 14.3484 3.69619 14.625 3 14.625C2.30381 14.625 1.63613 14.3484 1.14384 13.8562C0.651561 13.3639 0.375 12.6962 0.375 12C0.375 11.3038 0.651561 10.6361 1.14384 10.1438C1.63613 9.65156 2.30381 9.375 3 9.375C3.69619 9.375 4.36387 9.65156 4.85616 10.1438C5.34844 10.6361 5.625 11.3038 5.625 12ZM5.625 3.25C5.625 3.94619 5.34844 4.61387 4.85616 5.10616C4.36387 5.59844 3.69619 5.875 3 5.875C2.30381 5.875 1.63613 5.59844 1.14384 5.10616C0.651561 4.61387 0.375 3.94619 0.375 3.25C0.375 2.55381 0.651561 1.88613 1.14384 1.39384C1.63613 0.901562 2.30381 0.625 3 0.625C3.69619 0.625 4.36387 0.901562 4.85616 1.39384C5.34844 1.88613 5.625 2.55381 5.625 3.25Z" fill="#0A193A" />
                                </svg>

                              </button>
                              {activeDropdown === team.TeamId && (
                                <div className="absolute px-2 py-4 border-[2px]  right-0  w-48 rounded-xl shadow-2xl bg-white border-black-50  z-10" onClick={(e) => e.stopPropagation()}>
                                  {/*for admin only*/}
                                  {
                                    currentUser.Id === team.AdminId && (
                                      <>
                                        {
                                          team.IsProfileCreated ? (
                                            <button className="border-b block w-full text-left px-4 py-2  text-sm text-gray-900 hover:bg-gray-100" onClick={() => goToTeamPage(team.TeamId, 'editTeam')}>
                                              Edit team page
                                            </button>
                                          ) : (
                                            <button className="border-b block w-full text-left px-4 py-2  text-sm text-gray-900 hover:bg-gray-100" onClick={() => goToTeamPage(team.TeamId, 'createTeam')}>
                                              Create team page
                                            </button>
                                          )
                                        }
                                        <button
                                          className="border-b block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                                          onClick={() => {
                                            handleManageMembers(team.TeamId);
                                            setActiveDropdown(null);
                                          }}
                                        >
                                          Manage team members
                                        </button>
                                        {(team.TeamName == "" || team.TeamName == null) &&
                                          (<button
                                            className="block border-b w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                                            onClick={() => {
                                              setSelectedTeamId(team.TeamId);
                                              setTeamName(team.TeamName || '');
                                              setShowNameTeamModal(true);
                                              setActiveDropdown(null);
                                            }}
                                          >
                                            Name Team
                                          </button>)}
                                        <button className="block border-b w-full text-left px-4 py-2  text-sm text-red-600 hover:bg-gray-100"
                                          onClick={() => { deleteTeam(currentUser.Id, team.TeamId) }}
                                        >
                                          Delete team
                                        </button>
                                        <button className="border-b block w-full text-left px-4 py-2  text-sm text-gray-900 hover:bg-gray-100" onClick={() => goToTeamPage(team.TeamId, 'teamPage')}>
                                          Team page
                                        </button>
                                        <button className="block w-full text-left px-4 py-2  text-sm text-gray-900 hover:bg-gray-100" onClick={() => switchFunctionality(team)}>
                                          {(switchTeamData != null && switchTeamData.teamId == team.TeamId && switchTeamData.isActive == true) ? 'Switch back as user' : 'Switch as the team'}
                                        </button>
                                      </>
                                    )}
                                  {/*for members only*/}
                                  {
                                    currentUser.Id !== team.AdminId && (
                                      <>
                                        <button
                                          className="border-b block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                          onClick={() => {
                                            handleLeaveTeam(team.TeamId);
                                            setActiveDropdown(null);
                                          }}
                                        >
                                          Leave team
                                        </button>
                                        <button className="border-b block w-full text-left px-4 py-2  text-sm text-gray-900 hover:bg-gray-100" onClick={() => goToTeamPage(team.TeamId, 'teamPage')}>
                                          Team page
                                        </button>
                                      </>
                                    )
                                  }

                                  {
                                    team.IsProfileCreated ?? <button
                                      className="border-b block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                                      onClick={() => goToTeamPage(team.TeamId, 'teamPage')}>

                                      Visit team page
                                    </button>
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      }

                    </div>) : (<div className="p-10 text-center">No available team</div>)
                  }

                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-3 pb-4">
                  <div className="h-10 w-[6px] rounded-r-lg bg-[#0B1636]" />
                  <h2 className="text-xl font-semibold text-[#0B1636]">
                    Team Invitations
                  </h2>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="flex w-full max-w-xs gap-4">
                    <button
                      className={`flex-1 px-4 font-semibold py-2 rounded-xl text-center ${invitationTab === 'received'
                        ? 'bg-[#0B1636] text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                      onClick={() => setInvitationTab('received')}
                    >
                      Received
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 font-semibold rounded-xl text-center ${invitationTab === 'sent'
                        ? 'bg-[#0B1636] text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                      onClick={() => setInvitationTab('sent')}
                    >
                      Sent
                    </button>
                  </div>
                </div>



                <ul className="border rounded h-[300px] overflow-y-auto">
                  {invitationTab === 'received' && teamInvites.length > 0 ? (
                    <ul className="border rounded max-h-[300px] overflow-y-auto">
                      {teamInvites.map((invite, index) => (
                        <li key={invite.TeamId} className="p-3 border-b border-gray-300 flex justify-between items-center">
                          <div>
                            <p className="text-md font-semibold">{invite.TeamName}</p>
                            <p className="text-sm text-gray-600 font-semibold">{index + 1}. {invite.SenderName}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="bg-[#2357C6] text-white px-5 py-2 font-semibold rounded-xl hover:bg-[#709bf7]"
                              onClick={() => handleSubmitInvitation(invite, 'Accepted')}
                            > Accept</button>
                            <button
                              className="bg-[#E9EEF8] text-gray-900 px-5 py-2 font-semibold rounded-xl"
                              onClick={() => handleSubmitInvitation(invite, 'Rejected')}
                            > Reject</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : invitationTab === 'sent' && sentInvites.length > 0 ? (
                    <ul className="border rounded h-[300px] overflow-y-auto">
                      {sentInvites.map((invite, index) => (
                        <li
                          key={invite.TeamId ?? index}
                          className="p-3 border-b border-gray-300 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4 font-semibold">
                            {index + 1}.
                            <img
                              src={invite.ProfilePicture || BASE_URL}
                              alt={invite.Name}
                              className="w-[40px] h-[40px] rounded-full"
                            />
                            <div>
                              <p className="text-md font-semibold">{invite.TeamName}</p>
                              <p className="text-sm text-gray-600 font-semibold">
                                {invite.Name}
                              </p>
                            </div>
                          </div>

                          <div className='flex gap-3'>
                            {invite.Status === 'rejected' &&
                              (<Tooltip content="Reinvite">
                                <button
                                  onClick={() => { resendInvite(invite.TeamId, invite.UserId) }}
                                  className="text-green-600 hover:text-green-900 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#2357c6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                  >
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                    <path d="M21 3v5h-5"></path>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                    <path d="M8 16H3v5"></path>
                                  </svg>
                                </button>
                              </Tooltip>)}
                            <span
                              className={`px-4 py-1 rounded-xl font-semibold
                              ${invite.Status == 'accepted'
                                  ? 'text-green-600 bg-green-50'
                                  : invite.Status == 'invited'
                                    ? 'text-gray-800 bg-gray-100'
                                    : invite.Status === 'rejected'
                                      ? 'text-red-600 bg-red-50'
                                      : 'text-gray-600 bg-gray-100'
                                }`}
                            >
                              {invite.Status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 py-5 text-center">No invitations to display.</p>
                  )}

                </ul>
              </div>

            </>
          )}

          {activeTab === 'billing' && (
            <div id="billing" className="tab-content hidden-tab mt-6">
              <div className="flex justify-between items-end sm:items-center mb-3 flex-col sm:flex-row">
                <h3 className="text-lg font-semibold w-full">
                  Subscription Plan Detail
                </h3>
                <button
                  className="px-4 py-3 rounded-md bg-[#0b1636] text-white font-semibold disabled:bg-omblue-50 disabled:text-omblue-200 w-full max-w-[300px] btn-secondary flex items-center justify-center gap-4 ms-0 h-[46px]"
                  onClick={() => setShowModal(true)}
                >
                  Change Plan or Payment Method
                </button>
              </div>

              <div className="border border-[#BABAB9] bg-[#FCFCFC] p-6 rounded-sm mb-4">
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full">
                    <thead className="bg-[#F9F9F8]">
                      <tr>
                        <th className="py-3 px-4 text-left text-md font-normal text-gray-600 uppercase">
                          TYPE
                        </th>
                        <th className="py-3 px-4 text-left text-md font-normal text-gray-600 uppercase">
                          Purchase Date
                        </th>
                        <th className="py-3 px-4 text-left text-md font-normal text-gray-600 uppercase">
                          Active Until
                        </th>
                        <th className="py-3 px-4 text-left text-md font-normal text-gray-600 uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border-b border-t">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#0b1636]"></td>{' '}
                        <td className="py-3 px-4 font-semibold text-[#0b1636]">
                          {billingData?.userData?.PurchaseDate || ''}
                        </td>{' '}
                        <td className="py-3 px-4 font-semibold text-[#0b1636]">
                          {billingData?.userData?.ActiveTillDate || ''}
                        </td>{' '}
                        <td className="py-3 px-4 font-semibold text-[#0b1636]">
                          {billingData?.userData?.Amount || '$0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Profiles</h3>
                  <div className="flex items-center gap-4 w-full max-w-[400px] p-3 border border-[#E5E5E4] bg-white shadow-lg rounded-lg">
                    <div className="rounded-full h-[50px] w-[50px] shadow-md flex items-center justify-center">
                      <img
                        className="rounded-full h-[50px] w-[50px] object-cover"
                        src={
                          billingData?.userData?.ProfilePicture ||
                          'https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        }
                        alt=""
                      />
                    </div>
                    <div className="flex items-start flex-col gap-1">
                      <p className="text-black font-semibold">
                        {billingData?.userData?.CompanyName}
                      </p>
                      <div className="flex items-center w-full gap-3">
                        <div className="rounded-full w-[30px] h-[30px] bg-[#E3E3E2] flex items-center justify-center flex-col">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            width="20"
                            height="20"
                            x="0"
                            y="0"
                            viewBox="0 0 512 512"
                          >
                            <g>
                              <path
                                d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z"
                                fill="#9192A2"
                                opacity="1"
                                data-original="#9192A2"
                              ></path>
                            </g>
                          </svg>
                        </div>
                        <p>{billingData?.userData?.ProfileType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 pe-5">
                <h3 className="text-lg font-semibold">Transaction History</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F9F9F8]">
                    <tr>
                      <th className="py-3 px-4 text-left text-md font-bold text-gray-700">
                        Profile
                      </th>
                      <th className="py-3 px-4 text-left text-md font-bold text-gray-700">
                        Services
                      </th>
                      <th className="py-3 px-4 text-left text-md font-bold text-gray-700">
                        Date and Time
                      </th>
                      <th className="py-3 px-4 text-left text-md font-bold text-gray-700">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-left text-md font-bold text-gray-700">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-md font-bold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="border-b border-t">
                    {billingData?.EscrowHistorylist?.length > 0 ? (
                      billingData?.EscrowHistorylist?.map((item, index) => (
                        <>
                          <tr key={index}>
                            <td className="py-3 px-4 text-left text-gray-800 text-h9">
                              {item.ProfileType || ''}
                            </td>{' '}
                            <td className="py-3 px-4 text-left text-gray-800 text-h9">
                              {item.Service || ''}
                            </td>{' '}
                            <td className="py-3 px-4 text-left text-gray-800 text-h9">
                              {item.CreatedDate || ''}
                            </td>{' '}
                            <td className="py-3 px-4 text-left text-gray-800 text-h9">
                              {item.Amount || '$0'}
                            </td>{' '}
                            <td className="py-3 px-4 text-left text-gray-800 text-h9">
                              <div className="bg-green-100 text-green-700 py-1 px-3 inline-block rounded text-h9">
                                {item.Status || ''}
                              </div>
                            </td>{' '}
                            <td className="py-3 px-4 text-left text-gray-800 text-h9">
                              <div className="flex gap-3">
                                <button
                                  className="button bg-[#E9EEF8] text-omblue-500 flex items-center justify-center rounded h-[36px] w-[36px]"
                                  onClick={() => generateInvoice(item, 0)}
                                >
                                  <PasswordEye />
                                </button>

                                <button
                                  className="button bg-[#E9EEF8] text-omblue-500 flex items-center justify-center rounded h-[36px] w-[36px]"
                                  onClick={() => generateInvoice(item, 1)}
                                // onClick={()=>base64ToBlobDownload(item)}
                                >
                                  <Download />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-3 text-center text-gray-800"
                        >
                          No data available in table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div id="notifications" className="tab-content hidden-tab mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Message
                  </h2>
                  <p className="text-md text-gray-500">
                    Receive notifications for new messages from other users
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="Message"
                      className="sr-only peer"
                      checked={switches.Message}
                      onChange={handleSwitchChange}
                    />
                    <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                      {switches.Message ? (
                        <p className="absolute top-1/2 -translate-y-1/2 left-[8px] text-sm text-grey-800">
                          On
                        </p>
                      ) : (
                        <p className="absolute top-1/2 -translate-y-1/2 right-[8px] text-sm text-grey-800">
                          Off
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Review
                  </h2>
                  <p className="text-md text-gray-500">
                    Get notified when you receive a new review or feedback on
                    your transactions
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="Review"
                      className="sr-only peer"
                      checked={switches.Review}
                      onChange={handleSwitchChange}
                    />
                    <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                      {switches.Review ? (
                        <p className="absolute top-1/2 -translate-y-1/2 left-[8px] text-sm text-grey-800">
                          On
                        </p>
                      ) : (
                        <p className="absolute top-1/2 -translate-y-1/2 right-[8px] text-sm text-grey-800">
                          Off
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Match</h2>
                  <p className="text-md text-gray-500">
                    Receive notifications for new business development matches
                    or potential collaborations
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="Match"
                      className="sr-only peer"
                      checked={switches.Match}
                      onChange={handleSwitchChange}
                    />
                    <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                      {switches.Match ? (
                        <p className="absolute top-1/2 -translate-y-1/2 left-[8px] text-sm text-grey-800">
                          On
                        </p>
                      ) : (
                        <p className="absolute top-1/2 -translate-y-1/2 right-[8px] text-sm text-grey-800">
                          Off
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Any Transaction
                  </h2>
                  <p className="text-md text-gray-500">
                    Stay informed about any transaction-related updates,
                    including payment confirmations and status changes
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="AnyTransaction"
                      className="sr-only peer"
                      checked={switches.AnyTransaction}
                      onChange={handleSwitchChange}
                    />
                    <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                      {switches.AnyTransaction ? (
                        <p className="absolute top-1/2 -translate-y-1/2 left-[8px] text-sm text-grey-800">
                          On
                        </p>
                      ) : (
                        <p className="absolute top-1/2 -translate-y-1/2 right-[8px] text-sm text-grey-800">
                          Off
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="flex flex-col lg:flex-row gap-10 mt-6">
              {/* Change Password */}
              <div id="password" className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form
                  // onSubmit={
                  //   // handleSubmit(handlePasswordSubmit)
                  // }
                >
                  <div
                    className={`relative h-[48px] p-[1px] overflow-hidden w-full max-w-[500px] border ${errors?.CurrentPassword?.message
                      ? 'border-red-400'
                      : ' border-[#457EA2]'
                      }  outline-none rounded-md text-gray-700  mt-5`}
                  >
                    <button
                      className="absolute top-0 right-0 h-[46px] w-[46px] flex items-center justify-center bg-[#FAFAF9]"
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <PasswordCloseEye color="#68727F" />
                      ) : (
                        <PasswordEye color="#68727F" />
                      )}
                    </button>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Current Password"
                      className="h-[46px] w-full px-4 py-2 font-sm outline-none"
                      id="CurrentPassword"
                      {...register('CurrentPassword')}
                    />
                  </div>
                  {errors?.CurrentPassword && (
                    <span className=" text-red-400 text-sm my-2">
                      {errors?.CurrentPassword?.message}
                    </span>
                  )}
                  <div
                    className={`relative h-[48px] p-[1px] overflow-hidden w-full max-w-[500px] border ${errors?.Password?.message
                      ? 'border-red-400'
                      : 'border-[#457EA2]'
                      }  outline-none rounded-md text-gray-700  mt-5`}
                  >
                    <button
                      className="absolute top-0 right-0 h-[46px] w-[46px] flex items-center justify-center bg-[#FAFAF9]"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <PasswordCloseEye color="#68727F" />
                      ) : (
                        <PasswordEye color="#68727F" />
                      )}
                    </button>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      className="h-[46px] w-full px-4 py-2 font-sm outline-none"
                      id="Password"
                      {...register('Password')}
                    />
                  </div>
                  {errors?.Password && (
                    <span className=" text-red-400 text-sm my-2">
                      {errors?.Password?.message}
                    </span>
                  )}
                  <div
                    className={`relative h-[48px] p-[1px] overflow-hidden w-full max-w-[500px] border ${errors?.ConfirmNewPassword?.message
                      ? 'border-red-400'
                      : 'border-[#457EA2]'
                      }  outline-none rounded-md text-gray-700  mt-5`}
                  >
                    <button
                      className="absolute top-0 right-0 h-[46px] w-[46px] flex items-center justify-center bg-[#FAFAF9]"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <PasswordCloseEye color="#68727F" />
                      ) : (
                        <PasswordEye color="#68727F" />
                      )}
                    </button>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      className="h-[46px] w-full px-4 py-2 font-sm outline-none"
                      id="ConfirmNewPassword"
                      {...register('ConfirmNewPassword')}
                    />
                  </div>
                  {errors?.ConfirmNewPassword && (
                    <span className=" text-red-400 text-sm my-2">
                      {errors?.ConfirmNewPassword?.message}
                    </span>
                  )}
                  <button
                    className="px-4 my-5 rounded-md bg-omblue-500 text-white font-semibold disabled:bg-omblue-50 disabled:text-omblue-200 max-w-[500px] w-full btn-secondary flex items-center justify-center gap-4 ms-0 h-[46px]"
                    type="submit"
                  >
                    Change Password
                  </button>
                </form>
              </div>

              {/* Delete Account */}
              <div className="flex-1">
                <form
                  // onSubmit={(e) => { e.preventDefault(); HandleDeleteAccount(); }}
                >
                  <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
                  <p className="font-sm w-full text-black">
                    This action cannot be undone. Deleting your account will permanently remove all of your information, and you will lose access to the platform as soon as your account is deleted.
                  </p>
                  <div className="flex gap-2 mt-10">
                    <input
                      type="checkbox"
                      className="w-[30px]"
                      checked={isDeleteConfirmed}
                      onChange={(e) => setIsDeleteConfirmed(e.target.checked)}
                    />
                    <p className="font-sm font-semibold">I confirm, I want to delete this account.</p>
                  </div>
                  <div className={`relative h-[48px] p-[1px] overflow-hidden w-full border ${errors?.CurrentPassword?.message ? 'border-red-400' : 'border-[#457EA2]'} outline-none rounded-md text-gray-700 mt-5`}>
                    <button
                      className="absolute top-0 right-0 h-[46px] w-[46px] flex items-center justify-center bg-[#FAFAF9]"
                      type="button"
                      onClick={() => setShowCurrentPasswordDelete(!showCurrentPasswordDelete)}
                    >
                      {showCurrentPasswordDelete ? (
                        <PasswordCloseEye color="#68727F" />
                      ) : (
                        <PasswordEye color="#68727F" />
                      )}
                    </button>
                    <input
                      type={showCurrentPasswordDelete ? 'text' : 'password'}
                      placeholder="Current Password"
                      className="h-[46px] w-full px-4 py-2 font-sm outline-none"
                      id="CurrentPassword"
                      {...register('CurrentPasswordDelete')}
                    />
                  </div>
                  <button
                    className="px-4 my-5 rounded-md bg-omblue-500 text-white font-semibold disabled:bg-omblue-50 disabled:text-omblue-200 max-w-[500px] w-full btn-secondary flex items-center justify-center gap-4 ms-0 h-[46px]"
                    type="button"
                    onClick={() => {
                      if (!isDeleteConfirmed) {
                        toast.error('Please confirm deletion by checking the box.');
                        return;
                      }
                      const password = getValues('CurrentPasswordDelete');
                      if (!password) {
                        toast.error('Please enter your current password before deleting your account.');
                        return;
                      }
                      setShowDeleteFeedback(true);
                    }}
                  >
                    Delete Account
                  </button>
                </form>
              </div>
              {/* // Show feedback modal/component: */}
              <Modal
                title="Delete Account Feedback"
                showModal={showDeleteFeedback}
                setShowModal={setShowDeleteFeedback}
                modalSize="xs"
              >
                <DeleteAccountFeedback
                  onSubmit={async (feedbackString: string) => {
                    // will submit feedback and then delete account
                    await HandleDeleteAccount(feedbackString);
                  }}
                  onCancel={() => setShowDeleteFeedback(false)}
                />
              </Modal>
            </div>

          )}


          {activeTab === 'wallet' &&
            (!billingData?.userData?.IsAccountCreated ? (
              <div
                id="wallet"
                className="tab-content hidden-tab mt-6 text-center"
              >
                <button
                  className="px-4 py-3 rounded-md bg-[#0b1636] text-white font-semibold disabled:bg-omblue-50 disabled:text-omblue-200 w-full max-w-[210px] btn-secondary inline-flex items-center justify-center gap-4 ms-0 h-[46px]"
                  onClick={handleConnectWallet}
                  disabled={!!walletUrl}
                >
                  {loader ? 'Setting Up Stripe Wallet' : 'Set Up Stripe Wallet'}
                </button>
                {walletUrl && (
                  <>
                    <div className="flex items-center justify-center gap-1 mt-5">
                      <p className="text-sm text-gray-500">
                        Use below link to connect the stripe account:
                      </p>
                      <a
                        className="text-sm underline text-[#0b1636]"
                        href={walletUrl}
                        target="_blank"
                      >
                        Connect
                      </a>
                    </div>
                    <div className='flex items-center gap-2 justify-center my-2'>
                      <p className='text-sm text-gray-500'>
                        This link is valid for only once. If you already visit
                        it then please re-generate by clicking on the icon.
                      </p>
                      <div className='cursor-pointer' onClick={refreshLink}>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="20"
                          height="20"
                          x="0"
                          y="0"
                          viewBox="0 0 438.529 438.528"
                        >
                          <g>
                            <path
                              d="M433.109 23.694c-3.614-3.612-7.898-5.424-12.848-5.424-4.948 0-9.226 1.812-12.847 5.424l-37.113 36.835c-20.365-19.226-43.684-34.123-69.948-44.684C274.091 5.283 247.056.003 219.266.003c-52.344 0-98.022 15.843-137.042 47.536-39.021 31.689-64.715 73.035-77.087 124.048v1.997c0 2.474.903 4.617 2.712 6.423 1.809 1.809 3.949 2.712 6.423 2.712h56.814c4.189 0 7.042-2.19 8.566-6.565 7.993-19.032 13.035-30.166 15.131-33.403 13.322-21.698 31.023-38.734 53.103-51.106 22.082-12.371 45.873-18.559 71.376-18.559 38.261 0 71.473 13.039 99.645 39.115l-39.406 39.397c-3.607 3.617-5.421 7.902-5.421 12.851 0 4.948 1.813 9.231 5.421 12.847 3.621 3.617 7.905 5.424 12.854 5.424h127.906c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.42-7.898 5.42-12.847V36.542c0-4.949-1.796-9.23-5.42-12.848zM422.253 255.813h-54.816c-4.188 0-7.043 2.187-8.562 6.566-7.99 19.034-13.038 30.163-15.129 33.4-13.326 21.693-31.028 38.735-53.102 51.106-22.083 12.375-45.874 18.556-71.378 18.556-18.461 0-36.259-3.423-53.387-10.273-17.13-6.858-32.454-16.567-45.966-29.13l39.115-39.112c3.615-3.613 5.424-7.901 5.424-12.847 0-4.948-1.809-9.236-5.424-12.847-3.617-3.62-7.898-5.431-12.847-5.431H18.274c-4.952 0-9.235 1.811-12.851 5.431C1.807 264.844 0 269.132 0 274.08v127.907c0 4.945 1.807 9.232 5.424 12.847 3.619 3.61 7.902 5.428 12.851 5.428 4.948 0 9.229-1.817 12.847-5.428l36.829-36.833c20.367 19.41 43.542 34.355 69.523 44.823 25.981 10.472 52.866 15.701 80.653 15.701 52.155 0 97.643-15.845 136.471-47.534 38.828-31.688 64.333-73.042 76.52-124.05.191-.38.281-1.047.281-1.995 0-2.478-.907-4.612-2.715-6.427-1.81-1.799-3.953-2.706-6.431-2.706z"
                              fill="#000000"
                              opacity="1"
                              data-original="#000000"
                            ></path>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                id="wallet"
                className="tab-content hidden-tab mt-6 text-center"
              >
                <StyledTick className="text-green-700 mb-3 inline-block h-20 w-20" />
                <p className="font-semibold">Your wallet is connected</p>
              </div>
            ))}
          {activeTab === 'chats' && (
            <div id="chats" className="tab-content hidden-tab mt-6">
              <ChatSettings />
            </div>
          )}


          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            title="Subscription Plan Payment"
            modalSize='sm'
          >
            <Elements stripe={loadStripe((process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string))}>
              <CreditCardPayment userData={currentUser} showModal={showModal} />
            </Elements>
          </Modal>
          <Modal
            showModal={showInvoice}
            setShowModal={setShowInvoice}
            title="Invoice"
          >
            <iframe
              src={invoice}
              width="100%"
              height="600px"
              title="PDF Viewer"
            />
          </Modal>
        </div >
      </div >

      {
        showNameTeamModal && (
          <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-strong">Name Your Team</h3>
                <button
                  onClick={() => {
                    setShowNameTeamModal(false);
                    setTeamName('');
                    setSelectedTeamId(null);
                  }}
                  className="w-5 h-5 flex items-center justify-center text-gray-700 text-2xl rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  <span>×</span>
                </button>
              </div>

              <div className="mb-4">

                <input
                  type="text"
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-3 border rounded text-sm placeholder:text-gray-400 border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowNameTeamModal(false);
                    setTeamName('');
                    setSelectedTeamId(null);
                  }}
                  className="px-4 py-2 rounded-lg text-gray-700 font-medium bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameTeamSubmit}
                  className="px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )
      }
      {
        showManageMembersModal && (
          <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-strong">Manage Team Members</h3>
                <button
                  onClick={() => {
                    setShowManageMembersModal(false);
                    setSearchQueryForManagement('');
                    setFilteredUsersForManagement([]);
                  }}
                  className="w-5 h-5 flex items-center justify-center text-gray-700 text-2xl rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  <span>×</span>
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search for users to add..."
                  value={searchQueryForManagement}
                  onChange={(e) => setSearchQueryForManagement(e.target.value)}
                  className="w-full p-3 border rounded text-sm placeholder:text-gray-400 border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {filteredUsersForManagement.length > 0 && (
                <>
                  <h4 className="font-medium mt-4 mb-2">Search Results</h4>
                  <ul className="border rounded divide-y">
                    {filteredUsersForManagement.map((user) => (
                      <li key={user.UserProfileId} className="p-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.ProfilePicture || BASE_URL}
                            className="w-8 h-8 rounded-full"
                            alt={user.Name}
                          />
                          <span>{user.Name}</span>
                        </div>
                        <button
                          onClick={() => handleAddMember(selectedTeamForManagement, user.UserProfileId)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Invite
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="flex-1 overflow-y-auto mb-4">
                <h4 className="font-medium mb-2">Current Members</h4>
                <ul className="border rounded divide-y">
                  {currentTeamMembers.map((member) => (

                    <div key={member.UserId}>
                      {
                        currentUser.Id != member.UserId && (<li key={member.UserId} className="p-3 flex justify-between items-center">

                          <div className="flex items-center gap-3">
                            <img
                              src={member.ProfilePicture || BASE_URL}
                              className="w-8 h-8 rounded-full"
                              alt={member.Name}
                            />
                            <span>{member.Name}</span>
                          </div>
                          {(member.UserId !== currentUser?.Id && member.Status == 'member') && (
                            <button
                              onClick={() => handleRemoveMember(selectedTeamForManagement, member.UserId)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                          {member.Status == 'invited' && (
                            <div className='flex gap-2'>
                              <p className='bg-blue-50  rounded-[5px] px-2  text-blue-strong'>Invited</p>

                              <button
                                onClick={() => handleRemoveMember(selectedTeamForManagement, member.UserId)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                          {member.Status == 'rejected' && (
                            <div className='flex gap-2'>
                              <p className='bg-gray-100  rounded-sm px-2  text-gray-700'>Rejected</p>
                              <button
                                onClick={() => handleRemoveMember(selectedTeamForManagement, member.UserId)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>

                          )}

                        </li>)
                      }

                    </div>

                  ))}
                </ul>


              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowManageMembersModal(false);
                    setSearchQueryForManagement('');
                    setFilteredUsersForManagement([]);
                  }}
                  className="px-4 py-2 rounded-lg text-gray-700 font-medium bg-gray-200 hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};
export default Settings;
