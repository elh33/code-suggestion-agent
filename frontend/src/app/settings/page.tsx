'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { User, Lock, Mail, ArrowLeft, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProfileSettingsPage() {
  const { isAuthenticated, username, userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load user data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const userData = await userService.getProfile(userId);

        setProfileData({
          username: userData.username || '',
          email: userData.email || '',
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);

        // Set username from auth context as fallback
        setProfileData((prev) => ({
          ...prev,
          username: username || '',
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, username, userId, router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveProfile = async () => {
    // Validate email format
    if (profileData.email && !validateEmail(profileData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!userId) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await userService.updateProfile(userId, {
        username: profileData.username,
        email: profileData.email,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    // Check for number
    if (!/\d/.test(passwordData.newPassword)) {
      setError('Password must contain at least one number');
      return;
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)) {
      setError('Password must contain at least one special character');
      return;
    }

    if (!userId) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await userService.changePassword(userId, {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      console.error('Error updating password:', err);

      // Handle specific error cases
      if (
        err.response?.data?.error &&
        err.response.data.error.includes('incorrect')
      ) {
        setError('Current password is incorrect');
      } else {
        setError(err.response?.data?.error || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          ></div>
        ))}

        {/* Planets */}
        <div className="absolute top-[15%] right-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-sm"></div>
        <div className="absolute bottom-[20%] left-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-sm"></div>
        <div className="absolute top-[60%] right-[20%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-sm"></div>
      </div>

      <div className="relative z-10 container mx-auto pt-8 pb-16 px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white mr-4"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        {/* Main content with tabs */}
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-[#0e0d14]/80 border border-gray-800 grid grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Password</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-[#0e0d14]/80 border-gray-800">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-24 h-24 mb-4 border-2 border-indigo-500/30">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${profileData.username || 'user'}.png`}
                        alt={profileData.username || 'User'}
                      />
                      <AvatarFallback className="text-lg font-medium">
                        {profileData.username?.slice(0, 2).toUpperCase() ||
                          'US'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-400">
                      Your avatar is automatically generated based on your
                      username
                    </p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 text-red-300 text-sm mb-4">
                      {error}
                    </div>
                  )}

                  {/* Success message */}
                  {success && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-md p-3 text-green-300 text-sm mb-4">
                      Profile updated successfully!
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="flex items-center text-sm text-gray-300"
                      >
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center text-sm text-gray-300"
                      >
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-gray-800 pt-6">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading || success}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    {loading ? (
                      'Saving...'
                    ) : success ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-[#0e0d14]/80 border-gray-800">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Error message */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 text-red-300 text-sm mb-4">
                      {error}
                    </div>
                  )}

                  {/* Success message */}
                  {success && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-md p-3 text-green-300 text-sm mb-4">
                      Password updated successfully!
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="flex items-center text-sm text-gray-300"
                      >
                        <Lock className="w-4 h-4 mr-2 text-gray-400" />
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="flex items-center text-sm text-gray-300"
                      >
                        <Lock className="w-4 h-4 mr-2 text-gray-400" />
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="flex items-center text-sm text-gray-300"
                      >
                        <Lock className="w-4 h-4 mr-2 text-gray-400" />
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-400">
                      Password requirements:
                    </p>
                    <ul className="text-xs text-gray-500 list-disc list-inside mt-1 space-y-1">
                      <li>At least 8 characters</li>
                      <li>At least one uppercase letter</li>
                      <li>At least one number</li>
                      <li>At least one special character</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-gray-800 pt-6">
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={loading || success}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    {loading ? (
                      'Updating...'
                    ) : success ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Updated
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
