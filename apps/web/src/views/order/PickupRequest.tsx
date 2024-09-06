// material-ui
import Grid from '@mui/material/Grid';

// project-imports
import PickupRequest from 'sections/order/pickup-request';

// ==============================|| Pickup Request ||============================== //

export default function PickupRequestPage() {
  return (
    <Grid container spacing={2.5} justifyContent="center">
      <Grid item xs={12}>
        <PickupRequest />
      </Grid>
    </Grid>
  );
}
