import React, { useState, useEffect } from 'react';
import bookSlug from './pb.env';

const App = () => {
  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [hadiths, setHadiths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookSlugs = ['sahih-bukhari', 'sahih-muslim', 'al-tirmidhi']; // Array of book slugs
  const [currentBookSlug, setCurrentBookSlug] = useState(bookSlugs[0]); // Start with the first book

//${process.env.REACT_APP_HADITH_API_KEY}
  useEffect(() => {
    const apiUrl = `https://www.hadithapi.com/api/hadiths?book=${currentBookSlug}&apiKey=$2y$10$vPGICR6blTNtOzixZkeeAsf0DXgGr8JyEg4CTyXfC9oVeDdc5QW`;
    //const apiUrl = 'https://www.hadithapi.com/api/hadiths?apiKey=${pb}';
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming the API returns an array of hadiths
        if (data && data.length > 0) {
          setHadiths(data); // Store all hadiths
          setCurrentHadithIndex(0); // Reset index for new book
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setIsLoading(false);
      });
  }, [currentBookSlug]); // Fetch new data when book slug changes

  // Function to display next hadith
  const showNextHadith = () => {
    setCurrentHadithIndex(prevIndex => (prevIndex + 1) % hadiths.length);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error.message}</p>
      ) : (
        <div> <p>{hadiths[currentHadithIndex]}</p>
          <p>{hadiths[currentHadithIndex]?.englishText || 'No hadith text available'}</p>
          <button onClick={showNextHadith}>Show Next Hadith</button>
        </div>
      )}
    </div>
  );
};

export default App;