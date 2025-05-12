interface ResourceListProps {
  title: string;
  items: string[];
  downloadable?: boolean;
}

export default function ResourceList({
  title,
  items,
  downloadable = false,
}: ResourceListProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <ul className="list-disc list-inside space-y-2">
        {items.map((item, idx) => (
          <li key={idx}>
            {downloadable ? (
              <a
                href={`/static/${item}`}
                download
                className="text-blue-600 underline hover:text-blue-800"
              >
                {item}
              </a>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
