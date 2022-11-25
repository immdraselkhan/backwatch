import { useEffect } from 'react'

const useTitle = title => {
  useEffect(() => {
    document.title = `${title} - BackWatch`
  }, [title])
};

export default useTitle;