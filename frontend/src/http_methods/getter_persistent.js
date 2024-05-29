import { useEffect } from 'react';

function PersistentGet(url, setter, interval = 500) {
  useEffect(() => {
    const fetchData = () => {
      fetch(url, {
        method: 'GET',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse JSON from response
        })
        .then(data => {
          setter(data); 
          console.log(data); 
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    // fetch data immediately on mount
    fetchData();

    const intervalId = setInterval(fetchData, interval);

    // clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [url, setter, interval]); // Dependencies
}

export default PersistentGet;
