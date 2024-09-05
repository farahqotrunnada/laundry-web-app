import { loadUser, logout } from 'libs/auth/authSlices';
import { useAppDispatch, useAppSelector } from 'libs/hooks';
import { useEffect } from 'react';
import { isTokenExpired } from 'utils/authUtils/isTokenExpired';
import { refreshToken } from 'utils/authUtils/refreshToken';
import { getCookie } from 'cookies-next';

export default function useUser() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const accessToken = getCookie('access-token') as string;
    console.log('Access Token on page load:', accessToken);

    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        refreshToken().then((newToken) => {
          if (newToken) {
            dispatch(loadUser());
          } else {
            dispatch(logout());
          }
        });
      } else {
        dispatch(loadUser());
      }
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return user ? user : null;
}
