"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Archive, Clock, Star, Trash2 } from "lucide-react"
import EmailDetailView from "./email-detail-view"

// Sample email data
const emails = [
  {
    id: 1,
    sender: "John Smith",
    senderEmail: "john.smith@example.com",
    subject: "Quarterly Report Review",
    preview:
      "I've attached the quarterly report for your review. Please let me know if you have any questions or concerns.",
    content: `
      <p>Hi there,</p>
      <p>I've attached the quarterly report for your review. The numbers are looking good, and we've exceeded our targets in several key areas.</p>
      <p>Here are some highlights:</p>
      <ul>
        <li>Revenue increased by 15% compared to last quarter</li>
        <li>Customer acquisition costs decreased by 8%</li>
        <li>Our new marketing campaign exceeded expectations with a 24% conversion rate</li>
      </ul>
      <p>There are three action items that require your attention by Friday:</p>
      <ol>
        <li>Review the budget allocation for Q3</li>
        <li>Approve the new hiring plan</li>
        <li>Provide feedback on the product roadmap</li>
      </ol>
      <p>Let me know if you'd like to schedule a call to discuss any of these items in more detail.</p>
      <p>Best regards,<br>John</p>
    `,
    time: "10:30 AM",
    date: "May 12, 2023",
    read: false,
    starred: true,
    avatar: "JS",
    attachments: [
      {
        name: "Q2_Financial_Report.pdf",
        size: "2.4 MB",
        type: "PDF",
      },
      {
        name: "Marketing_Analytics.xlsx",
        size: "1.8 MB",
        type: "Excel",
      },
    ],
  },
  {
    id: 2,
    sender: "Marketing Team",
    senderEmail: "marketing@company.com",
    subject: "Campaign Strategy for Q3",
    preview: "Here's the updated marketing strategy for Q3. We've incorporated the feedback from last week's meeting.",
    content: `
      <p>Hello,</p>
      <p>Attached is the updated marketing strategy for Q3. We've incorporated all the feedback from last week's meeting and made several adjustments to the campaign timeline.</p>
      <p>The key changes include:</p>
      <ul>
        <li>Shifted the product launch to mid-August to align with the industry conference</li>
        <li>Increased the social media advertising budget by 20%</li>
        <li>Added two new content marketing initiatives focused on our enterprise customers</li>
      </ul>
      <p>Please review the document and share any additional feedback by Wednesday so we can finalize the plan.</p>
      <p>Thanks,<br>Marketing Team</p>
    `,
    time: "Yesterday",
    date: "May 11, 2023",
    read: true,
    starred: false,
    avatar: "MT",
    recipients: ["team@company.com", "executives@company.com"],
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    senderEmail: "sarah.j@partner.org",
    subject: "Partnership Opportunity",
    preview:
      "I'd like to discuss a potential partnership opportunity between our organizations. Are you available for a call next week?",
    content: `
      <p>Dear Team,</p>
      <p>I hope this email finds you well. I'm reaching out because I see a great opportunity for collaboration between our organizations.</p>
      <p>Our company has developed a complementary service that would integrate well with your platform, creating added value for both our customer bases. I believe a strategic partnership could be mutually beneficial.</p>
      <p>Some potential areas for collaboration include:</p>
      <ul>
        <li>Co-marketing activities</li>
        <li>Integration of our respective technologies</li>
        <li>Joint webinars and educational content</li>
      </ul>
      <p>Would you be available for a call next week to discuss this further? I'm flexible on Tuesday or Thursday afternoon.</p>
      <p>Looking forward to your response.</p>
      <p>Best regards,<br>Sarah Johnson<br>Business Development Director</p>
    `,
    time: "Yesterday",
    date: "May 11, 2023",
    read: false,
    starred: false,
    avatar: "SJ",
    cc: ["partnerships@partner.org"],
  },
  {
    id: 4,
    sender: "Tech Support",
    senderEmail: "support@techco.com",
    subject: "RE: System Access Issue",
    preview:
      "We've resolved the system access issue you reported. Please try logging in again and let us know if you encounter any problems.",
    content: `
      <p>Hello,</p>
      <p>We've resolved the system access issue you reported earlier today. The problem was related to an authentication server that was temporarily down during our maintenance window.</p>
      <p>Please try logging in again and let us know if you encounter any further problems. All your data is intact and no information was lost during this outage.</p>
      <p>We apologize for any inconvenience this may have caused.</p>
      <p>If you need any further assistance, please don't hesitate to contact us.</p>
      <p>Regards,<br>Tech Support Team</p>
    `,
    time: "May 10",
    date: "May 10, 2023",
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
    content: `
      <p>Hi,</p>
      <p>Based on our discussion yesterday, I've updated the project timeline to accommodate the new requirements. The revised schedule extends the development phase by two weeks but still keeps us on track for the Q4 launch.</p>
      <p>Key milestones:</p>
      <ul>
        <li>Requirements finalization: June 15</li>
        <li>Design approval: July 10</li>
        <li>Development completion: August 30</li>
        <li>QA and testing: September 15</li>
        <li>Launch preparation: October 1</li>
      </ul>
      <p>Please review the attached document and let me know if you have any concerns about the new timeline.</p>
      <p>Thanks,<br>Alex</p>
    `,
    time: "May 9",
    date: "May 9, 2023",
    read: true,
    starred: true,
    avatar: "AW",
    attachments: [
      {
        name: "Project_Timeline_v2.pdf",
        size: "1.2 MB",
        type: "PDF",
      },
    ],
  },
  {
    id: 6,
    sender: "HR Department",
    senderEmail: "hr@company.com",
    subject: "Important: Benefits Enrollment",
    preview:
      "This is a reminder that the annual benefits enrollment period ends on May 15. Please complete your selections by then.",
    content: `
      <p>Dear Employee,</p>
      <p>This is a reminder that the annual benefits enrollment period ends on <strong>May 15</strong>. If you haven't already done so, please complete your selections by this date.</p>
      <p>Changes to your benefits this year include:</p>
      <ul>
        <li>New dental plan options</li>
        <li>Expanded mental health coverage</li>
        <li>Additional retirement investment choices</li>
        <li>Improved family leave policies</li>
      </ul>
      <p>To make your selections, please log in to the HR portal and navigate to the Benefits section. If you need assistance, please contact the HR helpdesk.</p>
      <p>Thank you,<br>HR Department</p>
    `,
    time: "May 8",
    date: "May 8, 2023",
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
    content: `
      <p>Dear Speaker,</p>
      <p>Thank you for agreeing to speak at the Industry Summit 2023. We're excited to have you share your expertise with our attendees.</p>
      <p>Your session is currently scheduled for:</p>
      <p><strong>Date:</strong> September 15, 2023<br>
      <strong>Time:</strong> 2:00 PM - 3:30 PM<br>
      <strong>Location:</strong> Main Conference Hall, Room A<br>
      <strong>Topic:</strong> "Innovation in the Digital Age"</p>
      <p>Please confirm these details by May 20. If you need to make any changes to your session information, please let us know as soon as possible.</p>
      <p>We'll be in touch in the coming weeks with more information about the conference logistics, A/V requirements, and promotional materials.</p>
      <p>Best regards,<br>Conference Organizing Team</p>
    `,
    time: "May 7",
    date: "May 7, 2023",
    read: true,
    starred: false,
    avatar: "CT",
  },
]

export default function EmailList() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)

  const handleEmailClick = (emailId: number) => {
    setSelectedEmail(emailId)
  }

  const handleBackToList = () => {
    setSelectedEmail(null)
  }

  // If an email is selected, show the detail view
  if (selectedEmail !== null) {
    const email = emails.find((e) => e.id === selectedEmail)
    if (email) {
      return <EmailDetailView email={email} onBack={handleBackToList} />
    }
  }

  // Otherwise show the email list
  return (
    <div className="divide-y">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`flex items-start p-4 hover:bg-muted/50 cursor-pointer ${!email.read ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
          onClick={() => handleEmailClick(email.id)}
        >
          <div className="flex items-center gap-3 mr-3">
            <Checkbox id={`email-${email.id}`} onClick={(e) => e.stopPropagation()} />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                // Handle star toggle logic here
              }}
            >
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
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle archive logic here
                }}
              >
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle delete logic here
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle snooze logic here
                }}
              >
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
