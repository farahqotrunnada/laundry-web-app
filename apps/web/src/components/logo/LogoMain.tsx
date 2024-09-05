// material-ui
import { useTheme } from '@mui/material/styles';

const logo = '/assets/images/logo.png';
import { ThemeMode } from 'config';
import Image from 'next/image';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain({ reverse }: { reverse?: boolean }) {
  const theme = useTheme();
  return <Image src={theme.palette.mode === ThemeMode.DARK ? logo : logo} alt="icon logo" width="68" />;
}
