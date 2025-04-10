interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
}

const mockDiscussions: Discussion[] = [
  {
    id: 1,
    title: "Tips for job interviews",
    content: "How to stand out in interviews?",
    author: "Alice",
  },
  {
    id: 2,
    title: "Which country for master's?",
    content: "Germany vs Canada?",
    author: "Bob",
  },
];

export default function DiscussionList() {
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold">Discussions</h2>
      {mockDiscussions.map((d) => (
        <div key={d.id} className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-semibold">{d.title}</h3>
          <p className="text-gray-700">{d.content}</p>
          <p className="text-sm text-gray-500">Posted by {d.author}</p>
        </div>
      ))}
    </div>
  );
}
