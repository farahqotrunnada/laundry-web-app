'use client';

import { useEffect, useState, SyntheticEvent } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useRouter } from 'next/navigation';

// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import instance from 'utils/axiosIntance';
import { openSnackbar } from 'api/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { SnackbarProps } from 'types/snackbar';
import { StringColorProps } from 'types/password';

// assets
import { Eye, EyeSlash } from 'iconsax-react';

// ============================|| SET PASSWORD COMPONENT ||============================ //

export default function AuthSetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Gunakan useSearchParams untuk mendapatkan token dari URL
  const token = searchParams.get('token'); // Ambil token dari URL

  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().max(255).required('Password is required'),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .test(
            'confirmPassword',
            'Both Password must be match!',
            (confirmPassword, yup) => yup.parent.password === confirmPassword,
          ),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          if (!token) {
            setErrors({ submit: 'Token is missing or invalid' });
            setSubmitting(false);
            return;
          }

          // Axios call untuk set password dengan menambahkan token dari URL ke dalam header Authorization
          const response = await instance().post(
            '/auth/set-password',
            {
              password: values.password,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Tambahkan token dari URL ke dalam header Authorization
              },
            },
          );

          openSnackbar({
            open: true,
            message: 'Successfully set password.',
            variant: 'alert',
            alert: {
              color: 'success',
            },
          } as SnackbarProps);

          setTimeout(() => {
            router.push('/login');
          }, 1500);

          setStatus({ success: true });
          setSubmitting(false);
        } catch (error: any) {
          console.error('Error during set-password request:', error); // Tambahkan logging di sini
          setStatus({ success: false });
          setErrors({
            submit: error.response?.data?.message || 'An error occurred',
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-set">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-set"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error id="helper-text-password-set">
                  {errors.password}
                </FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box
                      sx={{
                        bgcolor: level?.color,
                        width: 85,
                        height: 8,
                        borderRadius: '7px',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm-password-set">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(
                    touched.confirmPassword && errors.confirmPassword,
                  )}
                  id="confirm-password-set"
                  type="password"
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter confirm password"
                />
              </Stack>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="helper-text-confirm-password-set">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Set Password
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
