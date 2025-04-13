import ReplyList from "@/components/ReplyList";


export default async function DiscussionPage( {params}: {params:Promise<{id: string}>}) {
 
   const {id} = await params;


 
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/discussion/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    return <div className="p-6 text-red-500">Discussion not found.</div>;
  }

  const discussion = await res.json();



  return (
    <>
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">{discussion.title}</h1>
        <p className="text-gray-700">{discussion.content}</p>
        <p className="text-sm text-gray-500">
          Posted by {discussion.author.name}
        </p>
      </div>

      <ReplyList discussionId={id} />
    
    </>
  );
}
