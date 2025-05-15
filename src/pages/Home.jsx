import React from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Bookmark, Speed, Shield, Sync, Search, Category, Devices } from '@mui/icons-material';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import CardComponent from '../components/ui/CardComponent';

const Home = () => {
  const features = [
    {
      icon: <Bookmark sx={{ fontSize: 32, color: 'white' }} />,
      title: "Smart Organization",
      description: "Automatically categorize and organize your bookmarks with AI-powered suggestions.",
      color: "#646cff"
    },
    {
      icon: <Search sx={{ fontSize: 32, color: 'white' }} />,
      title: "Quick Search",
      description: "Find any bookmark instantly with our powerful search functionality.",
      color: "#9c27b0"
    },
    {
      icon: <Category sx={{ fontSize: 32, color: 'white' }} />,
      title: "Custom Categories",
      description: "Create and manage custom categories to organize your bookmarks your way.",
      color: "#2196f3"
    },
    {
      icon: <Devices sx={{ fontSize: 32, color: 'white' }} />,
      title: "Cross-Platform",
      description: "Access your bookmarks seamlessly across all your devices.",
      color: "#4caf50"
    }
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box className="pt-32 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h1" 
              className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6"
            >
              BookmarkHub
            </Typography>
            <Typography 
              variant="h2" 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Your Digital Workspace
            </Typography>
            <Typography 
              variant="body1" 
              className="text-xl text-gray-600 max-w-2xl mb-8"
            >
              Organize, sync, and access your bookmarks across devices. Boost productivity with our intelligent bookmarking solution.
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained" 
                size="large"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Add to Chrome - It's Free
              </Button>
            </motion.div>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box className="py-16 px-4">
          <Typography 
            variant="h3" 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Why Choose BookmarkHub?
          </Typography>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4} 
            className="justify-center"
          >
            {features.map((feature, index) => (
              <CardComponent
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </Stack>
        </Box>

        {/* How It Works Section */}
        <Box className="py-16 px-4">
          <Typography 
            variant="h3" 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            How It Works
          </Typography>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4} 
            className="justify-center"
          >
            <CardComponent
              icon={<Speed sx={{ fontSize: 32, color: 'white' }} />}
              title="Install Extension"
              description="Add BookmarkHub to your Chrome browser with just one click."
              color="#646cff"
            />
            <CardComponent
              icon={<Shield sx={{ fontSize: 32, color: 'white' }} />}
              title="Sync Bookmarks"
              description="Your existing bookmarks are automatically imported and organized."
              color="#9c27b0"
            />
            <CardComponent
              icon={<Sync sx={{ fontSize: 32, color: 'white' }} />}
              title="Start Organizing"
              description="Use our smart tools to keep your bookmarks organized and accessible."
              color="#2196f3"
            />
          </Stack>
        </Box>

        {/* CTA Section */}
        <Box className="py-20 px-4 text-center">
          <Typography 
            variant="h3" 
            className="text-3xl font-bold mb-6 text-gray-800"
          >
            Ready to Transform Your Bookmarking Experience?
          </Typography>
          <Typography 
            variant="body1" 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of users who have already improved their productivity with BookmarkHub.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="contained" 
              size="large"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </Button>
          </motion.div>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Home;