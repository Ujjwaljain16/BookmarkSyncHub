import React from 'react';
import {Stack} from '@mui/material';
import {Link} from 'react-router-dom';
import Logo from '../assets/react.svg';

const Navbar = () => {
  return (
    <Stack direction='row' justifyContent='space-around' sx={{gap: {sm: '122px', xs: '40px'}, mt: {sm: '32px', xs: '20px'}, justifyContent: 'none'}}>
        <Link to='/'>
            <img src={Logo} alt="logo" style={{width: '48px', height: '48px', margin: '0 20px'}} />
        </Link>
        <Link to='/' className='underline'>Home</Link>
    </Stack>
  )
}

export default Navbar;