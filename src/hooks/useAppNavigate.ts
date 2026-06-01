import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { getPath } from '../lib/routes';

export function useAppNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (pageId: string) => {
      navigate(getPath(pageId));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );
}
