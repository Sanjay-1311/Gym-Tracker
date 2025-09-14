import React from "react";
import Header from "./Header";
import Initial from "./Welcome-initial";
import StatsRow from "./StatsRow";
import WorkoutActivity from "./WorkoutActivity";
import QuickActions from "./QuickActions";
import Title from "./Title";
import RecentWorkouts from "./RecentWorkouts";
import MotivationalQuote from "./MotivationalQuote";
import { Box, Container, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ChatbotOverlay from "./ChatbotOverlay";
function Dashboard() {
  return (
    <>
      <Title />
      <Header />
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        p={6}
      >
        <Box mb={6}>
          <Initial />
        </Box>
        <MotivationalQuote mb={6} />
        <StatsRow mb={6} />
        <Flex gap={6} direction={{ base: 'column', md: 'row' }} mb={6}>
          <Box flex="1"><WorkoutActivity /></Box>
          <Box flex="1" maxW={{ base: '100%', md: '300px' }}><QuickActions /></Box>
        </Flex>
        <RecentWorkouts />
      </Box>
      <ChatbotOverlay />
    </>
  );
}

export default Dashboard; 