import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api';
import { useAuthStore } from '../store/authStore';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useCurrentUser = () => {
  const { setUser, setLoading } = useAuthStore();
  const token = localStorage.getItem('token');

  const query = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await getMe();
      return data;
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data);
      setLoading(false);
    }
    if (query.isError) {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
    if (!token) {
      setLoading(false);
    }
  }, [query.isSuccess, query.isError, query.data, token, setUser, setLoading]);

  return query;
};
