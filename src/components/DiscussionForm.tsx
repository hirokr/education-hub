"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Select from "react-select";


export default function DiscussionForm({ onPost }: { onPost: (title: string, content: string, category: string) => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(title, content, category);
    onPost(title, content, category);
    setTitle("");
    setContent("");
  };
  
  const categories = [
    "Tech",
    "Education",
    "Career",
    "General",
    "Health & Wellness",
    "Scholarships",
    "Admissions",
    "Jobs & Internships",
    "Study Abroad",
    "Coding",
    "AI & ML",
    "Web Development",
    "Mobile Development",
    "Open Source",
    "Networking",
    "Startups",
    "Freelancing",
    "Productivity",
    "Research",
    "Student Life",
    "Events & Competitions",
    "Finance",
    "Remote Work",
    "Design",
    "Data Science",
    "DevOps",
    "Cybersecurity",
    "Languages & Exams",
    "Masters Programs",
    "PhD & Research",
    "Community Help",
    "Books & Resources",
    "Success Stories",
    "Motivation",
    "Programming Languages",
    "UX/UI",
    "Blockchain",
    "Cloud Computing",
    "Mentorship",
  ];

  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));

  return (
    <form
      onSubmit={handleSubmit}
      className=" p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Start a New Discussion</h2>

      <Input
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md"
        required
      />
      <Select
        options={categoryOptions}
        value={categoryOptions.find((opt) => opt.value === category)}
        onChange={(selected) => setCategory(selected?.value || "")}
        placeholder="Select a category"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#141414", // Tailwind bg-gray-800
            color: "white",
            borderColor: "#4b5563", // Tailwind border-gray-600
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#1f2937",
            color: "white",
          }),
          singleValue: (base) => ({
            ...base,
            color: "white",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#374151" : "#1f2937", // hover bg-gray-700
            color: "white",
          }),
        }}
      />

      <Textarea
        placeholder="Write your discussion..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded-md min-h-[120px]"
        required
      />

      <Button
        type="submit"
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Post Discussion
      </Button>
    </form>
  );
}
