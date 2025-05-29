import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { getWorkoutLogs, getAllWorkouts } from './services/api';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
  Text,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react';

function PreviousLogs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const workout = location.state?.workout;
  const [workoutLogs, setWorkoutLogs] = useState([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const tableHeaderBg = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (!workout) {
      navigate('/workouts');
      return;
    }

    loadWorkoutLogs();
  }, [workout, navigate, currentUser]);

  const loadWorkoutLogs = async () => {
    try {
      if (currentUser) {
        const logs = await getWorkoutLogs(currentUser.uid);
        const filteredLogs = logs.filter(log => log.workoutId === workout._id);
        const sortedLogs = filteredLogs.sort((a, b) => 
          new Date(b.completedAt) - new Date(a.completedAt)
        );
        setWorkoutLogs(sortedLogs);
      }
    } catch (error) {
      console.error('Error loading workout logs:', error);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      await deleteWorkoutLog(logId);
      await loadWorkoutLogs();
    } catch (error) {
      console.error('Error deleting workout log:', error);
    }
  };

  if (!workout) return null;

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Button onClick={() => navigate('/workouts')} variant="link" colorScheme="gray" leftIcon={<Icon as={ArrowLeft} />}>
            Back to Workouts
          </Button>
          <Heading as="h1" size="xl" color={textColor}>Previous Logs - {workout.name}</Heading>
        </Flex>

        <HStack spacing={4} color={mutedTextColor}>
          <Flex alignItems="center">
            <Icon as={Clock} mr={1} />
            <Text>{workout.duration}</Text>
          </Flex>
          {workout.lastCompleted && (
            <Flex alignItems="center">
              <Icon as={Calendar} mr={1} />
              <Text>Last: {new Date(workout.lastCompleted).toLocaleDateString()}</Text>
            </Flex>
          )}
        </HStack>

        <Box>
          <Heading as="h2" size="lg" mb={4} color={textColor}>Workout History</Heading>
          <VStack spacing={4} align="stretch">
            {workoutLogs.length > 0 ? (
              workoutLogs.map((log) => (
                <Card key={log._id} bg={cardBg} borderColor={borderColor} borderWidth="1px">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Flex justifyContent="space-between" alignItems="center">
                        <Heading as="h3" size="md" color={textColor}>{workout.name}</Heading>
                        <HStack spacing={4} alignItems="center">
                            <Text fontSize="sm" color={mutedTextColor}>
                              {new Date(log.completedAt).toLocaleDateString()}
                            </Text>
                            <IconButton 
                              icon={<Icon as={Trash2} size={16} />}
                              onClick={() => handleDeleteLog(log._id)}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              aria-label="Delete Log"
                            />
                        </HStack>
                      </Flex>
                      
                      <TableContainer>
                         <Table variant="simple" size="sm">
                            <Thead>
                                <Tr bg={tableHeaderBg}>
                                    <Th color={textColor}>Set</Th>
                                    <Th color={textColor}>Weight (kg)</Th>
                                    <Th color={textColor}>Reps</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {log.exercises.map(exercise => (
                                    // Assuming each exercise in a log has sets
                                    <React.Fragment key={exercise._id || exercise.id}>
                                      <Tr>
                                        <Td colSpan={3} fontWeight="bold" color={textColor}>{exercise.name}</Td>
                                      </Tr>
                                        {exercise.sets.map((set, setIndex) => (
                                            <Tr key={`${exercise._id || exercise.id}-${setIndex}`}>
                                                <Td color={mutedTextColor}>{set.setNumber}</Td>
                                                <Td color={mutedTextColor}>{set.weight || '-'}</Td>
                                                <Td color={mutedTextColor}>{set.reps || '-'}</Td>
                                            </Tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </Tbody>
                         </Table>
                      </TableContainer>

                    </VStack>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Box textAlign="center" color={mutedTextColor}>
                <Text>No previous logs found for this workout.</Text>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default PreviousLogs; 