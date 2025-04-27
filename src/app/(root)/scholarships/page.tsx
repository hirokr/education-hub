'use client';

import { getScholarships } from '@/lib/scholarships';
import { useState, useEffect } from 'react';
import { Scholarship } from '@/types/scholarship';
import Link from 'next/link';
import { BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    locations: [] as string[],
    tags: [] as string[],
  });
  const [sortOrder, setSortOrder] = useState<'deadline-asc' | 'deadline-desc' | 'amount-asc' | 'amount-desc' | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  useEffect(() => {
    const fetchScholarships = async () => {
      const data = await getScholarships();
      setScholarships(data);
      setFilteredScholarships(data);
    };
    fetchScholarships();
  }, []);

  useEffect(() => {
    let result = scholarships;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(scholarship => 
        scholarship.title.toLowerCase().includes(searchLower) ||
        scholarship.sponsor.toLowerCase().includes(searchLower) ||
        scholarship.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.locations.length > 0) {
      result = result.filter(scholarship => filters.locations.includes(scholarship.location));
    }
    if (filters.tags.length > 0) {
      result = result.filter(scholarship => 
        scholarship.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Apply sorting
    if (sortOrder === 'deadline-asc') {
      result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortOrder === 'deadline-desc') {
      result.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    } else if (sortOrder === 'amount-asc') {
      result.sort((a, b) => {
        const amountA = parseInt(a.amount.replace(/[^0-9]/g, ''));
        const amountB = parseInt(b.amount.replace(/[^0-9]/g, ''));
        return amountB - amountA;
      });
    } else if (sortOrder === 'amount-desc') {
      result.sort((a, b) => {
        const amountA = parseInt(a.amount.replace(/[^0-9]/g, ''));
        const amountB = parseInt(b.amount.replace(/[^0-9]/g, ''));
        return amountA - amountB;
      });
    }

    setFilteredScholarships(result);
  }, [searchTerm, filters, sortOrder, scholarships]);

  const uniqueLocations = [...new Set(scholarships.map(s => s.location))];
  const uniqueTags = [...new Set(scholarships.flatMap(s => s.tags))];

  const toggleFilter = (type: 'locations' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search scholarships by title, sponsor, or tags..."
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

          {/* Tags Dropdown */}
          <div className="border rounded-lg p-4">
            <button
              onClick={() => setIsTagsOpen(!isTagsOpen)}
              className="w-full flex justify-between items-center font-semibold"
            >
              <span>Tags</span>
              <span>{isTagsOpen ? '▼' : '▶'}</span>
            </button>
            {isTagsOpen && (
              <div className="mt-4 space-y-2">
                {uniqueTags.map(tag => (
                  <label key={tag} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => toggleFilter('tags', tag)}
                      className="rounded"
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Sort by</h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white-700">Application Deadline</p>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={sortOrder === 'deadline-asc'}
                    onChange={() => setSortOrder('deadline-asc')}
                    className="rounded"
                  />
                  <span>Distant to Nearest</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={sortOrder === 'deadline-desc'}
                    onChange={() => setSortOrder('deadline-desc')}
                    className="rounded"
                  />
                  <span>Nearest to Distant</span>
                </label>
              </div>
              <div className="space-y-1 mt-3">
                <p className="text-sm font-semibold text-white-700">Amount</p>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={sortOrder === 'amount-desc'}
                    onChange={() => setSortOrder('amount-desc')}
                    className="rounded"
                  />
                  <span>High to Low</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={sortOrder === 'amount-asc'}
                    onChange={() => setSortOrder('amount-asc')}
                    className="rounded"
                  />
                  <span>Low to High</span>
                </label>
              </div>
              <label className="flex items-center space-x-2 mt-3">
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
        </div>

        {/* Scholarships Grid */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Available Scholarships</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
              <div key={scholarship.scholarship_id} className="relative border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#0A0A0A]">
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
                <Link 
                  href={`/scholarships/${scholarship.scholarship_id}`}
                  className="block">

                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{scholarship.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sponsored by</span>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">{scholarship.sponsor}</p>
                  </div>
                </div>
                
                <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
                  {scholarship.description.length > 150 
                    ? `${scholarship.description.substring(0, 150)}...` 
                    : scholarship.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-white-600 dark:text-grey-300">Amount</span>
                    <p className="text-xl font-bold text-black dark:text-[#D1E6FF]">{scholarship.amount}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-white-600 dark:text-grey-300">Application Deadline</span>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">
                      {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Posted</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(scholarship.posted_on).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Location</span>
                    <p className="text-base font-semibold text-black dark:text-white">{scholarship.location}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Eligibility</span>
                    <p className="text-base font-semibold text-black dark:text-white">{scholarship.eligibility}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {scholarship.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-sm font-medium bg-black/5 dark:bg-[#D1E6FF]/10 text-black dark:text-[#D1E6FF] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
