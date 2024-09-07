'use client';

import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import PickupRequest from 'sections/order/pickup-request';
import { useTheme } from '@mui/material/styles';

export default function CreateDelivery() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        width: '100%',
        minHeight: '90vh',
        paddingY: theme.spacing(10)
      }}
    >
      <Grid container spacing={2.5} justifyContent="center">
        <Grid item xs={12} md={8}>
          <PickupRequest />
        </Grid>
      </Grid>
    </Box>
  );
}
