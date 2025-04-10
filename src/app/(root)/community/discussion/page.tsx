import DiscussionForm from "@/components/DiscussionForm";
import DiscussionList from "@/components/DiscussionList";



export default function DiscussionPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Community Discussions</h1>
      <DiscussionForm />
      <DiscussionList />
    </div>
  );
}