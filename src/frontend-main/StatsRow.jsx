import React, { useState, useEffect } from "react";
import { Activity, Trophy, CalendarDays, ListChecks } from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { getMonthlyWorkoutCount, getWeeklyWorkoutCount, getWorkoutStreak, getSchedules } from "./services/api";
import { format, isToday, isTomorrow, isThisWeek, addDays, isAfter } from 'date-fns';
import { Box, Flex, Text, Stat, StatLabel, StatNumber, StatHelpText, Icon, Card, CardBody, SimpleGrid } from '@chakra-ui/react';

function StatsRow() {
  const { currentUser } = useAuth();
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [nextWorkout, setNextWorkout] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [monthlyData, weeklyData, streakData, schedulesData] = await Promise.all([
          getMonthlyWorkoutCount(currentUser.uid),
          getWeeklyWorkoutCount(currentUser.uid),
          getWorkoutStreak(currentUser.uid),
          getSchedules(currentUser.uid)
        ]);

        setMonthlyCount(monthlyData.count);
        setWeeklyCount(weeklyData.count);
        setStreak(streakData.streak);

        // Find the next scheduled workout
        const now = new Date();
        const upcomingWorkouts = schedulesData
          .filter(schedule => new Date(schedule.scheduledDate) > now && schedule.status === 'scheduled')
          .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

        setNextWorkout(upcomingWorkouts[0] || null);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (currentUser) {
      fetchStats();
    }
  }, [currentUser]);

  const formatNextWorkoutDate = (date) => {
    const workoutDate = new Date(date);
    const today = new Date();
    const nextWeek = addDays(today, 7);

    if (isToday(workoutDate)) {
      return 'Today';
    } else if (isTomorrow(workoutDate)) {
      return 'Tomorrow';
    } else if (isThisWeek(workoutDate)) {
      return format(workoutDate, 'EEEE');
    } else if (isAfter(workoutDate, today) && isAfter(nextWeek, workoutDate)) {
      return `Next ${format(workoutDate, 'EEEE')}`;
    } else {
      return format(workoutDate, 'MMM d');
    }
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
      <Card>
        <CardBody>
          <Stat>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <StatLabel>Total Workouts</StatLabel>
                <StatNumber>{monthlyCount}</StatNumber>
                <StatHelpText>This month</StatHelpText>
              </Box>
              <Icon as={Activity} boxSize={6} color="brand.500" />
            </Flex>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <StatLabel>Workouts this week</StatLabel>
                <StatNumber>{weeklyCount}</StatNumber>
              </Box>
              <Icon as={Trophy} boxSize={6} color="brand.500" />
            </Flex>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <StatLabel>Workout Streak</StatLabel>
                <StatNumber>{streak} days</StatNumber>
              </Box>
              <Icon as={CalendarDays} boxSize={6} color="brand.500" />
            </Flex>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <StatLabel>Next Workout</StatLabel>
                <StatNumber fontSize="lg">
                  {nextWorkout ? nextWorkout.workoutName : 'None'}
                </StatNumber>
                <StatHelpText>
                  {nextWorkout ? formatNextWorkoutDate(nextWorkout.scheduledDate) : 'No workouts scheduled'}
                </StatHelpText>
              </Box>
              <Icon as={ListChecks} boxSize={6} color="brand.500" />
            </Flex>
          </Stat>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
}

export default StatsRow;
