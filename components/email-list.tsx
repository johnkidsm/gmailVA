"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Archive, Clock, Star, Trash2 } from "lucide-react"
import EmailDetailView from "./email-detail-view"
import { type EmailData, deleteEmail, markAsRead, toggleStar } from "@/services/gmail-service"
import type { EmailCategory } from "./email-categories"

// Category color indicators
const categoryColors = {
  primary: "bg-blue-500",
  social: "bg-green-500",
  promotions: "bg-yellow-500",
  updates: "bg-purple-500",
  forums: "bg-red-500",
}

interface EmailListProps {
  emails: EmailData[]
  onEmailsChange: (emails: EmailData[]) => void
  accessToken?: string
  category?: EmailCategory
}

export default function EmailList({ emails, onEmailsChange, accessToken, category }: EmailListProps) {
  const { toast } = useToast()
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})

  // Filter emails by category if provided
  const filteredEmails = category ? emails.filter((email) => email.category === category) : emails

  const handleEmailClick = async (emailId: string) => {
    setSelectedEmail(emailId)

    // Mark as read if it's unread
    const email = emails.find((e) => e.id === emailId)
    if (email && !email.read && accessToken) {
      try {
        const success = await markAsRead(accessToken, emailId)
        if (success) {
          // Update the email in the list
          onEmailsChange(emails.map((e) => (e.id === emailId ? { ...e, read: true } : e)))
        }
      } catch (error) {
        console.error("Failed to mark email as read:", error)
      }
    }
  }

  const handleBackToList = () => {
    setSelectedEmail(null)
  }

  const handleStarToggle = async (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    if (!accessToken || isProcessing[emailId]) return

    const email = emails.find((e) => e.id === emailId)
    if (!email) return

    setIsProcessing((prev) => ({ ...prev, [emailId]: true }))

    try {
      const success = await toggleStar(accessToken, emailId, email.starred)
      if (success) {
        // Update the email in the list
        onEmailsChange(emails.map((e) => (e.id === emailId ? { ...e, starred: !e.starred } : e)))
      } else {
        toast({
          title: "Error",
          description: "Failed to update star status. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to toggle star:", error)
      toast({
        title: "Error",
        description: "Failed to update star status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing((prev) => ({ ...prev, [emailId]: false }))
    }
  }

  const handleDelete = async (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    if (!accessToken || isProcessing[emailId]) return

    setIsProcessing((prev) => ({ ...prev, [emailId]: true }))

    try {
      const success = await deleteEmail(accessToken, emailId)
      if (success) {
        // Remove the email from the list
        onEmailsChange(emails.filter((e) => e.id !== emailId))
        toast({
          title: "Email deleted",
          description: "The email has been moved to trash.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete email. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete email:", error)
      toast({
        title: "Error",
        description: "Failed to delete email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing((prev) => ({ ...prev, [emailId]: false }))
    }
  }

  // If an email is selected, show the detail view
  if (selectedEmail !== null) {
    const email = emails.find((e) => e.id === selectedEmail)
    if (email) {
      return (
        <EmailDetailView
          email={email}
          onBack={handleBackToList}
          accessToken={accessToken}
          onEmailChange={(updatedEmail) => {
            onEmailsChange(emails.map((e) => (e.id === updatedEmail.id ? updatedEmail : e)))
          }}
          onEmailDelete={(emailId) => {
            onEmailsChange(emails.filter((e) => e.id !== emailId))
            handleBackToList()
          }}
        />
      )
    }
  }

  // Otherwise show the email list
  return (
    <div className="divide-y">
      {filteredEmails.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No emails in this category</p>
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
                onClick={(e) => handleStarToggle(e, email.id)}
                disabled={isProcessing[email.id]}
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
              {!category && (
                <div
                  className={`h-2 w-2 rounded-full mr-1 ${categoryColors[email.category as EmailCategory] || "bg-gray-400"}`}
                  title={`${email.category.charAt(0).toUpperCase() + email.category.slice(1)} category`}
                ></div>
              )}
              {!email.read && <Badge variant="default" className="h-2 w-2 rounded-full p-0" />}
              <div className="hidden sm:flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isProcessing[email.id]}
                >
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleDelete(e, email.id)}
                  disabled={isProcessing[email.id]}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isProcessing[email.id]}
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
  )
}
