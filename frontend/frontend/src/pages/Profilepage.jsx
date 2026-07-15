import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile, changePassword, uploadProfilePicture } from '@/features/profile/profileApi.js'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ui/ThemeToggle'

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
});

export default function ProfilePage() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user?.name || '' },
    });

    const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

    const profileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedUser) => {

            setUser(updatedUser);
            toast.success('Profile updated');
        }
    });

    const passwordMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => passwordForm.reset(),
    });

    const pictureMutation = useMutation({
        mutationFn: uploadProfilePicture,
        onSuccess: (updatedUser) => setUser(updatedUser),
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (

        <div className="p-4 space-y-6">
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <ThemeToggle />
            </div>
            {/* Profile picture */}
            <div className="flex flex-col items-center">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-blue-600">{user?.name?.[0]}</span>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) pictureMutation.mutate(file);
                    }}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 mt-2"
                >
                    {pictureMutation.isPending ? 'Uploading...' : 'Change photo'}
                </button>
            </div>

            {/* Update name */}
            <div className="bg-white rounded-2xl p-4">
                <h2 className="font-semibold text-gray-900 mb-3">Basic Info</h2>
                <form
                    onSubmit={profileForm.handleSubmit((data) => profileMutation.mutate(data))}
                    className="space-y-3"
                >
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...profileForm.register('name')} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input value={user?.email || ''} disabled />
                    </div>
                    <Button type="submit" size="sm" disabled={profileMutation.isPending}>
                        {profileMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    {profileMutation.isSuccess && <p className="text-sm text-green-600">Updated!</p>}
                </form>
            </div>

            {/* Change password */}
            <div className="bg-white rounded-2xl p-4">
                <h2 className="font-semibold text-gray-900 mb-3">Change Password</h2>
                <form
                    onSubmit={passwordForm.handleSubmit((data) => passwordMutation.mutate(data))}
                    className="space-y-3"
                >
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" {...passwordForm.register('currentPassword')} />
                        {passwordForm.formState.errors.currentPassword && (
                            <p className="text-sm text-red-500 mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" {...passwordForm.register('newPassword')} />
                        {passwordForm.formState.errors.newPassword && (
                            <p className="text-sm text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                    </div>
                    {passwordMutation.isError && (
                        <p className="text-sm text-red-500">
                            {passwordMutation.error?.response?.data?.message || 'Something went wrong'}
                        </p>
                    )}
                    {passwordMutation.isSuccess && <p className="text-sm text-green-600">Password updated!</p>}
                    <Button type="submit" size="sm" disabled={passwordMutation.isPending}>
                        {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">Log Out</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>You'll need to log in again to access your account.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}


