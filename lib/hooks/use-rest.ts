import axios from 'axios';
import { DependencyList, useEffect, useState } from 'react';

export default function useRest<T = any>(
  url: string | null,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  deps: DependencyList = []
): { loading: boolean; error: Error | null; res: T | null } {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [res, setRes] = useState<T | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (url) {
          const response = await axios(url, { method });
          setRes(response.data as T);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, [url, ...deps]);

  return { loading, error, res };
}
