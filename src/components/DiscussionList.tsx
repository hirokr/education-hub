import Link from "next/link";

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  author: {
    name: string;
  };
}

interface DiscussionListProps {
  data: Discussion[];
}

export default function DiscussionList({ data }: DiscussionListProps) {

  
  


  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold">Discussions</h2>
      <div className="text-right -mt-10"><Link href="/community/discussion">Post</Link></div>
      
      {data.map((d) => (
        <Link href= {`/discussion/${d.id}`} key={d.id}>
             <div key={d.id} className="p-4 border rounded-md shadow-sm bg-accent mb-3">
          <h3 className="text-lg font-semibold">{d.title}</h3>
          <p className="text-gray-700 truncate">{d.content}</p>
          <p className="text-sm text-gray-500">Posted by {d.author.name}</p>
        </div>
        </Link>
     
      ))}
    </div>
  );
}
