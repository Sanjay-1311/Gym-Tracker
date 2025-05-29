import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getUserProfile, createUserProfile } from "../services/api";
import { LogIn, User, Github, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Checkbox, Link, Divider, HStack, Icon, useToast, Flex } from '@chakra-ui/react';

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const result = await login(formData.email, formData.password);
      
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
      setError("Failed to sign in. Please check your credentials.");
      console.error(error);
      toast({
        title: "Sign In Failed",
        description: "Please check your credentials.",
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
        title: "Google Sign In Failed",
        description: "An error occurred during Google sign in.",
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
        title: "GitHub Sign In Failed",
        description: "An error occurred during GitHub sign in.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Flex minH="100vh" align="center" justify="center" p={4}>
      <title>SculpTrack</title>
      <Box borderWidth="1px" borderRadius="lg" p={8} maxWidth="md" width="100%" boxShadow="lg">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="xl">Welcome Back</Heading>
            <Text fontSize="lg" color="gray.500">Sign in to continue to SculpTrack</Text>
          </Box>

          {error && (
            <Box bg="red.100" color="red.800" p={3} borderRadius="md">
              {error}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </FormControl>

              <HStack justifyContent="space-between" width="100%">
                <Checkbox
                  name="rememberMe"
                  isChecked={formData.rememberMe}
                  onChange={handleChange}
                >
                  Remember me
                </Checkbox>
                <Link as={RouterLink} to="/forgot-password" color="brand.500">
                  Forgot password?
                </Link>
              </HStack>
              
              <Button
                type="submit"
                colorScheme="brand"
                width="100%"
                isLoading={loading}
                leftIcon={<Icon as={LogIn} />}
              >
                Sign In
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
                Sign in with GitHub
              </Button>
               <Button 
                leftIcon={<Icon as={Mail} />} 
                width="100%" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                Sign in with Google
              </Button>
          </VStack>

          <Text textAlign="center">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/signup" color="brand.500" fontWeight="bold">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}

export default SignIn; 