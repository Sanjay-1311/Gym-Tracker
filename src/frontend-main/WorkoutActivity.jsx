import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { getDailyWorkoutCounts } from "../services/api";
import { Box, Heading, Card, CardBody, useColorModeValue, useColorMode, useTheme } from '@chakra-ui/react';

function WorkoutActivity() {
  const { currentUser } = useAuth();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const [weeklyData, setWeeklyData] = useState([]);

  const axisColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const gridColor = useColorModeValue('gray.200', 'gray.500');

  // Get resolved hex color values from theme
  const lightBarFill = theme.colors.brand[500];
  const darkBarFill = theme.colors.cyan[400];

  const tooltipBgColor = useColorModeValue('white', 'gray.700');
  const tooltipBorderColor = useColorModeValue('gray.200', 'gray.600');
  const tooltipTextColor = useColorModeValue('gray.800', 'white');

  // Lighter cursor color for dark mode tooltip
  const tooltipCursorColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)');

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        if (currentUser) {
          const data = await getDailyWorkoutCounts(currentUser.uid);
          // Transform the data into the format expected by Recharts
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const transformedData = days.map(day => ({
            day,
            workouts: data[day] || 0
          }));
          setWeeklyData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching daily workout data:', error);
      }
    };

    fetchWeeklyData();
    // Set up an interval to refresh the data every 5 seconds
    const intervalId = setInterval(fetchWeeklyData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentUser]);

  return (
    <Card bg={cardBg} borderColor={cardBorderColor} borderWidth="1px">
      <CardBody>
        <Heading as="h3" size="md" mb={4} color={textColor}>Workout Activity</Heading>
        <ResponsiveContainer width="100%" height={220} key={colorMode}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="day" 
              stroke={axisColor}
              tick={{ fill: axisColor }}
            />
            <YAxis 
              allowDecimals={false} 
              stroke={axisColor}
              tick={{ fill: axisColor }}
            />
            <Tooltip
              cursor={{ fill: tooltipCursorColor }}
              contentStyle={{
                backgroundColor: tooltipBgColor,
                borderColor: tooltipBorderColor,
                color: tooltipTextColor,
                borderRadius: 'md',
              }}
              itemStyle={{ color: tooltipTextColor }}
              formatter={(value) => [`${value} Workouts`, '']}
            />
            <Bar 
              dataKey="workouts" 
              fill={colorMode === 'dark' ? darkBarFill : lightBarFill}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

export default WorkoutActivity;
