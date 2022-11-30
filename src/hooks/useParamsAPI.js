import { useEffect, useState } from 'react'

const useParamsAPI = (endpoint, params) => {
  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  // Fetch method: GET
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_Server}/${endpoint}/${params}`)
    .then(res => res.json())
    .then(data => {
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
  }, [endpoint, params]);
  // Delay response
  setTimeout(() => {
    setDataLoading(false);
  }, 10000);
  // Return the data
  return {data, dataLoading};
};

export default useParamsAPI;