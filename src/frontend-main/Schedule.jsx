import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getSchedules, createSchedule, updateScheduleStatus, deleteSchedule, getWorkouts, getUserProfile, getWorkoutLogs } from './services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, isPast, startOfDay, endOfDay, isAfter } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Select,
  Text,
  VStack,
  Grid,
  GridItem,
  useDisclosure,
  Badge,
  HStack,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Tooltip,
  Card,
  CardBody,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  AvatarBadge,
} from '@chakra-ui/react';

const Schedule = () => {
  const { currentUser, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('blue.500', 'blue.600');
  const calendarBg = useColorModeValue('gray.50', 'gray.700');
  const todayBg = useColorModeValue('blue.50', 'blue.900');
  const completedBg = useColorModeValue('green.50', 'green.900');
  const scheduledBg = useColorModeValue('blue.50', 'blue.900');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesData, workoutsData, userProfile] = await Promise.all([
          getSchedules(currentUser.uid),
          getWorkouts(currentUser.uid),
          getUserProfile(currentUser.uid)
        ]);
        setSchedules(schedulesData);
        setWorkouts(workoutsData);
        setUsername(userProfile.username);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.uid) {
      fetchData();
    }
  }, [currentUser]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (isPast(startOfDay(date)) && !isToday(date)) {
      return;
    }
    setSelectedDate(date);
    onOpen();
  };

  const handleScheduleWorkout = async () => {
    if (!selectedDate || !selectedWorkout) return;

    try {
      const workout = workouts.find(w => w._id === selectedWorkout);
      const newSchedule = await createSchedule({
        userId: currentUser.uid,
        workoutId: selectedWorkout,
        workoutName: workout.name,
        scheduledDate: selectedDate.toISOString(),
        status: 'scheduled'
      });

      setSchedules(prev => [...prev, newSchedule]);
      setSelectedDate(null);
      setSelectedWorkout('');
      onClose();
    } catch (error) {
      console.error('Error scheduling workout:', error);
    }
  };

  const handleStatusUpdate = async (scheduleId, newStatus) => {
    try {
      const updatedSchedule = await updateScheduleStatus(scheduleId, newStatus);
      setSchedules(prev => prev.map(schedule => 
        schedule._id === scheduleId ? updatedSchedule : schedule
      ));
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await deleteSchedule(scheduleId);
      setSchedules(prev => prev.filter(schedule => schedule._id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const getSchedulesForDate = (date) => {
    return schedules.filter(schedule => 
      isSameDay(new Date(schedule.scheduledDate), date)
    );
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Add new function to check and update missed workouts
  const checkMissedWorkouts = async () => {
    const now = new Date();
    const missedSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduledDate);
      return (
        schedule.status === 'scheduled' && 
        isPast(endOfDay(scheduleDate)) && 
        !isSameDay(scheduleDate, now)
      );
    });

    // Update each missed schedule
    for (const schedule of missedSchedules) {
      try {
        await handleStatusUpdate(schedule._id, 'missed');
      } catch (error) {
        console.error('Error updating missed schedule:', error);
      }
    }
  };

  // Add useEffect for periodic checking of missed workouts
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      // Check immediately when component mounts
      checkMissedWorkouts();

      // Set up interval to check every minute
      const intervalId = setInterval(checkMissedWorkouts, 60000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [currentUser, schedules]);

  const handleCompleteClick = async (schedule) => {
    try {
      // Get the workout details
      const workout = workouts.find(w => w._id === schedule.workoutId);
      if (!workout) return;

      // Get logs for today
      const today = new Date();
      const logs = await getWorkoutLogs(currentUser.uid);
      const todayLogs = logs.filter(log => 
        log.workoutId === schedule.workoutId && 
        isSameDay(new Date(log.completedAt), today)
      );

      if (todayLogs.length === 0) {
        // No logs found, redirect to logging page
        navigate('/logging', { state: { workout } });
      } else {
        // Logs exist, mark as completed
        await handleStatusUpdate(schedule._id, 'completed');
      }
    } catch (error) {
      console.error('Error handling complete click:', error);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <VStack spacing={4}>
          <Text fontSize="xl">Loading your schedule...</Text>
          <Box className="loading-spinner" />
        </VStack>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Card bg={bgColor} boxShadow="lg" borderRadius="xl" mb={8}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={8}>
            <Link to="/">
              <Flex align="center" gap={2}>
                <Avatar bg="blue.500" icon={<Dumbbell size={24} />} />
                <Heading size="lg" color={useColorModeValue('blue.500', 'blue.300')}>
                  SculptTrack
                </Heading>
              </Flex>
            </Link>
            <HStack spacing={4}>
              <Tooltip label={colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton
                  icon={colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  aria-label="Toggle color mode"
                  colorScheme="blue"
                />
              </Tooltip>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronRight />} variant="ghost">
                  {username || currentUser?.email}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <Divider />
                  <MenuItem color="red.500" onClick={handleSignOut}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <Flex justify="space-between" align="center" mb={6}>
            <IconButton
              icon={<ChevronLeft />}
              onClick={handlePrevMonth}
              variant="ghost"
              colorScheme="blue"
              aria-label="Previous month"
            />
            <Heading size="md" color={useColorModeValue('gray.700', 'white')}>
              {format(currentDate, 'MMMM yyyy')}
            </Heading>
            <IconButton
              icon={<ChevronRight />}
              onClick={handleNextMonth}
              variant="ghost"
              colorScheme="blue"
              aria-label="Next month"
            />
          </Flex>

          <Grid templateColumns="repeat(7, 1fr)" gap={1} bg={calendarBg} borderRadius="lg" overflow="hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <GridItem key={day} bg={headerBg} color="white" p={3} textAlign="center" fontWeight="bold">
                {day}
              </GridItem>
            ))}
            
            {days.map(day => {
              const daySchedules = getSchedulesForDate(day);
              const isCurrentDay = isToday(day);
              const isPastDate = isPast(startOfDay(day)) && !isToday(day);
              
              return (
                <GridItem
                  key={day.toString()}
                  bg={isCurrentDay ? todayBg : bgColor}
                  minH="140px"
                  p={3}
                  position="relative"
                  cursor={isPastDate ? "not-allowed" : "pointer"}
                  onClick={() => handleDateClick(day)}
                  _hover={{ 
                    bg: isPastDate 
                      ? useColorModeValue('gray.100', 'gray.700') 
                      : useColorModeValue('gray.50', 'gray.700') 
                  }}
                  border="1px solid"
                  borderColor={borderColor}
                  opacity={isPastDate ? 0.6 : 1}
                >
                  <Text
                    color={isPastDate ? "gray.400" : "inherit"}
                    fontWeight={isCurrentDay ? "bold" : "normal"}
                  >
                    {format(day, 'd')}
                  </Text>
                  
                  {daySchedules.map(schedule => (
                    <Box
                      key={schedule._id}
                      mt={2}
                      p={1}
                      borderRadius="md"
                      bg={
                        schedule.status === 'completed' 
                          ? completedBg 
                          : schedule.status === 'missed'
                            ? useColorModeValue('red.50', 'red.900')
                            : scheduledBg
                      }
                      fontSize="sm"
                    >
                      <HStack justify="space-between" align="center">
                        <Text noOfLines={1}>{schedule.workoutName}</Text>
                        {schedule.status === 'scheduled' && isToday(new Date(schedule.scheduledDate)) && (
                          <Button
                            size="xs"
                            colorScheme="green"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteClick(schedule);
                            }}
                          >
                            Complete
                          </Button>
                        )}
                      </HStack>
                    </Box>
                  ))}
                </GridItem>
              );
            })}
          </Grid>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent bg={bgColor}>
          <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
            Schedule Workout for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={4}>
              <Select
                placeholder="Select a workout"
                value={selectedWorkout}
                onChange={(e) => setSelectedWorkout(e.target.value)}
                size="lg"
                variant="filled"
              >
                {workouts.map(workout => (
                  <option key={workout._id} value={workout._id}>
                    {workout.name} - {workout.duration}
                  </option>
                ))}
              </Select>
              <HStack spacing={4} w="full">
                <Button
                  colorScheme="blue"
                  onClick={handleScheduleWorkout}
                  isDisabled={!selectedWorkout}
                  flex={1}
                  size="lg"
                >
                  Schedule Workout
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedWorkout('');
                    onClose();
                  }}
                  size="lg"
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Schedule; 