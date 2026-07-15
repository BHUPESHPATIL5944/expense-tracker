import {useForm} from 'react-hook-form';
import {zodResolver} from'@hookform/resolvers/zod';
import {z} from 'zod';
import {useMutation} from '@tanstack/react-query';
import {useNavigate,Link} from 'react-router-dom'
import {useAuth}  from '@/hooks/useAuth';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label'
import {toast} from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage(){
    const {login}=useAuth();
    const navigate=useNavigate();
    const{
      register,
      handleSubmit,
      formState:{errors},
    }=useForm({resolver:zodResolver(loginSchema)});

    const mutation = useMutation({
  mutationFn: login,
  onSuccess: () => {
    toast.success('Welcome back!');
    navigate('/');
  },
  onError: () => toast.error('Invalid email or password'),
});
    return (
        <div className="min-h-screen flex flex-col justify-center px-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
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
            {mutation.error?.response?.data?.message || 'Invalid email or password'}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/dashboard" className="text-blue-600 font-medium">Sign up</Link>
      </p>
    </div>
    )

}





