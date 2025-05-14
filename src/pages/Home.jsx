import { Box, Typography, Button, Stack} from '@mui/material'
import React from 'react'
import CardComponent from '../components/CardComponent'
import shadows from '@mui/material/styles/shadows';
import '../App.css';

const Home = () => {
  return (
   
    <Box className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      
        <Typography variant='h3' fontWeight={'bold'}>Master</Typography><br />
        <Typography variant='h3' fontWeight={'bold'}>Productivity</Typography><br />
        <Typography variant='h3' fontWeight={'bold'}>Focus</Typography><br />
        <p className="hero-subtitle max-w-2xl">
          Our Chrome extension helps you stay focused, productive, and organized with smart tools and a simple interface.
        </p>
        
        <Button variant='contained' style={{backgroundColor: 'blue', borderRadius: '40px'}} > Add to Chrome 
        </Button>

      {/* Features Section */}
      
        <Stack mt={{sm: '32px', xs: '20px'}} direction={{ xs: 'column', sm: 'row' }} spacing={5}>
        <Box height={'400px'} width={'400px'} sx={{boxShadow: 1, borderRadius: '10px'}} className="card-container">
            Feature
        </Box>
        <Box  height={'400px'} width={'400px'} sx={{boxShadow: 1, borderRadius: '10px'}} className="card-container">
            Feature 2
        </Box>
        <Box  height={'400px'} width={'400px'} sx={{boxShadow: 1, borderRadius: '10px',}} className="card-container">
            Feature 3
        </Box>
        </Stack>

       

    </Box>
  );
}

function Feature({ title, description }) {
  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}


export default Home