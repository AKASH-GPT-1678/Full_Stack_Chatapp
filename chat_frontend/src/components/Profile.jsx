import React, { useState } from 'react';
import { Camera, User, Mail, Phone, Bell, Shield, Moon, Globe, ArrowLeft, Check, X } from 'lucide-react';
import useIdStore from '../zustand';
import axios from 'axios';
import Avatar from "../assets/image.png";
const ProfileSettings = () => {
  const [profile, setProfile] = useState();

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    onlineStatus: true,
    readReceipts: true,
    language: 'English'
  });
  const [profileFile, setProfileFile] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);
  // ...existing code...


  const [isEditing, setIsEditing] = useState({});
  const [tempValues, setTempValues] = useState({});
  const token = useIdStore((state) => state.value);
  const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileFile(file);
      setShowUploadButton(true);

    }
  };
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('id');
  const loadMyProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/myprofile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("profile", response.data.response);
      setProfile(response.data.response);
      // setMyUserName(response.data.response.username);
      // setUserId(response.data.response._id);
      // setProfileImage(response.data.response.profileUrl);

      return response;


    } catch (error) {
      console.log(error);

    }
  };

  async function uploadProfilePhoto(profileFile) {
    if (!profileFile) {
      console.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile", profileFile); // must match "profile" in Upload.single("profile")

      const response = await axios.post(`${endpoint}/addprofile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.data;
      console.log("Upload success:", result);
      alert(`Profile uploaded successfully! URL: ${result.profilePhoto}`);
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      alert("Error uploading profile photo");
    }
  }


  const startEdit = (field, currentValue) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setTempValues(prev => ({ ...prev, [field]: currentValue }));
  };

  const cancelEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setTempValues(prev => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  };

  const saveEdit = (field) => {
    setProfile(prev => ({ ...prev, [field]: tempValues[field] }));
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setTempValues(prev => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  React.useEffect(() => {
    loadMyProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Profile & Settings</h1>
        </div>


        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {profile?.profileUrl ? (
                  <img
                    src={profile?.profileUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{profile?.username}</h2>
            <p className="text-gray-500">@{profile?.username}</p>
            {showUploadButton && <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-colors" onClick={uploadProfilePhoto(profileFile)}>
              Upload
            </button>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>

          {/* Username */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                {isEditing?.username ? (
                  <input
                    type="text"
                    value={tempValues?.username}
                    onChange={(e) => setTempValues(prev => ({ ...prev, username: e.target.value }))}
                    className="text-gray-800 bg-gray-50 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">@{profile?.username}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing?.username ? (
                <>
                  <button
                    onClick={() => saveEdit('username')}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => cancelEdit('username')}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit('username', profile.username)}
                  className="text-blue-500 hover:bg-blue-50 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>



          {/* Email */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                {isEditing?.email ? (
                  <input
                    type="email"
                    value={tempValues.email}
                    onChange={(e) => setTempValues(prev => ({ ...prev, email: e.target.value }))}
                    className="text-gray-800 bg-gray-50 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{profile?.email}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing?.email ? (
                <>
                  <button
                    onClick={() => saveEdit('email')}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => cancelEdit('email')}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit('email', profile?.email)}
                  className="text-blue-500 hover:bg-blue-50 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                {isEditing?.app ? (
                  <input
                    type="tel"
                    value={tempValues.phone}
                    onChange={(e) => setTempValues(prev => ({ ...prev, phone: e.target.value }))}
                    className="text-gray-800 bg-gray-50 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{profile?.app}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing.app ? (
                <>
                  <button
                    onClick={() => saveEdit('app')}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => cancelEdit('app')}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit('app', profile.app)}
                  className="text-blue-500 hover:bg-blue-50 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          {/* <div className="flex items-start justify-between py-3">
            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Bio</p>
                {isEditing.bio ? (
                  <textarea
                    value={tempValues.bio}
                    onChange={(e) => setTempValues(prev => ({ ...prev, bio: e.target.value }))}
                    className="text-gray-800 bg-gray-50 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    rows="3"
                  />
                ) : (
                  <p className="text-gray-800">{profile.bio}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              {isEditing.bio ? (
                <>
                  <button 
                    onClick={() => saveEdit('bio')}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => cancelEdit('bio')}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => startEdit('bio', profile.bio)}
                  className="text-blue-500 hover:bg-blue-50 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>  */}
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">App Settings</h3>

          {/* Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-800">Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => toggleSetting('notifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <Moon className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-800">Dark Mode</p>
                <p className="text-sm text-gray-500">Use dark theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => toggleSetting('darkMode')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Online Status */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-gray-800">Show Online Status</p>
                <p className="text-sm text-gray-500">Let others see when you're online</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.onlineStatus}
                onChange={() => toggleSetting('onlineStatus')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Read Receipts */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-800">Read Receipts</p>
                <p className="text-sm text-gray-500">Show when you've read messages</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.readReceipts}
                onChange={() => toggleSetting('readReceipts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-800">Language</p>
                <p className="text-sm text-gray-500">App language</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
              <option value="German">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;


