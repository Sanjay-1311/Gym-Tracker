import React, { useState, useEffect } from "react";
import { Timer, Calendar, Dumbbell, Edit2, Play, History } from "lucide-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { getWorkoutLogs, getAllWorkouts } from './services/api';
import { Box, Heading, Text, Flex, Button, Card, CardBody, SimpleGrid, Icon, Spacer, useColorModeValue, VStack, HStack } from '@chakra-ui/react';

function RecentWorkouts() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        if (currentUser) {
          const data = await getAllWorkouts(currentUser.uid);
         
          // Sort workouts by lastCompleted date, most recent first
          const sortedWorkouts = data.sort((a, b) => {
            if (!a.lastCompleted) return 1;
            if (!b.lastCompleted) return -1;
            return new Date(b.lastCompleted) - new Date(a.lastCompleted);
          });
          // Take only the first 2 workouts, plus a slot for 'Create New Workout'
          setWorkouts(sortedWorkouts.slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
    // Set up an interval to refresh workouts every 5 seconds
    const intervalId = setInterval(fetchWorkouts, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentUser]);

  return (
    <Box mb={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h2" size="lg" color={textColor}>Recent Workouts</Heading>
        <Button as={RouterLink} to="/workouts" variant="link" colorScheme="brand" size="sm">
          View All
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {workouts.map(workout => (
          <Card key={workout._id} bg={cardBg} borderColor={cardBorderColor} borderWidth="1px">
            <CardBody>
              <Flex direction="column" justifyContent="space-between" h="100%">
                <Box>
                  <Heading as="h3" size="md" mb={2} color={textColor}>{workout.name}</Heading>
                  <Box fontSize="sm" color={mutedTextColor}>
                    <Flex alignItems="center" mb={1}>
                      <Icon as={Timer} mr={1} />
                      <Text>{workout.duration || 'N/A'}</Text>
                    </Flex>
                    <Flex alignItems="center">
                       <Icon as={Calendar} mr={1} />
                      <Text>Last: {workout.lastCompleted ? new Date(workout.lastCompleted).toLocaleDateString() : 'Never'}</Text>
                    </Flex>
                  </Box>
                </Box>
                 <Spacer />
                <Flex mt={4} gap={2}>
                  <Button
                    leftIcon={<Icon as={Play} />}
                    colorScheme="green"
                    onClick={() => navigate('/logging', { state: { workout } })}
                    size="sm"
                    flex="1"
                  >
                    Start
                  </Button>
                  <Button
                    leftIcon={<Icon as={History} />}
                    variant="outline"
                    colorScheme="gray"
                    onClick={() => navigate('/prev', { state: { workout } })}
                    size="sm"
                    flex="1"
                  >
                    Logs
                  </Button>
                   <Button
                    leftIcon={<Icon as={Edit2} />}
                    variant="outline"
                    colorScheme="gray"
                    onClick={() => navigate('/workouts')}
                    size="sm"
                     flex="1"
                  >
                    Edit
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        ))}

        {/* "Create New Workout" Card */}
        <Card onClick={() => navigate('/workouts')} cursor="pointer" _hover={{ shadow: "md", borderColor: useColorModeValue('brand.400', 'brand.600') }} borderWidth="1px" borderStyle="dashed" borderColor={useColorModeValue('gray.300', 'gray.600')} bg={cardBg}>
          <CardBody>
            <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center">
              <Icon as={Dumbbell} boxSize={12} mb={4} color="brand.500" />
              <Heading as="h3" size="md" mb={2} color={textColor}>Create New Workout</Heading>
              <Text fontSize="sm" color={mutedTextColor} mb={4}>Design your custom workout routine</Text>
              <Button colorScheme="brand" onClick={(e) => { e.stopPropagation(); navigate('/workouts'); }}>
                Create Workout
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

export default RecentWorkouts; 