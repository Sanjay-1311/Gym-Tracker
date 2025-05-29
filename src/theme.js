import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff',
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.600',
          },
        }),
        ghost: {
          _hover: {
            bg: 'transparent',
            color: 'brand.500',
          },
        },
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderRadius: 'xl',
          boxShadow: 'lg',
        },
      }),
    },
    Container: {
      baseStyle: (props) => ({
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
    Box: {
      baseStyle: (props) => ({
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        scrollBehavior: 'smooth',
      },
      'html, body': {
        minHeight: '100vh',
      },
      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      main: {
        flex: 1,
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
      '.chakra-container': {
        maxW: 'container.xl',
        px: { base: 4, md: 6 },
        py: { base: 4, md: 6 },
      },
    }),
  },
});

export default theme; 