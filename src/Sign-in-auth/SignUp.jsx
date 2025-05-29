import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserPlus, User, Github, Mail } from "lucide-react";
import { getUserProfile, createUserProfile } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Link, Divider, HStack, Icon, useToast, Flex } from '@chakra-ui/react';

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
       toast({
        title: "Sign Up Failed",
        description: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setError("");
      setLoading(true);
      const result = await signup(formData.email, formData.password);
      
      // Create user profile in MongoDB
      await createUserProfile({
        id: result.user.uid,
        email: formData.email,
        username: formData.username,
        createdAt: new Date().toISOString()
      });
      
      // Verify the profile was created (Optional, but good for debugging)
      // const user = await getUserProfile(result.user.uid);
      // console.log("User profile created:", user);
      
      navigate("/");
    } catch (error) {
      setError("Failed to create an account. " + error.message);
      console.error(error);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithGoogle();
      
      // Check if user profile exists in MongoDB
      try {
        await getUserProfile(result.user.uid);
      } catch (error) {
        // If profile doesn't exist, create one
        const username = result.user.email.split('@')[0];
        await createUserProfile({
          id: result.user.uid,
          email: result.user.email,
          username: username,
          createdAt: new Date().toISOString()
        });
      }
      
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google.");
      console.error(error);
       toast({
        title: "Google Sign Up Failed",
        description: "An error occurred during Google sign up.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleGithubSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithGithub();
      
      // Check if user profile exists in MongoDB
      try {
        await getUserProfile(result.user.uid);
      } catch (error) {
        // If profile doesn't exist, create one
        const username = result.user.email.split('@')[0];
        await createUserProfile({
          id: result.user.uid,
          email: result.user.email,
          username: username,
          createdAt: new Date().toISOString()
        });
      }
      
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with GitHub.");
      console.error(error);
       toast({
        title: "GitHub Sign Up Failed",
        description: "An error occurred during GitHub sign up.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Flex minH="100vh" align="center" justify="center" p={4}>
      <title>SculpTrack</title>
      <Box borderWidth="1px" borderRadius="lg" p={8} maxWidth="md" width="100%" boxShadow="lg">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="xl">Create Account</Heading>
            <Text fontSize="lg" color="gray.500">Join SculpTrack to start your fitness journey</Text>
          </Box>

          {error && (
            <Box bg="red.100" color="red.800" p={3} borderRadius="md">
              {error}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </FormControl>

              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </FormControl>
              
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </FormControl>

              <FormControl id="confirmPassword">
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="brand"
                width="100%"
                isLoading={loading}
                leftIcon={<Icon as={UserPlus} />}
              >
                Sign Up
              </Button>
            </VStack>
          </form>

          <HStack spacing={2} justifyContent="center" alignItems="center">
            <Divider orientation="horizontal" flex="1" />
            <Text fontSize="sm" color="gray.500">or continue with</Text>
            <Divider orientation="horizontal" flex="1" />
          </HStack>

          <VStack spacing={3}>
             <Button 
                leftIcon={<Icon as={Github} />} 
                width="100%" 
                onClick={handleGithubSignIn}
                disabled={loading}
              >
                Sign up with GitHub
              </Button>
               <Button 
                leftIcon={<Icon as={Mail} />} 
                width="100%" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                Sign up with Google
              </Button>
          </VStack>

          <Text textAlign="center">
            Already have an account?{' '}
            <Link as={RouterLink} to="/signin" color="brand.500" fontWeight="bold">
              Sign in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}

export default SignUp; 