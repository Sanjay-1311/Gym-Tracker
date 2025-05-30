import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Edit2, Clock, Calendar, Play, History } from 'lucide-react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { useAuth } from './contexts/AuthContext';
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from './services/api';
import { Box, Heading, Text, Flex, Button, VStack, HStack, Input, FormControl, FormLabel, IconButton, useToast, Card, CardBody, SimpleGrid, Icon, Spacer, useColorModeValue } from '@chakra-ui/react';

function Workouts() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toast = useToast();
  
  // Move all useColorModeValue hooks to the top
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('white', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');
  const exerciseItemBorderColor = useColorModeValue('gray.200', 'gray.700');
  const exerciseItemBg = useColorModeValue('gray.50', 'gray.600');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const createCardBorderColor = useColorModeValue('gray.300', 'gray.600');
  const createCardHoverBorderColor = useColorModeValue('brand.400', 'brand.600');
  const createCardTextColor = useColorModeValue('gray.600', 'gray.400');

  const [workouts, setWorkouts] = useState([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    exercises: [],
    lastCompleted: null
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: ''
  });

  useEffect(() => {
    loadWorkouts();
  }, [currentUser]);

  const loadWorkouts = async () => {
    try {
      if (currentUser) {
        const data = await getWorkouts(currentUser.uid);
        setWorkouts(data);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
      toast({
        title: 'Error loading workouts.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddWorkout = async () => {
    if (newWorkout.name.trim() && newWorkout.exercises.length > 0) {
      try {
        const workoutData = {
          userId: currentUser.uid,
          name: newWorkout.name,
          duration: newWorkout.duration,
          exercises: newWorkout.exercises
        };
        await createWorkout(workoutData);
        await loadWorkouts();
        toast({
          title: 'Workout created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setNewWorkout({
          name: '',
          duration: '',
          exercises: [],
          lastCompleted: null
        });
        setIsAddingWorkout(false);
      } catch (error) {
        console.error('Error creating workout:', error);
        toast({
          title: 'Error creating workout.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleAddExercise = () => {
    if (newExercise.name.trim() && newExercise.sets) {
      setNewWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...newExercise, id: Date.now() }]
      }));
      setNewExercise({
        name: '',
        sets: ''
      });
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await deleteWorkout(workoutId);
      await loadWorkouts();
      toast({
        title: 'Workout deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: 'Error deleting workout.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    try {
      const updatedWorkouts = workouts.map(workout => {
        if (workout._id === workoutId) {
          return {
            ...workout,
            lastCompleted: new Date().toISOString()
          };
        }
        return workout;
      });
      await updateWorkout(workoutId, { lastCompleted: new Date().toISOString() });
      await loadWorkouts();
       toast({
        title: 'Workout marked as completed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error completing workout:', error);
       toast({
        title: 'Error completing workout.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleStartWorkout = (workout) => {
    navigate('/logging', { state: { workout } });
  };

  const viewPreviousLogs = (workout) => {
    navigate('/prev', { state: { workout } });
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setNewWorkout({
      name: workout.name,
      duration: workout.duration,
      exercises: workout.exercises,
      lastCompleted: workout.lastCompleted
    });
    setIsEditingWorkout(true);
  };

  const handleSaveEdit = async () => {
    if (editingWorkout && newWorkout.name.trim() && newWorkout.exercises.length > 0) {
      try {
        await updateWorkout(editingWorkout._id, {
          name: newWorkout.name,
          duration: newWorkout.duration,
          exercises: newWorkout.exercises
        });
        await loadWorkouts();
         toast({
          title: 'Workout updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsEditingWorkout(false);
        setEditingWorkout(null);
        setNewWorkout({
          name: '',
          duration: '',
          exercises: [],
          lastCompleted: null
        });
      } catch (error) {
        console.error('Error updating workout:', error);
         toast({
          title: 'Error updating workout.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteExercise = (exerciseId) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => (ex._id !== exerciseId) && (ex.id !== exerciseId))
    }));
  };

  return (
    <Box p={6}>
      <title>SculpTrack - Workouts</title>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <HStack spacing={4} alignItems="center">
           <IconButton
            as={RouterLink}
            to="/"
            icon={<ArrowLeft size={20} />}
            aria-label="Back to Dashboard"
            variant="ghost"
          />
          <Heading as="h1" size="xl">My Workouts</Heading>
        </HStack>
        <Button
          leftIcon={<Plus size={20} />}
          colorScheme="brand"
          onClick={() => setIsAddingWorkout(true)}
        >
          Add Workout
        </Button>
      </Flex>

      {(isAddingWorkout || isEditingWorkout) && (
        <Box mb={6} p={6} borderWidth="1px" borderRadius="lg" bg={cardBg} borderColor={cardBorderColor}>
          <Heading as="h2" size="lg" mb={4}>{isEditingWorkout ? 'Edit Workout' : 'Create New Workout'}</Heading>
          <VStack spacing={4} align="stretch" mb={6}>
            <FormControl>
              <FormLabel>Workout Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter workout name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                bg={inputBg}
                borderColor={inputBorderColor}
                color={textColor}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Duration (optional)</FormLabel>
              <Input
                type="text"
                placeholder="e.g., 45 min"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                bg={inputBg}
                borderColor={inputBorderColor}
                color={textColor}
              />
            </FormControl>
          </VStack>

          <Box mb={6}>
            <Heading as="h3" size="md" mb={3}>Exercises</Heading>
            <VStack spacing={3} align="stretch" mb={4}>
              {newWorkout.exercises.map((exercise) => (
                <Flex 
                  key={exercise._id || exercise.id} 
                  justifyContent="space-between" 
                  alignItems="center" 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md" 
                  borderColor={exerciseItemBorderColor} 
                  bg={exerciseItemBg}
                >
                  <Box>
                    <Text fontWeight="bold">{exercise.name}</Text>
                    <Text fontSize="sm" color={mutedTextColor}>{exercise.sets} sets</Text>
                  </Box>
                  <IconButton
                    icon={<Trash2 size={16} />}
                    aria-label="Delete exercise"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDeleteExercise(exercise._id || exercise.id)}
                  />
                </Flex>
              ))}
            </VStack>

            <HStack spacing={3}>
              <FormControl flex="1">
                <FormLabel>Exercise Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter exercise name"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  color={textColor}
                />
              </FormControl>
              <FormControl w="100px">
                <FormLabel>Sets</FormLabel>
                <Input
                  type="number"
                  placeholder="Sets"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  color={textColor}
                />
              </FormControl>
              <Button onClick={handleAddExercise} colorScheme="brand" mt={8}>Add Exercise</Button>
            </HStack>
          </Box>

          <HStack spacing={4} justifyContent="flex-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingWorkout(false);
                setIsEditingWorkout(false);
                setEditingWorkout(null);
                setNewWorkout({
                  name: '',
                  duration: '',
                  exercises: [],
                  lastCompleted: null
                });
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={isEditingWorkout ? handleSaveEdit : handleAddWorkout}
            >
              {isEditingWorkout ? 'Save Changes' : 'Save Workout'}
            </Button>
          </HStack>
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {workouts.map(workout => (
          <Card key={workout._id} bg={cardBg} borderColor={cardBorderColor} borderWidth="1px">
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading as="h3" size="md" color={textColor}>{workout.name}</Heading>
                <HStack spacing={4} fontSize="sm" color={mutedTextColor}>
                  <Flex alignItems="center"><Icon as={Clock} mr={1} />{workout.duration || 'N/A'}</Flex>
                  <Flex alignItems="center"><Icon as={Calendar} mr={1} />Last: {workout.lastCompleted ? new Date(workout.lastCompleted).toLocaleDateString() : 'Never'}</Flex>
                </HStack>
                <VStack align="stretch" spacing={2} flex="1">
                  {workout.exercises.map(exercise => (
                    <Text key={exercise._id || exercise.id} fontSize="sm" color={textColor}>{exercise.name} ({exercise.sets} sets)</Text>
                  ))}
                </VStack>
                <HStack spacing={2} justifyContent="flex-end">
                  <Button leftIcon={<Icon as={Play} />} size="sm" colorScheme="green" onClick={() => handleStartWorkout(workout)}>Start</Button>
                  <Button leftIcon={<Icon as={History} />} size="sm" onClick={() => viewPreviousLogs(workout)}>Logs</Button>
                  <IconButton icon={<Edit2 size={16} />} size="sm" aria-label="Edit workout" onClick={() => handleEditWorkout(workout)} />
                  <IconButton icon={<Trash2 size={16} />} size="sm" colorScheme="red" aria-label="Delete workout" onClick={() => handleDeleteWorkout(workout._id)} />
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}

        {/* "Create New Workout" Card */}
        <Card 
          onClick={() => setIsAddingWorkout(true)} 
          cursor="pointer" 
          _hover={{ shadow: "md", borderColor: createCardHoverBorderColor }} 
          borderWidth="1px" 
          borderStyle="dashed" 
          borderColor={createCardBorderColor} 
          bg={cardBg}
        >
          <CardBody>
            <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center">
              <Icon as={Dumbbell} boxSize={12} mb={4} color="brand.500" />
              <Heading as="h3" size="md" mb={2} color={textColor}>Create New Workout</Heading>
              <Text fontSize="sm" color={createCardTextColor} mb={4}>Design your custom workout routine</Text>
              <Button colorScheme="brand" onClick={(e) => { e.stopPropagation(); setIsAddingWorkout(true); }}>
                Create Workout
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

export default Workouts; 