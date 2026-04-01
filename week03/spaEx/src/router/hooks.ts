import { useEffect, useState } from 'react';
export const useCurrentPath = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => setPath(window.location.pathname);

    window.addEventListener('popstate', update);
    window.addEventListener('pushstate', update);

    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('pushstate', update);
    };
  }, []);

  return path;
};