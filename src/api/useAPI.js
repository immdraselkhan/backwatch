import { useEffect, useState } from 'react'

const useAPI = endpoint => {
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  // Fetch method: GET
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_Server}/${endpoint}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Set data to the state
          setData(data.result);
          // Disable the loader
          setDataLoading(false);
        } else {
          // Disable the loader
          setDataLoading(false);
        };
      })
      .catch(error => {
        // Disable the loader
        setDataLoading(false);
      });
  }, [endpoint]);
  // Return the data
  return {data, dataLoading};
};

export default useAPI;