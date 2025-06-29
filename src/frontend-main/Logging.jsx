import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { createWorkoutLog, updateWorkout } from './services/api';
import { exerciseNames } from './data/exerciseNames';
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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
} from '@chakra-ui/react';

function Logging() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const workout = location.state?.workout;
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newExercise, setNewExercise] = useState('');

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
    // Initialize with exercises but no pre-filled sets
    setExerciseLogs(
      workout.exercises.map(exercise => ({
        ...exercise,
        sets: [], // Start with zero sets
      }))
    );
  }, [workout, navigate]);

  const handleInputChange = (exerciseId, setIndex, field, value) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        (log._id || log.id) === exerciseId
          ? {
              ...log,
              sets: log.sets.map((set, idx) =>
                idx === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : log
      )
    );
  };

  const handleRemoveSet = (exerciseId, setIndex) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        (log._id || log.id) === exerciseId
          ? {
              ...log,
              sets: log.sets.filter((_, idx) => idx !== setIndex),
            }
          : log
      )
    );
  };

  const handleAddSet = (exerciseId) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        (log._id || log.id) === exerciseId
          ? {
              ...log,
              sets: [...log.sets, { reps: '', weight: '' }],
            }
          : log
      )
    );
  };
  
  const handleAddExerciseToLog = () => {
    if (!newExercise) return;
    const exerciseDetails = exerciseNames.find(ex => ex === newExercise);
    if (!exerciseDetails) return;

    setExerciseLogs(prev => [
        ...prev,
        {
            id: `new-${Date.now()}`,
            name: exerciseDetails,
            sets: [],
        },
    ]);
    setNewExercise('');
    onClose();
  };

  const handleRemoveExerciseFromLog = (exerciseId) => {
    setExerciseLogs(prev => prev.filter(ex => (ex._id || ex.id) !== exerciseId));
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    exerciseLogs.forEach((exercise, exerciseIndex) => {
      exercise.sets.forEach((set, setIndex) => {
        const setKey = `${exercise._id || exercise.id}-${setIndex}`;
        
        // Validate reps
        if (!set.reps || isNaN(set.reps) || set.reps <= 0) {
          errors[`${setKey}-reps`] = true;
          hasErrors = true;
        }

        // Validate weight
        if (!set.weight || isNaN(set.weight) || set.weight < 0) {
          errors[`${setKey}-weight`] = true;
          hasErrors = true;
        }
      });
    });

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleSaveLog = async () => {
    if (!validateForm()) {
      toast({
        title: 'Please fill in all required fields correctly',
        description: 'Reps must be greater than 0 and weight must be a valid number',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

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
            reps: parseFloat(set.reps),
            weight: parseFloat(set.weight)
          }))
        }))
      };

      await createWorkoutLog(logData);
      await updateWorkout(workout._id, { lastCompleted: new Date().toISOString() });
      navigate('/workouts');
    } catch (error) {
      console.error('Error saving workout log:', error);
      toast({
        title: 'Error saving workout log',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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

        <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg" color={textColor}>
                Log Your Workout
            </Heading>
            <Button leftIcon={<Icon as={Edit} />} onClick={onOpen} colorScheme="teal" variant="outline">
                Add Exercises
            </Button>
        </Flex>

        <Box>
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
                          icon={<Icon as={Trash2} size={16} />}
                          onClick={() => handleRemoveExerciseFromLog(exercise._id || exercise.id)}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          aria-label="Delete Exercise"
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
                              onClick={() => handleRemoveSet(exercise._id || exercise.id, setIndex)}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              aria-label="Delete Set"
                            />
                          </Flex>
                          <HStack spacing={4}>
                            <FormControl flex="1" isInvalid={formErrors[`${exercise._id || exercise.id}-${setIndex}-reps`]}>
                              <FormLabel fontSize="sm" color={mutedTextColor}>Reps <Text as="span" color="red.500">*</Text></FormLabel>
                              <Input
                                type="number"
                                value={set.reps}
                                onChange={(e) => {
                                  handleInputChange(exercise._id || exercise.id, setIndex, 'reps', e.target.value);
                                  setFormErrors(prev => ({ ...prev, [`${exercise._id || exercise.id}-${setIndex}-reps`]: false }));
                                }}
                                placeholder="Enter reps"
                                min="1"
                                bg={inputBg}
                                borderColor={inputBorderColor}
                              />
                              {formErrors[`${exercise._id || exercise.id}-${setIndex}-reps`] && (
                                <Text color="red.500" fontSize="sm" mt={1}>
                                  Please enter a valid number of reps
                                </Text>
                              )}
                            </FormControl>
                            <FormControl flex="1" isInvalid={formErrors[`${exercise._id || exercise.id}-${setIndex}-weight`]}>
                              <FormLabel fontSize="sm" color={mutedTextColor}>Weight (kg) <Text as="span" color="red.500">*</Text></FormLabel>
                              <Input
                                type="number"
                                value={set.weight}
                                onChange={(e) => {
                                  handleInputChange(exercise._id || exercise.id, setIndex, 'weight', e.target.value);
                                  setFormErrors(prev => ({ ...prev, [`${exercise._id || exercise.id}-${setIndex}-weight`]: false }));
                                }}
                                placeholder="Enter weight"
                                min="0"
                                step="0.5"
                                bg={inputBg}
                                borderColor={inputBorderColor}
                              />
                              {formErrors[`${exercise._id || exercise.id}-${setIndex}-weight`] && (
                                <Text color="red.500" fontSize="sm" mt={1}>
                                  Please enter a valid weight
                                </Text>
                              )}
                            </FormControl>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                    <Button onClick={() => handleAddSet(exercise._id || exercise.id)} leftIcon={<Plus />} colorScheme="gray" size="sm" mt={4}>
                      Add Set
                    </Button>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>Add Exercise to Log</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Select Exercise</FormLabel>
                <Select
                  placeholder="Choose an exercise"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                >
                  {exerciseNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </Select>
              </FormControl>
              <Button colorScheme="teal" onClick={handleAddExerciseToLog} isDisabled={!newExercise}>
                Add Exercise
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default Logging;


