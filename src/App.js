import React, { useState, useEffect } from 'react';
import {extendTheme, ChakraProvider, useColorMode, Button, Box, Card  } from '@chakra-ui/react'
import bookSlug from './pb.env';

const App = () => {
  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [hadiths, setHadiths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookSlugs = ['sahih-bukhari', 'al-tirmidhi']; // Array of book slugs
  const getRandomBookSlug = () => {
    const randomIndex = Math.floor(Math.random() * bookSlugs.length);
    return bookSlugs[randomIndex];
  };

  const [currentBookSlug, setCurrentBookSlug] = useState(getRandomBookSlug());
  
function ThemeToggleButton() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <Button onClick={toggleColorMode}>
        Switch to {colorMode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
    );
}


const theme = extendTheme({
  config: {
    useSystemColorMode: true, // Use the system color mode
  },
});
//${process.env.REACT_APP_HADITH_API_KEY}
useEffect(() => {
  const apiUrl = `https://www.hadithapi.com/api/hadiths?book=${currentBookSlug}&apiKey=$2y$10$vPGICR6blTNtOzixZkeeAsf0DXgGr8JyEg4CTyXfC9oVeDdc5QW`;
  fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.hadiths && data.hadiths.data && data.hadiths.data.length > 0) {
      setHadiths(data.hadiths.data); // Access the 'data' array inside 'hadiths'
      setCurrentHadithIndex(0);
    } else {
      setHadiths([]);
    }
    setIsLoading(false);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    setError(error);
    setIsLoading(false);
  });
}, [currentBookSlug]);
 // Fetch new data when book slug changes

  // Function to display next hadith
  const showNextHadith = () => {
    setCurrentHadithIndex(prevIndex => (prevIndex + 1) % hadiths.length);
  };

  return (
    <ChakraProvider theme={theme}>
       <Box p={6} m="auto" maxW="container.md" textalign="center">
        <Card>
      
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error.message}</p>
      ) : (
        <div>

        <Card>
          {console.log('Current index:', currentHadithIndex)} {/* Debugging */}
          {console.log('Current hadith:', hadiths[currentHadithIndex])} {/* Debugging */}
          <p>{hadiths[currentHadithIndex]?.bookSlug || 'No book'}</p>
          <p>{hadiths[currentHadithIndex]?.hadithEnglish || 'No English text available'}</p>
          </Card>
          <Box textAlign="center">
          <Button onClick={showNextHadith}>Show Next Hadith</Button>
          <ThemeToggleButton />
          </Box>
        </div>
      )}
    </div>
    </Card>
    </Box>
    </ChakraProvider>
  );
  
};

export default App;