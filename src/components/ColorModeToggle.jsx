import { IconButton, useColorMode, Tooltip } from '@chakra-ui/react';
import { Sun, Moon } from 'lucide-react';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip label={colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton
        icon={colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        colorScheme="brand"
      />
    </Tooltip>
  );
};

export default ColorModeToggle; 