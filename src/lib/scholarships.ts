import { Scholarship } from '@/types/scholarship';

export async function getScholarships(): Promise<Scholarship[]> {
  const response = await fetch('/api/scholarships');
  if (!response.ok) {
    throw new Error('Failed to fetch scholarships');
  }
  return response.json();
}
