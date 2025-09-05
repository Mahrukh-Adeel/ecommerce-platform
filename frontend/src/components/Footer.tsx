import { Box, Typography, Grid, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main', 
        color: 'background.default', 
        mt: 'auto',
        width: '100%',
        borderTop: `1px solid ${theme.palette.background.default}1A` // Adding alpha for transparency
      }}
    >
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{xs:12}}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                color: 'background.default',
                letterSpacing: 0.5
              }}
            >
              Everwood
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: `${theme.palette.background.default}CC`, // Adding alpha for 80% opacity
                lineHeight: 1.6,
                mb: 2
              }}
            >
              Premium furniture for your home. Quality craftsmanship and timeless design.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ borderColor: `${theme.palette.background.default}1A` }} /> {/* Adding alpha for 10% opacity */}
      <Box 
        sx={{ 
          py: 2, 
          px: { xs: 2, md: 4 },
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: `${theme.palette.background.default}B3`, // Adding alpha for 70% opacity
            fontSize: '13px'
          }}
        >
          © {currentYear} Everwood. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}