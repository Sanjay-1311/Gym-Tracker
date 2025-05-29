import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createWorkoutLog, updateWorkout } from '../services/api';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';

function Logging() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const workout = location.state?.workout;
  const [exerciseLogs, setExerciseLogs] = useState([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');

  useEffect(() => {
    if (!workout) {
      navigate('/workouts');
      return;
    }

    // Initialize exercise logs with the workout's exercises
    setExerciseLogs(
      workout.exercises.map(exercise => ({
        ...exercise,
        sets: Array(parseInt(exercise.sets)).fill().map(() => ({
          reps: '',
          weight: ''
        }))
      }))
    );
  }, [workout, navigate]);

  const handleInputChange = (exerciseId, setIndex, field, value) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === exerciseId
          ? {
              ...log,
              sets: log.sets.map((set, idx) =>
                idx === setIndex ? { ...set, [field]: value } : set
              )
            }
          : log
      )
    );
  };

  const handleDeleteSet = (exerciseId, setIndex) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === exerciseId
          ? {
              ...log,
              sets: log.sets.filter((_, idx) => idx !== setIndex)
            }
          : log
      )
    );
  };

  const handleAddSet = (exerciseId) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === exerciseId
          ? {
              ...log,
              sets: [...log.sets, { reps: '', weight: '' }]
            }
          : log
      )
    );
  };

  const handleSaveLog = async () => {
    try {
      const logData = {
        userId: currentUser.uid,
        workoutId: workout._id,
        exercises: exerciseLogs.map(exercise => ({
          exerciseId: exercise._id || exercise.id,
          name: exercise.name,
          sets: exercise.sets.map((set, index) => ({
            exerciseId: exercise._id || exercise.id,
            setNumber: index + 1,
            reps: set.reps,
            weight: set.weight
          }))
        }))
      };

      await createWorkoutLog(logData);
      // Update the workout's lastCompleted field
      await updateWorkout(workout._id, { lastCompleted: new Date().toISOString() });
      navigate('/workouts');
    } catch (error) {
      console.error('Error saving workout log:', error);
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
          <Heading as="h1" size="xl" color={textColor}>{workout.name}</Heading>
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
          <Heading as="h2" size="lg" mb={4} color={textColor}>Log Your Sets</Heading>
          <VStack spacing={4} align="stretch">
            {exerciseLogs.map((exercise) => (
              <Card key={exercise._id || exercise.id} bg={cardBg} borderColor={borderColor} borderWidth="1px">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading as="h3" size="md" color={textColor}>{exercise.name}</Heading>
                      <HStack spacing={2}>
                        <Text fontSize="sm" color={mutedTextColor}>{exercise.sets.length} sets</Text>
                        <IconButton 
                          icon={<Icon as={Plus} size={16} />}
                          onClick={() => handleAddSet(exercise.id)}
                          size="sm"
                          colorScheme="green"
                          aria-label="Add Set"
                        />
                      </HStack>
                    </Flex>
                    <VStack spacing={4} align="stretch">
                      {exercise.sets.map((set, setIndex) => (
                        <Box key={`${exercise._id || exercise.id}-${setIndex}`} p={3} borderWidth="1px" borderColor={borderColor} borderRadius="md" bg={bgColor}>
                          <Flex justifyContent="space-between" alignItems="center" mb={3}>
                            <Text fontWeight="bold" color={textColor}>Set {setIndex + 1}</Text>
                            <IconButton 
                              icon={<Icon as={Trash2} size={16} />}
                              onClick={() => handleDeleteSet(exercise.id, setIndex)}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              aria-label="Delete Set"
                            />
                          </Flex>
                          <HStack spacing={4}>
                            <FormControl flex="1">
                              <FormLabel fontSize="sm" color={mutedTextColor}>Reps</FormLabel>
                              <Input
                                type="number"
                                value={set.reps}
                                onChange={(e) => handleInputChange(exercise.id, setIndex, 'reps', e.target.value)}
                                placeholder="Enter reps"
                                min="0"
                                bg={inputBg}
                                borderColor={inputBorderColor}
                              />
                            </FormControl>
                            <FormControl flex="1">
                              <FormLabel fontSize="sm" color={mutedTextColor}>Weight (kg)</FormLabel>
                              <Input
                                type="number"
                                value={set.weight}
                                onChange={(e) => handleInputChange(exercise.id, setIndex, 'weight', e.target.value)}
                                placeholder="Enter weight"
                                min="0"
                                step="0.5"
                                bg={inputBg}
                                borderColor={inputBorderColor}
                              />
                            </FormControl>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>

        <Button onClick={handleSaveLog} colorScheme="brand" size="lg" alignSelf="flex-end">
          Save Workout Log
        </Button>
      </VStack>
    </Container>
  );
}

export default Logging;


