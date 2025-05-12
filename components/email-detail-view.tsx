"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Archive,
  ArrowLeft,
  Clock,
  Forward,
  Loader2,
  MoreHorizontal,
  Paperclip,
  Printer,
  Reply,
  ReplyAll,
  Star,
  Trash2,
} from "lucide-react"
import { type EmailData, deleteEmail, sendEmail, toggleStar } from "@/services/gmail-service"

interface EmailDetailProps {
  email: EmailData
  onBack: () => void
  accessToken?: string
  onEmailChange?: (email: EmailData) => void
  onEmailDelete?: (emailId: string) => void
}

export default function EmailDetailView({
  email,
  onBack,
  accessToken,
  onEmailChange,
  onEmailDelete,
}: EmailDetailProps) {
  const { toast } = useToast()
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isStarring, setIsStarring] = useState(false)

  const handleReply = () => {
    setIsReplying(true)
  }

  const handleSendReply = async () => {
    if (!accessToken || !replyText.trim()) return

    setIsSending(true)
    try {
      const success = await sendEmail(accessToken, email.senderEmail, `Re: ${email.subject}`, replyText)

      if (success) {
        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully.",
        })
        setIsReplying(false)
        setReplyText("")
      } else {
        toast({
          title: "Error",
          description: "Failed to send reply. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to send reply:", error)
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSmartReply = (text: string) => {
    setIsReplying(true)
    setReplyText(text)
  }

  const handleDelete = async () => {
    if (!accessToken) return

    setIsDeleting(true)
    try {
      const success = await deleteEmail(accessToken, email.id)
      if (success) {
        toast({
          title: "Email deleted",
          description: "The email has been moved to trash.",
        })
        if (onEmailDelete) {
          onEmailDelete(email.id)
        }
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
      setIsDeleting(false)
    }
  }

  const handleStarToggle = async () => {
    if (!accessToken) return

    setIsStarring(true)
    try {
      const success = await toggleStar(accessToken, email.id, email.starred)
      if (success) {
        const updatedEmail = { ...email, starred: !email.starred }
        if (onEmailChange) {
          onEmailChange(updatedEmail)
        }
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
      setIsStarring(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Email Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to inbox</span>
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Archive className="h-5 w-5" />
                    <span className="sr-only">Archive</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Archive</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Clock className="h-5 w-5" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Snooze</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Printer className="h-5 w-5" />
                    <span className="sr-only">Print</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More options</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-3xl mx-auto">
          {/* Subject */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{email.subject}</h1>
            <Button
              variant="ghost"
              size="icon"
              className={email.starred ? "text-yellow-400" : ""}
              onClick={handleStarToggle}
              disabled={isStarring}
            >
              {isStarring ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Star className={`h-5 w-5 ${email.starred ? "fill-yellow-400" : ""}`} />
              )}
              <span className="sr-only">{email.starred ? "Unstar" : "Star"}</span>
            </Button>
          </div>

          {/* Sender Info */}
          <div className="flex items-start gap-3 mb-6">
            <Avatar className="h-10 w-10 mt-1">
              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${email.avatar}`} alt={email.sender} />
              <AvatarFallback>{email.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{email.sender}</div>
                  <div className="text-sm text-muted-foreground">{`<${email.senderEmail}>`}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {email.date} at {email.time}
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">To: me</div>
            </div>
          </div>

          {/* Email Body */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <div dangerouslySetInnerHTML={{ __html: email.content }} />
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Attachments ({email.attachments.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {email.attachments.map((attachment, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-3 flex items-center gap-3">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{attachment.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {attachment.type} • {attachment.size}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Smart Reply Suggestions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Smart Reply</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-1.5"
                onClick={() =>
                  handleSmartReply("Thanks for sharing this information. I'll review it and get back to you.")
                }
              >
                <span>Thanks for sharing this information.</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-1.5"
                onClick={() =>
                  handleSmartReply("I appreciate your email. Let's schedule a meeting to discuss this further.")
                }
              >
                <span>Let's schedule a meeting to discuss this.</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-1.5"
                onClick={() => handleSmartReply("This looks great! I approve the changes.")}
              >
                <span>This looks great! I approve.</span>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Reply Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" onClick={handleReply} className="gap-2">
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <ReplyAll className="h-4 w-4" />
              <span>Reply All</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Forward className="h-4 w-4" />
              <span>Forward</span>
            </Button>
          </div>

          {/* Reply Box */}
          {isReplying && (
            <div className="border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">
                  <span className="font-medium">Reply to:</span> {email.sender} {`<${email.senderEmail}>`}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
              </div>
              <Textarea
                placeholder="Write your reply..."
                className="min-h-[150px] mb-3"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsReplying(false)}>
                    Discard
                  </Button>
                  <Button onClick={handleSendReply} disabled={isSending || !replyText.trim()}>
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
