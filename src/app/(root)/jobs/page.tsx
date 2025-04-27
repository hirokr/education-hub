'use client';

import { getJobs } from '@/lib/jobs';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Job {
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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    locations: [] as string[],
    positions: [] as string[],
  });
  const [sortOrder, setSortOrder] = useState<'posted_newest' | 'posted_oldest' | 'deadline_newest' | 'deadline_oldest' | null>(null);
  const [salarySort, setSalarySort] = useState<'highest' | 'lowest' | 'custom' | null>(null);
  const [salaryRange, setSalaryRange] = useState({
    min: 0,
    max: 200000
  });
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await getJobs();
      setJobs(data);
      setFilteredJobs(data);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.job_title.toLowerCase().includes(searchLower) ||
        job.company_name.toLowerCase().includes(searchLower) ||
        job.job_tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.locations.length > 0) {
      result = result.filter(job => filters.locations.includes(job.location));
    }
    if (filters.positions.length > 0) {
      result = result.filter(job => filters.positions.includes(job.position));
    }

    // Apply salary range filter
    result = result.filter(job => 
      job.salary_range.min >= salaryRange.min && 
      job.salary_range.max <= salaryRange.max
    );

    // Apply sorting
    if (sortOrder) {
      const [field, order] = sortOrder.split('_');
      if (field === 'posted') {
        result.sort((a, b) => {
          const comparison = new Date(b.posted_on).getTime() - new Date(a.posted_on).getTime();
          return order === 'newest' ? comparison : -comparison;
        });
      } else if (field === 'deadline') {
        result.sort((a, b) => {
          const comparison = new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
          return order === 'newest' ? comparison : -comparison;
        });
      }
    }

    // Apply salary sorting
    if (salarySort === 'highest') {
      result.sort((a, b) => b.salary_range.max - a.salary_range.max);
    } else if (salarySort === 'lowest') {
      result.sort((a, b) => a.salary_range.min - b.salary_range.min);
    }

    setFilteredJobs(result);
  }, [searchTerm, filters, sortOrder, salarySort, salaryRange, jobs]);

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniquePositions = [...new Set(jobs.map(job => job.position))];

  const toggleFilter = (type: 'locations' | 'positions', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search jobs by title, company, or tags..."
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-8">
        {/* Filter Panel */}
        <div className="w-64 space-y-6">
          {/* Location Dropdown */}
          <div className="border rounded-lg p-4">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="w-full flex justify-between items-center font-semibold"
            >
              <span>Location</span>
              <span>{isLocationOpen ? '▼' : '▶'}</span>
            </button>
            {isLocationOpen && (
              <div className="mt-4 space-y-2">
                {uniqueLocations.map(location => (
                  <label key={location} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(location)}
                      onChange={() => toggleFilter('locations', location)}
                      className="rounded"
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Position Dropdown */}
          <div className="border rounded-lg p-4">
            <button
              onClick={() => setIsPositionOpen(!isPositionOpen)}
              className="w-full flex justify-between items-center font-semibold"
            >
              <span>Position Type</span>
              <span>{isPositionOpen ? '▼' : '▶'}</span>
            </button>
            {isPositionOpen && (
              <div className="mt-4 space-y-2">
                {uniquePositions.map(position => (
                  <label key={position} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.positions.includes(position)}
                      onChange={() => toggleFilter('positions', position)}
                      className="rounded"
                    />
                    <span>{position}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date Sort */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Sort by Date</h3>
            <div className="space-y-4">
              {/* Posted Date */}
              <div>
                <h4 className="text-sm font-medium mb-2">Posted Date</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={sortOrder === 'posted_newest'}
                      onChange={() => setSortOrder('posted_newest')}
                      className="rounded"
                    />
                    <span>New to Old</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={sortOrder === 'posted_oldest'}
                      onChange={() => setSortOrder('posted_oldest')}
                      className="rounded"
                    />
                    <span>Old to New</span>
                  </label>
                </div>
              </div>
              
              {/* Application Deadline */}
              <div>
                <h4 className="text-sm font-medium mb-2">Application Deadline</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={sortOrder === 'deadline_newest'}
                      onChange={() => setSortOrder('deadline_newest')}
                      className="rounded"
                    />
                    <span>Far to Recent</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={sortOrder === 'deadline_oldest'}
                      onChange={() => setSortOrder('deadline_oldest')}
                      className="rounded"
                    />
                    <span>Recent to Far</span>
                  </label>
                </div>
              </div>
              
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={sortOrder === null}
                  onChange={() => setSortOrder(null)}
                  className="rounded"
                />
                <span>Set to Default</span>
              </label>
            </div>
          </div>

          {/* Salary Sort */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Sort by Salary</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={salarySort === 'highest'}
                  onChange={() => setSalarySort('highest')}
                  className="rounded"
                />
                <span>Highest to Lowest</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={salarySort === 'lowest'}
                  onChange={() => setSalarySort('lowest')}
                  className="rounded"
                />
                <span>Lowest to Highest</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={salarySort === 'custom'}
                  onChange={() => setSalarySort('custom')}
                  className="rounded"
                />
                <span>Custom Range</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={salarySort === null}
                  onChange={() => {
                    setSalarySort(null);
                    setSalaryRange({ min: 0, max: 200000 });
                  }}
                  className="rounded"
                />
                <span>Set to Default</span>
              </label>
            </div>
            {salarySort === 'custom' && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Min:</span>
                  <input
                    type="number"
                    value={salaryRange.min}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-24 p-1 border rounded"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Max:</span>
                  <input
                    type="number"
                    value={salaryRange.max}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-24 p-1 border rounded"
                    min="0"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link 
                key={job.job_id}
                href={`/jobs/${job.job_id}`}
                className="relative block border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#0A0A0A]"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-black hover:text-black/80 dark:text-[#d1e6ff] dark:hover:text-[#d1e6ff]/80"
                    >
                      <BookmarkPlus className="h-8 w-8" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to save to dashboard</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-start mb-6 pr-12">
                  <Image 
                    src={job.company_logo} 
                    alt={`${job.company_name} logo`} 
                    width={56}
                    height={56}
                    className="rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-1">{job.job_title}</h2>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">{job.company_name}</p>
                  </div>
                </div>

                <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
                  {job.job_description.length > 150 
                    ? `${job.job_description.substring(0, 150)}...` 
                    : job.job_description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Location</span>
                    <p className="text-base font-semibold text-black dark:text-white">{job.location}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Position</span>
                    <p className="text-base font-semibold text-black dark:text-white">{job.position}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white-700 dark:text-gray-300">Application Deadline</span>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">
                      {new Date(job.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Posted</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(job.posted_on).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {job.salary_range && (
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-white-700 dark:text-gray-300">Salary Range</span>
                      <p className="text-xl font-bold text-black dark:text-[#D1E6FF]">
                        {formatSalary(job.salary_range.min)} - {formatSalary(job.salary_range.max)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {job.job_tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-sm font-medium bg-black/5 dark:bg-[#D1E6FF]/10 text-black dark:text-[#D1E6FF] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
