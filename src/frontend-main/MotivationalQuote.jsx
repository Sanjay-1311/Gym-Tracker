import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getWorkoutLogs, getAllWorkouts } from './services/api';
import Modal from './Modal';
import { Box, Text, Heading, Stat, StatLabel, StatNumber, VStack } from '@chakra-ui/react';

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't count the days, make the days count.",
  "Success starts with self-discipline.",
  "The difference between the impossible and the possible lies in a person's determination.",
  "Your health is an investment, not an expense.",
  "The only way to define your limits is by going beyond them.",
  "Make yourself stronger than your excuses.",
  "The hardest lift of all is lifting your butt off the couch."
];

function MotivationalQuote({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [quote, setQuote] = useState('');
  const [averageDuration, setAverageDuration] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Set a random quote
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

      // Calculate average workout duration
      const fetchWorkoutData = async () => {
        try {
          if (currentUser) {
            const workouts = await getAllWorkouts(currentUser.uid);
            if (workouts.length > 0) {
              const totalDuration = workouts.reduce((sum, workout) => {
                // Convert duration string (e.g., "45 min") to number
                const durationStr = workout.duration || '0';
                // Attempt to parse both simple numbers and strings like "45 min"
                const durationMatch = durationStr.match(/\d+/);
                const durationNum = durationMatch ? parseInt(durationMatch[0]) : 0;
                return sum + durationNum;
              }, 0);
              const avg = Math.round(totalDuration / workouts.length);
              setAverageDuration(avg);
            }
          }
        } catch (error) {
          console.error('Error fetching workout data:', error);
        }
      };

      fetchWorkoutData();
    }
  }, [isOpen, currentUser]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box p={6} className="motivational-container">
        <Box textAlign="center" mb={6} className="quote-box">
          <Text fontSize="xl" fontStyle="italic" className="quote-text">"{quote}"</Text>
        </Box>
        <Box textAlign="center" className="stats-box">
           <Stat>
             <StatLabel fontSize="lg" mb={1} className="stat-label">Average Workout Duration</StatLabel>
             <StatNumber fontSize="2xl" className="stat-value">{averageDuration} minutes</StatNumber>
           </Stat>
        </Box>
      </Box>
    </Modal>
  );
}

export default MotivationalQuote; 