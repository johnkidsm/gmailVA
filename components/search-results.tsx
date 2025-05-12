"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Archive, Clock, Star, Trash2 } from "lucide-react"
import EmailDetailView from "./email-detail-view"
import type { FilterCriteria } from "./advanced-search"
import type { EmailCategory } from "./email-categories"
import type { FilterOperator } from "./advanced-search"
import { format } from "date-fns"

// Sample email data
const allEmails = [
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
    category: "primary" as EmailCategory,
    hasAttachment: true,
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
    category: "promotions" as EmailCategory,
    hasAttachment: false,
    recipients: ["team@company.com", "executives@company.com"],
  },
  // More sample emails...
]

// Category color indicators
const categoryColors = {
  primary: "bg-blue-500",
  social: "bg-green-500",
  promotions: "bg-yellow-500",
  updates: "bg-purple-500",
  forums: "bg-red-500",
}

interface SearchResultsProps {
  filters: FilterCriteria[]
  onClearSearch: () => void
}

export default function SearchResults({ filters, onClearSearch }: SearchResultsProps) {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)

  // Filter emails based on the search criteria
  const filteredEmails = allEmails.filter((email) => {
    return filters.every((filter) => {
      switch (filter.field) {
        case "from":
          return matchTextFilter(email.sender + email.senderEmail, filter.operator, filter.value as string)
        case "to":
          return true // Simplified for demo
        case "subject":
          return matchTextFilter(email.subject, filter.operator, filter.value as string)
        case "body":
          return matchTextFilter(email.content, filter.operator, filter.value as string)
        case "has_attachment":
          return email.hasAttachment === filter.value
        case "category":
          return email.category === filter.value
        case "date":
          return matchDateFilter(new Date(email.date), filter.operator, filter.value as Date)
        case "is_starred":
          return email.starred === filter.value
        case "is_unread":
          return !email.read === filter.value
        default:
          return true
      }
    })
  })

  function matchTextFilter(text: string, operator: FilterOperator | undefined, value: string): boolean {
    if (!value) return true
    const lowerText = text.toLowerCase()
    const lowerValue = value.toLowerCase()

    switch (operator) {
      case "contains":
        return lowerText.includes(lowerValue)
      case "equals":
        return lowerText === lowerValue
      case "not_contains":
        return !lowerText.includes(lowerValue)
      case "starts_with":
        return lowerText.startsWith(lowerValue)
      case "ends_with":
        return lowerText.endsWith(lowerValue)
      default:
        return true
    }
  }

  function matchDateFilter(date: Date, operator: FilterOperator | undefined, value: Date): boolean {
    if (!value) return true

    // Reset time to compare just the dates
    const emailDate = new Date(date)
    emailDate.setHours(0, 0, 0, 0)

    const filterDate = new Date(value)
    filterDate.setHours(0, 0, 0, 0)

    switch (operator) {
      case "equals":
        return emailDate.getTime() === filterDate.getTime()
      case "contains": // after
        return emailDate.getTime() >= filterDate.getTime()
      case "not_contains": // before
        return emailDate.getTime() <= filterDate.getTime()
      default:
        return true
    }
  }

  const handleEmailClick = (emailId: number) => {
    setSelectedEmail(emailId)
  }

  const handleBackToList = () => {
    setSelectedEmail(null)
  }

  // If an email is selected, show the detail view
  if (selectedEmail !== null) {
    const email = allEmails.find((e) => e.id === selectedEmail)
    if (email) {
      return <EmailDetailView email={email} onBack={handleBackToList} />
    }
  }

  // Create a summary of the applied filters for display
  const filterSummary = filters.map((filter) => {
    let summary = ""
    switch (filter.field) {
      case "from":
      case "to":
      case "subject":
      case "body":
        summary = `${filter.field} ${filter.operator} "${filter.value}"`
        break
      case "has_attachment":
        summary = filter.value ? "has attachments" : "no attachments"
        break
      case "category":
        summary = `in ${filter.value} category`
        break
      case "date":
        const dateStr = filter.value ? format(filter.value as Date, "MMM d, yyyy") : ""
        summary = `date ${filter.operator === "equals" ? "is" : filter.operator === "contains" ? "after" : "before"} ${dateStr}`
        break
      case "is_starred":
        summary = filter.value ? "is starred" : "not starred"
        break
      case "is_unread":
        summary = filter.value ? "is unread" : "is read"
        break
    }
    return summary
  })

  return (
    <div>
      {/* Search summary */}
      <div className="bg-muted/30 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">
            Search Results: {filteredEmails.length} {filteredEmails.length === 1 ? "email" : "emails"}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {filterSummary.map((summary, index) => (
              <Badge key={index} variant="outline">
                {summary}
              </Badge>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClearSearch}>
          Clear Search
        </Button>
      </div>

      {/* Results list */}
      <div className="divide-y">
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No emails match your search criteria</p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`flex items-start p-4 hover:bg-muted/50 cursor-pointer ${
                !email.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
              }`}
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
                <div
                  className={`h-2 w-2 rounded-full mr-1 ${categoryColors[email.category]}`}
                  title={`${email.category.charAt(0).toUpperCase() + email.category.slice(1)} category`}
                ></div>
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
          ))
        )}
      </div>
    </div>
  )
}
