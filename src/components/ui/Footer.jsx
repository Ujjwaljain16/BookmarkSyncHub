import React from 'react';
import {Box,Stack,Typography} from '@mui/material';

const Footer = () => {
  return (
    <Box mt="80px" bgcolor = '#646cff'>
         <Stack 
        gap="0px" 
        alignItems="center" 
        px="40px" 
        pt="24px"
        pb="40px"
      >
        <Typography variant="h5" pb="40px" mt="20px">
          Made with ❤️ by <span style={{color: '#FF2625', fontSize: '22px'}}>Shreyansh</span>
        </Typography>
        <Typography variant="h7" pb="40px" mt="20px">
          © 2025 Shreyansh. All rights reserved.
        </Typography>
      </Stack>
    </Box>
  )
}

export default Footer