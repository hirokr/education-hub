import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface RoadmapItem {
  title: string
  description: string
  skills: string[]
}

interface RoadmapTimelineProps {
  data: RoadmapItem[]
}

export default function RoadmapTimeline({ data }: RoadmapTimelineProps) {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:left-9 before:ml-px before:h-full before:border-l-2 before:border-muted sm:space-y-12">
      {data.map((item, index) => (
        <div key={index} className="relative flex items-start">
          <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
            <CheckCircle className="h-5 w-5" />
          </div>
          <Card className="ml-14 w-full">
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
