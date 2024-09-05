// material-ui
import Grid from '@mui/material/Grid';

// project-imports
import OrderList from 'sections/order/order-list/OrderList';

// ==============================|| Pickup Request ||============================== //

export default function OrderDetailsPage({ customerId }: { customerId: string }) {
  return (
    <Grid container spacing={2.5} justifyContent="center">
      <Grid item xs={12}>
        <OrderList customerId={customerId} />
      </Grid>
    </Grid>
  );
}
