'use client';

// material-ui
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project-imports
import FadeInWhenVisible from './Animation';

const client1 = '/assets/images/landing/partner-01.png';
const client2 = '/assets/images/landing/partner-02.png';
const client3 = '/assets/images/landing/partner-03.png';
const client4 = '/assets/images/landing/partner-04.png';
const client5 = '/assets/images/landing/partner-05.png';

// ==============================|| LANDING - PARTNER PAGE ||============================== //
export default function PartnerPage() {
  const items = [
    { image: client1 },
    { image: client2 },
    { image: client3 },
    { image: client4 },
    { image: client5 },
  ];
  return (
    <Container>
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}
      >
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ textAlign: 'center', marginBottom: 3 }}
          >
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2,
                }}
              >
                <Typography variant="h2">Partnering With</Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4,
                }}
              >
                <Typography>
                  Collaborating with leading brands to bring you exceptional
                  laundry solutions.
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="center"
          >
            {items.map((item, index) => (
              <Grid item key={index}>
                <FadeInWhenVisible>
                  <Box
                    sx={{
                      '& img': {
                        transition:
                          'all 0.08s cubic-bezier(0.37, 0.24, 0.53, 0.99)',
                        filter: 'grayscale(1)',
                        opacity: 0.4,
                        cursor: 'pointer',
                      },
                      '&:hover img': { filter: 'grayscale(0)', opacity: 1 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      sx={{ width: 'auto' }}
                    />
                  </Box>
                </FadeInWhenVisible>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
