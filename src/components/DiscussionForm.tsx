import { usePostDiscussionMutation } from "@/features/discussion/discussionApi";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Select from "react-select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { StylesConfig } from "react-select";

export default function DiscussionForm() {
  const [postDiscussion] = usePostDiscussionMutation();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");


  const customStyles: StylesConfig<{ value: string; label: string }, false> = {
    control: (base) => ({
      ...base,
      backgroundColor: "", // black background
      borderColor: "#333", // optional: dark border
      color: "#fff", // text color inside control
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff", // selected item text color
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#000", // dropdown background
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#111" : "#000", // focused vs normal
      color: "#fff", // option text color
      cursor: "pointer",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#aaa", // placeholder color
    }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postDiscussion({
        title,
        content,
        category,
        authorId: userId,
      }).unwrap();
      toast.success("Discussion posted successfully!");
      setTitle("");
      setContent("");
      setCategory("");
    } catch (error) {
      toast.error("Failed to post discussion. Please try again.");
    }
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
      className="p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Start a New Discussion</h2>

      <Input
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Select
        options={categoryOptions}
        value={categoryOptions.find((opt) => opt.value === category)}
        onChange={(selected) => setCategory(selected?.value || "")}
        placeholder="Select a category"
        styles={customStyles}
      />

      <Textarea
        placeholder="Write your discussion..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px]"
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
