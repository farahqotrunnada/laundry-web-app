'use client';

import * as React from 'react';

import FullscreenLoader from '../loader/fullscreen';
import { Role } from '@/types/user';
import axios from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import { useLocalStorage } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps extends React.PropsWithChildren {
  allowed: Role[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ allowed, children }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [token, setToken] = useLocalStorage<string | null>('access_token', null);
  const [authhorized, setAuthhorized] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          let access = token;

          const decoded = jwtDecode<{ exp: number }>(token);
          if (decoded.exp < Date.now() / 1000) {
            const { data } = await axios.post('/auth/refresh');
            access = data.data.access_token;
            setToken(access);
          }

          const { data } = await axios.post(
            '/api/auth/verify',
            { token: access, allowed },
            { baseURL: 'http://localhost:3000' }
          );

          if (!data.protected) {
            setAuthhorized(true);
            return;
          }

          toast({
            title: 'You are not authorized',
            description: 'Please login with your credentials',
          });

          router.push('/');
        } catch (err) {
          toast({
            title: 'You are not authorized',
            description: 'Your token has expired, please login with your credentials',
          });
        }
      };

      verify();
    } else {
      toast({
        title: 'You are not logged in',
        description: 'Please login with your credentials',
      });
      router.push('/auth/login');
    }
  }, [token, setToken, allowed, router, toast]);

  if (!authhorized) return <FullscreenLoader />;

  return <>{children}</>;
};

export default AuthGuard;
