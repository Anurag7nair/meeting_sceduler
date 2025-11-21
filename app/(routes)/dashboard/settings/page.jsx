"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { app } from '@/config/FirebaseConfig'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { Mail, Building2, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Settings() {
    const db = getFirestore(app);
    const { user } = useKindeBrowserClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Business details
    const [businessName, setBusinessName] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    
    // User details
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPicture, setUserPicture] = useState('');

    useEffect(() => {
        if (user) {
            loadBusinessInfo();
            // Set user details from Kinde
            setUserEmail(user.email || '');
            setUserPicture(user.picture || '');
            // Load user name from business document or use Kinde name
            const kindeName = `${user.given_name || ''} ${user.family_name || ''}`.trim();
            setUserName(kindeName);
        }
    }, [user]);

    const loadBusinessInfo = async () => {
        try {
            if (!user?.email) return;
            
            setLoading(true);
            const docRef = doc(db, 'Business', user.email);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBusinessName(data.businessName?.replace(/_/g, ' ') || '');
                setBusinessEmail(data.email || user.email || '');
                // If userName exists in business doc, use it; otherwise keep Kinde name
                if (data.userName) {
                    setUserName(data.userName);
                }
            } else {
                setBusinessEmail(user.email || '');
            }
        } catch (error) {
            console.error('Error loading business info:', error);
            toast('Failed to load business information');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!user?.email) {
                toast('User not authenticated');
                return;
            }

            setSaving(true);
            const docRef = doc(db, 'Business', user.email);
            
            // Update business document
            await updateDoc(docRef, {
                businessName: businessName.replace(/\s+/g, '_'), // Replace spaces with underscores
                userName: userName,
                email: user.email
            });

            toast('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast('Failed to update settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className='p-10'>
                <h2 className='font-bold text-2xl'>Settings</h2>
                <div className='mt-10 flex items-center justify-center'>
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className='p-10'>
            <h2 className='font-bold text-3xl text-slate-800 mb-2'>Settings</h2>
            <p className='text-slate-500 mb-6'>Manage your account and business information</p>
            <hr className='my-7 border-slate-200'></hr>

            {/* Account Details Section */}
            <div className='mb-10'>
                <h2 className='font-bold text-xl mb-5 flex items-center gap-2 text-slate-800'>
                    <User className='h-5 w-5 text-indigo-600' />
                    Account Details
                </h2>
                
                <div className='bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4'>
                    {/* User Profile Picture */}
                    {userPicture && typeof userPicture === 'string' && userPicture.trim() !== '' && (
                        <div className='flex items-center gap-4 mb-4'>
                            <Image 
                                src={userPicture} 
                                alt='Profile' 
                                width={80} 
                                height={80}
                                className='rounded-full'
                            />
                            <div>
                                <p className='text-sm text-gray-500'>Profile Picture</p>
                                <p className='text-xs text-gray-400'>Managed by your authentication provider</p>
                            </div>
                        </div>
                    )}

                    {/* User Name */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                            Full Name
                        </label>
                        <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your full name"
                            className="max-w-md"
                        />
                        <p className='text-xs text-gray-400 mt-1'>This name will be used in meeting communications</p>
                    </div>

                    {/* User Email (Read-only) */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Email Address
                        </label>
                        <Input
                            value={userEmail}
                            disabled
                            className="max-w-md bg-gray-100"
                        />
                        <p className='text-xs text-gray-400 mt-1'>Email cannot be changed</p>
                    </div>
                </div>
            </div>

            {/* Business Details Section */}
            <div className='mb-10'>
                <h2 className='font-bold text-xl mb-5 flex items-center gap-2 text-slate-800'>
                    <Building2 className='h-5 w-5 text-indigo-600' />
                    Business Details
                </h2>
                
                <div className='bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4'>
                    {/* Business Name */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                            Business Name
                        </label>
                        <Input
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Enter your business name"
                            className="max-w-md"
                        />
                        <p className='text-xs text-gray-400 mt-1'>This name appears in your meeting links and emails</p>
                    </div>

                    {/* Business Email (Read-only) */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Business Email
                        </label>
                        <Input
                            value={businessEmail}
                            disabled
                            className="max-w-md bg-gray-100"
                        />
                        <p className='text-xs text-gray-400 mt-1'>Business email matches your account email</p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <Button 
                className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all" 
                onClick={handleSave}
                disabled={saving || !businessName.trim() || !userName.trim()}
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
    )
}

export default Settings

