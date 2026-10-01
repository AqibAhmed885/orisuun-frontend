'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { settings } from '@/app/api/dashboard/settings';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { chatApi } from '@/app/api/dashboard/chats';

const AddMemberModel = ({ parentTeamId, setOpenAddMembersModel }) => {
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    const [teamList, setTeamList] = useState([]);
    const [currentTeamMembers, setCurrentTeamMembers] = useState([]);
    const [selectedTeamForManagement, setSelectedTeamForManagement] = useState(null);
    const [searchQueryForManagement, setSearchQueryForManagement] = useState('');
    const [filteredUsersForManagement, setFilteredUsersForManagement] = useState([]);

    const handleManageMembers = () => {
        const team = teamList.find(t => t.TeamId === parentTeamId);
        if (team) {
            setCurrentTeamMembers(team.TeamMembers);
            setSelectedTeamForManagement(parentTeamId);
        }
    };

    const handleRemoveMember = async (teamId, userId) => {
        try {
            const response = await settings.removeTeamMember(teamId, userId);
            if (response.status === 200) {
                toast.success('Member removed successfully');
                fetchTeamData();
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
                fetchTeamData()
                setSearchQueryForManagement('');
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || 'Failed to send invitation');
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

    const fetchTeamData = async () => {
        try {
            const response = await settings.getTeamList(currentUser?.Id);
            if (response.status === 200) {
                const data = response.data.Result;
                setTeamList(data);
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
            // toast.error('Failed to fetch team data');
        }
    };

    useEffect(() => {
        fetchTeamData()
    }, [parentTeamId]);

    useEffect(() => {
        handleManageMembers()
    }, [teamList])

    return (
        <>
            <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-blue-strong">Invite Team Members</h3>
                        <button
                            onClick={() => {
                                setSearchQueryForManagement('');
                                setFilteredUsersForManagement([]);
                                setOpenAddMembersModel(false)
                            }}
                            className="w-5 h-5 flex items-center justify-center text-gray-700 text-2xl rounded-full bg-gray-300 hover:bg-gray-400"
                        >
                            <span>×</span>
                        </button>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search for users to invite..."
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

                                <div>
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
                                setSearchQueryForManagement('');
                                setFilteredUsersForManagement([]);
                                setOpenAddMembersModel(false)
                            }}
                            className="px-4 py-2 rounded-lg text-gray-700 font-medium bg-gray-200 hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AddMemberModel;
