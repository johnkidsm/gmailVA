import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Archive, Clock, Star, Trash2 } from "lucide-react"

// Sample email data
const emails = [
  {
    id: 1,
    sender: "John Smith",
    senderEmail: "john.smith@example.com",
    subject: "Quarterly Report Review",
    preview:
      "I've attached the quarterly report for your review. Please let me know if you have any questions or concerns.",
    time: "10:30 AM",
    read: false,
    starred: true,
    avatar: "JS",
  },
  {
    id: 2,
    sender: "Marketing Team",
    senderEmail: "marketing@company.com",
    subject: "Campaign Strategy for Q3",
    preview: "Here's the updated marketing strategy for Q3. We've incorporated the feedback from last week's meeting.",
    time: "Yesterday",
    read: true,
    starred: false,
    avatar: "MT",
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    senderEmail: "sarah.j@partner.org",
    subject: "Partnership Opportunity",
    preview:
      "I'd like to discuss a potential partnership opportunity between our organizations. Are you available for a call next week?",
    time: "Yesterday",
    read: false,
    starred: false,
    avatar: "SJ",
  },
  {
    id: 4,
    sender: "Tech Support",
    senderEmail: "support@techco.com",
    subject: "RE: System Access Issue",
    preview:
      "We've resolved the system access issue you reported. Please try logging in again and let us know if you encounter any problems.",
    time: "May 10",
    read: true,
    starred: false,
    avatar: "TS",
  },
  {
    id: 5,
    sender: "Alex Wong",
    senderEmail: "alex.wong@client.com",
    subject: "Project Timeline Update",
    preview:
      "Based on our discussion yesterday, I've updated the project timeline. Please review the attached document.",
    time: "May 9",
    read: true,
    starred: true,
    avatar: "AW",
  },
  {
    id: 6,
    sender: "HR Department",
    senderEmail: "hr@company.com",
    subject: "Important: Benefits Enrollment",
    preview:
      "This is a reminder that the annual benefits enrollment period ends on May 15. Please complete your selections by then.",
    time: "May 8",
    read: true,
    starred: false,
    avatar: "HR",
  },
  {
    id: 7,
    sender: "Conference Team",
    senderEmail: "conference@industry.org",
    subject: "Speaker Confirmation: Industry Summit 2023",
    preview:
      "Thank you for agreeing to speak at the Industry Summit 2023. Please confirm your session details by May 20.",
    time: "May 7",
    read: true,
    starred: false,
    avatar: "CT",
  },
]

export default function EmailList() {
  return (
    <div className="divide-y">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`flex items-start p-4 hover:bg-muted/50 cursor-pointer ${!email.read ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
        >
          <div className="flex items-center gap-3 mr-3">
            <Checkbox id={`email-${email.id}`} />
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Star className={`h-4 w-4 ${email.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
              <span className="sr-only">Star</span>
            </Button>
          </div>

          <Avatar className="mt-1 mr-3 h-8 w-8">
            <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${email.avatar}`} alt={email.sender} />
            <AvatarFallback>{email.avatar}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium truncate ${!email.read ? "font-semibold" : ""}`}>{email.sender}</p>
              <span className="text-xs text-muted-foreground">{email.time}</span>
            </div>
            <p className={`text-sm truncate ${!email.read ? "font-semibold" : ""}`}>{email.subject}</p>
            <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
          </div>

          <div className="flex items-center gap-1 ml-2">
            {!email.read && <Badge variant="default" className="h-2 w-2 rounded-full p-0" />}
            <div className="hidden sm:flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Clock className="h-4 w-4" />
                <span className="sr-only">Snooze</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
