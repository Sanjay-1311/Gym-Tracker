import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Avatar, Flex, Spacer, useToast, HStack } from '@chakra-ui/react';

function Profile() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUsername(profile.username || '');
        setNewUsername(profile.username || '');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: "Error loading profile",
        description: "Unable to load user profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (newUsername.trim() && currentUser) {
      try {
        await updateUserProfile({
          id: currentUser.uid,
          email: currentUser.email,
          username: newUsername.trim()
        });
        setUsername(newUsername.trim());
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Username updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error updating username:', error);
        toast({
          title: "Update failed",
          description: "Unable to update username.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleCancelClick = () => {
    setNewUsername(username);
    setIsEditing(false);
  };

  return (
    <Box p={6}>
      <title>SculpTrack - Profile</title>
      <Box borderWidth="1px" borderRadius="lg" p={6} maxWidth="lg" mx="auto">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">Profile</Heading>

          <Flex alignItems="center" spacing={4}>
            <Avatar
              size="xl"
              name={username || currentUser?.email || 'User'}
              src={currentUser?.photoURL || ''}
              bg="brand.500"
              color="white"
            />
            <Box ml={4}>
              <Heading as="h3" size="md">User Information</Heading>
              {isEditing ? (
                <HStack mt={2}>
                  <FormControl>
                    <FormLabel htmlFor="newUsername" srOnly>Username</FormLabel>
                    <Input
                      id="newUsername"
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter username"
                      size="sm"
                    />
                  </FormControl>
                  <Button colorScheme="brand" size="sm" onClick={handleSaveClick}>Save</Button>
                  <Button variant="outline" size="sm" onClick={handleCancelClick}>Cancel</Button>
                </HStack>
              ) : (
                <Flex alignItems="center" mt={2}>
                  <Text fontSize="lg" fontWeight="bold">{username || currentUser?.email}</Text>
                  <Button variant="link" colorScheme="brand" size="sm" ml={2} onClick={handleEditClick}>
                    Edit Username
                  </Button>
                </Flex>
              )}
            </Box>
          </Flex>

          <Box>
            <Heading as="h4" size="sm" mb={2}>Account Details</Heading>
            <VStack align="stretch" spacing={1}>
              <Text><Text as="span" fontWeight="bold">Email:</Text> {currentUser?.email}</Text>
              <Text><Text as="span" fontWeight="bold">Account Created:</Text> {currentUser?.metadata?.creationTime
                ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                : 'N/A'}</Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default Profile; 