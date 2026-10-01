'use client';

import { chatApi } from '@/app/api/dashboard/chats';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface ChatRestrictionSettings {
  allowFavorited: boolean;
  allowMatched: boolean;
  allowFollowed: boolean;
  allowFollowers: boolean;
  allowAccountType: boolean;
  allowedAccountTypes: string[]; // keep as strings for frontend, convert to numbers for backend
}

const ChatSettings: React.FC = () => {
  const [settings, setSettings] = useState<ChatRestrictionSettings>({
    allowFavorited: false,
    allowMatched: false,
    allowFollowed: false,
    allowFollowers: false,
    allowAccountType: false,
    allowedAccountTypes: []
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentUser = typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData') || '{}');

  // Account types available for restriction
  const accountTypes = [
    { label: 'Black-owned Business', value: '1' },
    { label: 'Strategy Consultants', value: '2' },
    { label: 'Expert', value: '3' },
    { label: 'Advocate', value: '4' },
    { label: 'Partner', value: '5' },
    { label: 'Professional', value: '6' },
    { label: 'Mentor', value: '8' },
    { label: 'Investor', value: '7' },
    // { label: 'Mentor', value: '9' },
    // { label: 'Admin', value: '10' },
    // { label: 'SystemAdmin', value: '11' },
  ];

  useEffect(() => {
    if (currentUser?.Id) {
      fetchChatSettings();
    }
  }, [currentUser?.Id]); // fetchChatSettings is defined inside component, no need to add to deps

  const fetchChatSettings = async () => {
    try {
      setLoading(true);
      const response = await chatApi.getChatRestrictionSettings(currentUser.Id);
      if (response) {
        // Map backend response to frontend state
        setSettings({
          allowFavorited: response.AllowFavoritedUsers || false,
          allowMatched: response.AllowMatchedUsers || false,
          allowFollowed: response.AllowUsersYouFollow || false,
          allowFollowers: response.AllowYourFollowers || false,
          allowAccountType: response.RestrictByAccountType || false,
          allowedAccountTypes: (response.AccountTypes || []).map((item: any) => item.AccountTypeId.toString())
        });
      }

    } catch (error) {
      console.error('Error fetching chat settings:', error);
      // Set default settings if none exist
      setSettings({
        allowFavorited: false,
        allowMatched: false,
        allowFollowed: false,
        allowFollowers: false,
        allowAccountType: false,
        allowedAccountTypes: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (settingKey: keyof ChatRestrictionSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  const handleAccountTypeToggle = (accountType: string) => {
    setSettings(prev => ({
      ...prev,
      allowedAccountTypes: prev.allowedAccountTypes.includes(accountType)
        ? prev.allowedAccountTypes.filter(type => type !== accountType)
        : [...prev.allowedAccountTypes, accountType]
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // Map frontend settings to backend payload
      const settingsToSave = {
        UserId: currentUser.Id,
        AllowFavoritedUsers: settings.allowFavorited,
        AllowMatchedUsers: settings.allowMatched,
        AllowUsersYouFollow: settings.allowFollowed,
        AllowYourFollowers: settings.allowFollowers,
        RestrictByAccountType: settings.allowAccountType,
        AccountTypeIds: settings.allowedAccountTypes.map((type: string) => parseInt(type, 10)) // convert strings to numbers
      };

      await chatApi.saveChatRestrictionSettings(settingsToSave);
      toast.success('Chat restriction settings saved successfully!');
    } catch (error) {
      console.error('Error saving chat settings:', error);
      toast.error('Failed to save chat settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg  shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat Message Restrictions</h3>
        <p className="text-sm text-gray-600 mb-6">
          Control who can send you direct messages. Select the criteria that must be met for someone to message you.
          If no restrictions are selected, anyone can message you.
        </p>

        {/* Restriction Options */}
        <div className="space-y-4">
          {/* Allow Favorited Users */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Allow Favorited Users</h4>
              <p className="text-sm text-gray-600">Only users you have favorited can message you</p>
            </div>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.allowFavorited}
                onChange={(e) => handleSettingChange('allowFavorited', e.target.checked)}
              />
              <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                {settings.allowFavorited ? (
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

          {/* Allow Matched Users */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Allow Matched Users</h4>
              <p className="text-sm text-gray-600">Only users you have been matched with can message you</p>
            </div>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.allowMatched}
                onChange={(e) => handleSettingChange('allowMatched', e.target.checked)}
              />
              <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                {settings.allowMatched ? (
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

          {/* Allow Followed Users */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Allow Users You Follow</h4>
              <p className="text-sm text-gray-600">Only users you follow can message you</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.allowFollowed}
                onChange={(e) => handleSettingChange('allowFollowed', e.target.checked)}
              />
              <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                {settings.allowFollowed ? (
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

          {/* Allow Followers */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Allow Your Followers</h4>
              <p className="text-sm text-gray-600">Only users who follow you can message you</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.allowFollowers}
                onChange={(e) => handleSettingChange('allowFollowers', e.target.checked)}
              />
              <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                {settings.allowFollowers ? (
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

          {/* Account Type Restrictions */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-800">Restrict by Account Type</h4>
                <p className="text-sm text-gray-600">Only specific account types can message you</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="Message"
                  className="sr-only peer"
                  checked={settings.allowAccountType}
                  onChange={(e) => handleSettingChange('allowAccountType', e.target.checked)}
                />
                <div className="block relative bg-[#E7E8EB] w-16 h-9 p-1 rounded-full before:absolute before:bg-[#8E94A3] before:w-7 before:h-7 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-8 peer-checked:before:bg-omblue-500 before:z-50">
                  {settings.allowAccountType ? (
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

            {settings.allowAccountType && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Select allowed account types:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accountTypes.map((type) => {
                    return (
                      <label key={type.value} className="flex items-center space-x-3 cursor-pointer group p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                        <input
                          type="checkbox"
                          checked={settings.allowedAccountTypes.includes(type.value)}
                          onChange={() => handleAccountTypeToggle(type.value)}
                          className="sr-only peer"
                        />
                        <div className="relative w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-omblue-600 peer-checked:border-omblue-600 transition-all duration-200 group-hover:border-omblue-400">
                          <svg
                            className="absolute inset-0 w-4 h-4 opacity-100 peer-checked:opacity-100 transition-opacity duration-200"
                            fill="none"
                            stroke="white"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{type.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2 bg-omblue-600 text-white font-medium rounded-lg hover:bg-omblue-700 disabled:bg-omblue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatSettings;
