export interface Job {
  job_id: string;
  job_title: string;
  company_name: string;
  company_logo: string;
  date: string;
  location: string;
  position: string;
  salary_range: {
    min: number;
    max: number;
  };
  job_tags: string[];
  job_description: string;
  posted_on: string;
  deadline: string;
}