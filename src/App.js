import React, { useState, useEffect } from 'react';
import {extendTheme, ChakraProvider, useColorMode, Button, ButtonGroup, Box, Card, Image, IconButton, Center, CardBody  } from '@chakra-ui/react'
import { MoonIcon, TriangleUpIcon } from '@chakra-ui/icons'
import bookLogo from './bookLogo.png'; 

const App = () => {
  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [hadiths, setHadiths] = useState([]);
  const [showArabic, setShowArabic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookSlugs = ['sahih-bukhari', 'al-tirmidhi']; // Array of book slugs
  const getRandomBookSlug = () => {
    const randomIndex = Math.floor(Math.random() * bookSlugs.length);
    return bookSlugs[randomIndex];
  };
  const [currentBookSlug, setCurrentBookSlug] = useState(getRandomBookSlug());
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showTopBtn && window.pageYOffset > 200){
        setShowTopBtn(true);
      } else if (showTopBtn && window.pageYOffset <= 200){
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);

    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [showTopBtn]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top of page function  
  };

function ThemeToggleButton() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <MoonIcon boxSize={6} onClick={toggleColorMode}>
        Switch to {colorMode === 'light' ? 'Dark' : 'Light'} Mode
      </MoonIcon> // Toggle the color mode with moon icon button
    );
}

const theme = extendTheme({
  config: {
    useSystemColorMode: true, // Use the system color mode
  },
});

const toggleArabic = () => {
  setShowArabic(!showArabic); // Toggle the showArabic state
};

const refreshPage = () => {
  window.location.reload();
}; // Refresh the page

useEffect(() => {
  const apiUrl = `https://www.hadithapi.com/api/hadiths?book=${currentBookSlug}&apiKey=$2y$10$vPGICR6blTNtOzixZkeeAsf0DXgGr8JyEg4CTyXfC9oVeDdc5QW`;
  fetch(apiUrl) // Fetch data from API
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Error handling
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
    setIsLoading(false); // Error catching 
  });
}, [currentBookSlug]);
 // Fetch new data when book slug changes

  // Function to display next hadith
  const showNextHadith = () => {
    // Randomly select a new book slug
    const newBookSlug = getRandomBookSlug();
    setCurrentBookSlug(newBookSlug);
  
    // Randomly select an index for a hadith within the bounds of the hadiths array
    if (hadiths.length > 0) {
      const randomIndex = Math.floor(Math.random() * hadiths.length);
      setCurrentHadithIndex(randomIndex);
    }
  };

  return (
    <ChakraProvider theme={theme}>
       <Box p={6} m="auto" maxW="container.md" >
        <Card>
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error.message}</p>
      ) : (
        <div>
        <Card>
          <CardBody>
          {console.log('Current index:', currentHadithIndex)} {/* Debugging */}
          {console.log('Current hadith:', hadiths[currentHadithIndex])} {/* Debugging */}
          <p>{hadiths[currentHadithIndex]?.bookSlug || 'No book'}</p>
          <br></br>
          <Center><p>{hadiths[currentHadithIndex]?.englishNarrator || 'No book'}</p>
          </Center><br></br>
          <p textalign="center">{hadiths[currentHadithIndex]?.hadithEnglish || 'No English text available'}</p>
          <br></br>
          {showArabic && <p>{hadiths[currentHadithIndex]?.hadithArabic || 'No Arabic text available'}</p>}
          </CardBody>
          </Card>
          <br></br>
          <Box textAlign="center">
          <ButtonGroup variant='outline' size= 'md' spacing='5'>
          <IconButton aria-label='Search database' icon={<ThemeToggleButton />} sx={{ 
            '&:hover': { 
              bg: 'gray.600', // Change this color based on your theme
            },
          }}/> 
          <Button onClick={toggleArabic}>{showArabic ? 'Hide Arabic' : 'Show Arabic'} </Button> 
          <Button onClick={showNextHadith}>Show Next Hadith</Button>
          </ButtonGroup> 
          <Center>
          <div onClick={refreshPage}><Image src ={bookLogo} alt='logo' width={["100px", "150px", "200px"]} textalign="center"></Image>
          </div>
          </Center>
          {showTopBtn && (
          <IconButton aria-label='BacktoTop' icon={<TriangleUpIcon />} onClick={scrollToTop} colorScheme="gold">
            Back to Top
          </IconButton>
          )}

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