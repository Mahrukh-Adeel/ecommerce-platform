import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        textAlign: 'center',
        py: 2,
        width: '100vw', 
        left: 0,
        bottom: 0,
        flexGrow: 1 
      }}
    >
      <Typography variant="h6" component="div">
        Everwood
      </Typography>
    </Box>
  );
}