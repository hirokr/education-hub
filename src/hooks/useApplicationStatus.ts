import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useApplicationStatus(type: 'scholarship' | 'job', id: string) {
  const { data: session } = useSession();
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkApplicationStatus = async () => {
      if (!session?.user) {
        if (isMounted) {
          setIsLoading(false);
          setHasApplied(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/${type}s/${id}/check-application`);
        
        if (!response.ok) {
          throw new Error(`Failed to check application status: ${response.statusText}`);
        }

        const data = await response.json();
        if (isMounted) {
          setHasApplied(data.hasApplied);
        }
      } catch (error) {
        console.error(`Error checking ${type} application status:`, error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'An error occurred');
          setHasApplied(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkApplicationStatus();

    return () => {
      isMounted = false;
    };
  }, [session, type, id]);

  return { hasApplied, isLoading, error };
} 