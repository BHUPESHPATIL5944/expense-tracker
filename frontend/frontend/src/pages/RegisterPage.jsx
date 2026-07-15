import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod';
import {useMutation} from '@tanstack/react-query';
import {useState} from 'react';
import { Link} from 'react-router-dom';
import {registerUser} from '@/features/auth/authApi';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function RegisterPage(){
    const [successMessage, setSuccessMessage]=useState(null);
    const{
        register,
        handleSubmit,
        formState:{errors},
    }=useForm({resolver:zodResolver(registerSchema)});// connnection of hook and zod

    const mutation=useMutation({
        mutationFn:registerUser,
        onSuccess:(data)=>setSuccessMessage(data.message),
    });
    if (successMessage) {
        return(
            <div className="min-h-screen flex items-center justify-center px-6 max-w-md mx-auto">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
                    <p className="text-green-500">{successMessage}</p>
                </div>
            </div>
        );
    }
return(
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-500">
            {mutation.error?.response?.data?.message || 'Something went wrong'}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating account...' : "Let's Go"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-medium">Log in</Link>
      </p>
    </div>
)
}
