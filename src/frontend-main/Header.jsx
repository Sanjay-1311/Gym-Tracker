import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, ChartBar, Calendar, User, LogOut, MoreVertical } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import MotivationalQuote from './MotivationalQuote';
import ColorModeToggle from './components/ColorModeToggle';
import { getUserProfile } from './services/api';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
  Button,
  Avatar,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react';

function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchUsername = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUsername(profile.username || currentUser.email);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUsername(currentUser.email);
        }
      }
    };

    fetchUsername();
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const NavigationMenu = () => (
    <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Button
          variant="ghost"
          leftIcon={<ChartBar size={20} />}
          colorScheme="brand"
          onClick={() => setIsQuoteModalOpen(true)}
        >
          Dashboard
        </Button>
      </Link>
      <Link to="/workouts">
        <Button
          variant="ghost"
          leftIcon={<Dumbbell size={20} />}
          colorScheme="brand"
        >
          Workouts
        </Button>
      </Link>
      <Link to="/schedule">
        <Button
          variant="ghost"
          leftIcon={<Calendar size={20} />}
          colorScheme="brand"
        >
          Schedule
        </Button>
      </Link>
      <Link to="/profile">
        <Button
          variant="ghost"
          leftIcon={<User size={20} />}
          colorScheme="brand"
        >
          Profile
        </Button>
      </Link>
    </HStack>
  );

  const MobileMenu = () => (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<MoreVertical size={20} />}
        variant="ghost"
        colorScheme="brand"
        display={{ base: 'flex', md: 'none' }}
      />
      <MenuList>
        <MenuItem
          icon={<ChartBar size={16} />}
          onClick={() => {
            navigate('/');
            setIsQuoteModalOpen(true);
          }}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          icon={<Dumbbell size={16} />}
          onClick={() => navigate('/workouts')}
        >
          Workouts
        </MenuItem>
        <MenuItem
          icon={<Calendar size={16} />}
          onClick={() => navigate('/schedule')}
        >
          Schedule
        </MenuItem>
        <MenuItem
          icon={<User size={16} />}
          onClick={() => navigate('/profile')}
        >
          Profile
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      py={4}
      px={6}
    >
      <Flex justify="space-between" align="center">
        <Link to="/">
          <Flex align="center" gap={2}>
            <Avatar bg="brand.500" icon={<Dumbbell size={24} />} />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              SculpTrack
            </Text>
          </Flex>
        </Link>

        <NavigationMenu />
        <MobileMenu />

        <HStack spacing={4}>
          <ColorModeToggle />
          {currentUser ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                colorScheme="brand"
                size={{ base: 'sm', md: 'md' }}
              >
                {isMobile ? username.split('@')[0] : username}
              </MenuButton>
              <MenuList>
                <MenuItem 
                  icon={<User size={16} />}
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem
                  icon={<LogOut size={16} />}
                  color="red.500"
                  onClick={handleSignOut}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/signin">
              <Button
                variant="ghost"
                leftIcon={<User size={20} />}
                colorScheme="brand"
              >
                Sign In
              </Button>
            </Link>
          )}
        </HStack>
      </Flex>

      <MotivationalQuote
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </Box>
  );
}

export default DashboardHeader;
