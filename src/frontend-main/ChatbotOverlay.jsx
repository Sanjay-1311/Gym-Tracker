import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Avatar,
  useColorMode,
  useColorModeValue,
  IconButton,
  Container,
  useToast
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ChatbotOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI Fitness Coach. I can help you with workout planning, form tips, nutrition advice, and progress tracking. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        query: inputText
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.answer || "I'm here to help with your fitness journey! Could you provide more details?",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback responses
      const fitnessResponses = [
        "Great question! Progressive overload is key - gradually increase weight, reps, or sets each week. What's your current training split?",
        "Nutrition timing can boost performance! Try eating protein within 30 minutes post-workout. Are you tracking your macros?",
        "Form over everything! Better to lift lighter with perfect technique than heavy with poor form. Need help with any specific exercises?",
        "Recovery is where the magic happens! Aim for 7-9 hours of quality sleep and at least one rest day per week. How's your sleep schedule?",
        "Consistency beats intensity every time. Small daily improvements compound into amazing results. What's your biggest challenge right now?"
      ];

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: fitnessResponses[Math.floor(Math.random() * fitnessResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Demo Mode Active",
        description: "Using simulated responses. Connect your /api/chat endpoint for full functionality.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Overlay Background */}
      <AnimatePresence>
        {isOpen && (
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            position="fixed"
            inset="0"
            bg="blackAlpha.300"
            backdropFilter="blur(4px)"
            zIndex="40"
            onClick={handleToggleChat}
          />
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <Box
        as={motion.div}
        initial={false}
        animate={{
          x: isOpen ? 0 : '100%'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        position="fixed"
        top="0"
        right="0"
        h="100vh"
        w={{ base: "100%", md: "380px" }}
        bg={bgColor}
        borderLeft="1px"
        borderColor={borderColor}
        zIndex="50"
        boxShadow="2xl"
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          p="4"
          borderBottom="1px"
          borderColor={borderColor}
          bg={bgColor}
        >
          <HStack spacing="3">
            <Box
              w="8"
              h="8"
              borderRadius="full"
              bgGradient="linear(to-r, purple.500, purple.600)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <Sparkles size={16} />
            </Box>
            <Text fontWeight="semibold" color={textColor}>
              AI Fitness Coach
            </Text>
          </HStack>

          <IconButton
            icon={<X size={20} />}
            onClick={handleToggleChat}
            variant="ghost"
            size="sm"
            borderRadius="full"
          />
        </Flex>

        {/* Messages Area */}
        <Box
          flex="1"
          overflowY="auto"
          p="4"
          h="calc(100vh - 140px)"
        >
          <VStack spacing="4" align="stretch">
            {messages.map((message) => (
              <Flex
                key={message.id}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="85%"
                  px="4"
                  py="3"
                  borderRadius="2xl"
                  bg={message.sender === 'user' ? 'purple.500' : bgColor}
                  color={message.sender === 'user' ? 'white' : textColor}
                  border={message.sender === 'ai' ? '1px' : 'none'}
                  borderColor={borderColor}
                  boxShadow="sm"
                  ml={message.sender === 'user' ? '4' : '0'}
                  mr={message.sender === 'ai' ? '4' : '0'}
                >
                  <Text fontSize="sm" lineHeight="relaxed" wordBreak="break-word">
                    {message.text}
                  </Text>
                  <Text
                    fontSize="xs"
                    mt="1"
                    color={message.sender === 'user' ? 'whiteAlpha.700' : mutedColor}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Box>
              </Flex>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <Flex justify="flex-start">
                <Box
                  maxW="85%"
                  px="4"
                  py="3"
                  borderRadius="2xl"
                  bg={bgColor}
                  border="1px"
                  borderColor={borderColor}
                  mr="4"
                >
                  <HStack spacing="1">
                    <Box w="2" h="2" bg="purple.500" borderRadius="full">
                      <Box
                        as={motion.div}
                        animate={{ y: [-2, 2, -2] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        w="2"
                        h="2"
                        bg="purple.500"
                        borderRadius="full"
                      />
                    </Box>
                    <Box w="2" h="2" bg="purple.500" borderRadius="full">
                      <Box
                        as={motion.div}
                        animate={{ y: [-2, 2, -2] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.1
                        }}
                        w="2"
                        h="2"
                        bg="purple.500"
                        borderRadius="full"
                      />
                    </Box>
                    <Box w="2" h="2" bg="purple.500" borderRadius="full">
                      <Box
                        as={motion.div}
                        animate={{ y: [-2, 2, -2] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2
                        }}
                        w="2"
                        h="2"
                        bg="purple.500"
                        borderRadius="full"
                      />
                    </Box>
                  </HStack>
                </Box>
              </Flex>
            )}

            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Input Area */}
        <Box p="4" borderTop="1px" borderColor={borderColor} bg={bgColor}>
          <HStack spacing="2" align="flex-end">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a fitness question..."
              disabled={isLoading}
              borderRadius="xl"
              border="1px"
              borderColor={borderColor}
              bg={bgColor}
              color={textColor}
              _placeholder={{ color: mutedColor }}
              _focus={{
                borderColor: 'purple.500',
                boxShadow: '0 0 0 1px purple.500'
              }}
            />

            <IconButton
              icon={<Send size={18} />}
              onClick={handleSendMessage}
              isDisabled={!inputText.trim() || isLoading}
              colorScheme="purple"
              borderRadius="xl"
              size="md"
            />
          </HStack>

          <Text fontSize="xs" color={mutedColor} mt="2" textAlign="center">
            Get personalized fitness advice powered by AI
          </Text>
        </Box>
      </Box>

      {/* Floating Action Button */}
      <Box
        as={motion.button}
        onClick={handleToggleChat}
        animate={{
          scale: isOpen ? 0 : 1,
        }}
        whileHover={{ scale: isOpen ? 0 : 1.1 }}
        whileTap={{ scale: isOpen ? 0 : 0.95 }}
        position="fixed"
        bottom="6"
        right="6"
        w="14"
        h="14"
        borderRadius="full"
        bgGradient="linear(45deg, purple.500, purple.600)"
        color="white"
        boxShadow="0 8px 32px rgba(138, 43, 226, 0.3)"
        zIndex="40"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        border="none"
        pointerEvents={isOpen ? 'none' : 'auto'}
        _focus={{
          outline: 'none',
          boxShadow: '0 0 0 4px rgba(138, 43, 226, 0.3)'
        }}
      >
        <MessageCircle size={24} />
      </Box>
    </>
  );
};

export default ChatbotOverlay;
