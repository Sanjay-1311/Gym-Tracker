import React from 'react';
import { Heading, Text, Box } from '@chakra-ui/react';

function Initial() {
  return (
    <Box>
      <Heading as="h2" size="xl" mb={2}>Welcome back!</Heading>
      <Text fontSize="lg">
        Track, analyze and improve your fitness journey.
      </Text>
    </Box>
  );
}

export default Initial;
