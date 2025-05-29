import React from 'react';
import { Dumbbell, Calendar, Trophy } from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Heading, Button, VStack, Card, CardBody } from '@chakra-ui/react';

function QuickActions() {
  const location = useLocation();

  return (
    <Card>
      <CardBody>
        <Heading as="h3" size="md" mb={4}>Quick Actions</Heading>
        <VStack spacing={3} align="stretch">
          <Button
            as={RouterLink}
            to="/workouts"
            leftIcon={<Dumbbell size={16} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="brand"
            isActive={location.pathname === "/workouts"}
          >
            Start Workout
          </Button>
          <Button
            as={RouterLink}
            to="/schedule"
            leftIcon={<Calendar size={16} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="brand"
            isActive={location.pathname === "/schedule"}
          >
            Schedule
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default QuickActions;
