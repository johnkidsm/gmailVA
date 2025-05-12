"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  ImageIcon,
  Paperclip,
  Trash2,
  Minimize2,
  Maximize2,
  X,
  Loader2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { sendEmail } from "@/services/gmail-service"

interface ComposeEmailModalProps {
  isOpen: boolean
  onClose: () => void
  accessToken?: string
  onEmailSent?: () => void
}

export default function ComposeEmailModal({ isOpen, onClose, accessToken, onEmailSent }: ComposeEmailModalProps) {
  const { toast } = useToast()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isFullscreen) setIsFullscreen(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (isMinimized) setIsMinimized(false)
  }

  const resetForm = () => {
    setTo("")
    setCc("")
    setBcc("")
    setSubject("")
    setBody("")
    setAttachments([])
    setShowCc(false)
    setShowBcc(false)
  }

  const handleSend = async () => {
    if (!accessToken || !to.trim() || !subject.trim() || !body.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (To, Subject, and Message).",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      const success = await sendEmail(accessToken, to, subject, body)

      if (success) {
        toast({
          title: "Email sent",
          description: "Your email has been sent successfully.",
        })
        resetForm()
        onClose()
        if (onEmailSent) {
          onEmailSent()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to send email. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to send email:", error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    if (to || cc || bcc || subject || body || attachments.length > 0) {
      if (confirm("Discard this draft?")) {
        resetForm()
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`p-0 gap-0 ${
          isFullscreen
            ? "w-screen h-screen max-w-none rounded-none"
            : isMinimized
              ? "w-80 h-14 p-0 max-h-14 overflow-hidden"
              : "sm:max-w-[600px] max-h-[90vh]"
        }`}
      >
        {isMinimized ? (
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
            <span className="font-medium">New Message</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary/90"
                onClick={toggleMinimize}
              >
                <Maximize2 className="h-4 w-4" />
                <span className="sr-only">Restore</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary/90"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
              <DialogTitle>New Message</DialogTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMinimize}>
                  <Minimize2 className="h-4 w-4" />
                  <span className="sr-only">Minimize</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span className="sr-only">Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span className="sr-only">Fullscreen</span>
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </DialogHeader>

            <div className="overflow-auto flex-1">
              <div className="p-4 space-y-4">
                {/* Recipients */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="to" className="w-12">
                      To
                    </Label>
                    <Input
                      id="to"
                      placeholder="Recipients"
                      className="flex-1"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                    <div className="ml-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCc(!showCc)}
                        className={showCc ? "text-primary" : ""}
                      >
                        Cc
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBcc(!showBcc)}
                        className={showBcc ? "text-primary" : ""}
                      >
                        Bcc
                      </Button>
                    </div>
                  </div>

                  {showCc && (
                    <div className="flex items-center">
                      <Label htmlFor="cc" className="w-12">
                        Cc
                      </Label>
                      <Input
                        id="cc"
                        placeholder="Carbon copy recipients"
                        className="flex-1"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                      />
                    </div>
                  )}

                  {showBcc && (
                    <div className="flex items-center">
                      <Label htmlFor="bcc" className="w-12">
                        Bcc
                      </Label>
                      <Input
                        id="bcc"
                        placeholder="Blind carbon copy recipients"
                        className="flex-1"
                        value={bcc}
                        onChange={(e) => setBcc(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div className="flex items-center">
                  <Label htmlFor="subject" className="w-12">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Subject"
                    className="flex-1"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-b pb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bold className="h-4 w-4" />
                          <span className="sr-only">Bold</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Italic className="h-4 w-4" />
                          <span className="sr-only">Italic</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Underline className="h-4 w-4" />
                          <span className="sr-only">Underline</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Underline</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="h-6 w-px bg-border mx-1" />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <List className="h-4 w-4" />
                          <span className="sr-only">Bullet List</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ListOrdered className="h-4 w-4" />
                          <span className="sr-only">Numbered List</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="h-6 w-px bg-border mx-1" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AlignLeft className="h-4 w-4" />
                        <span className="sr-only">Text Alignment</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <AlignLeft className="h-4 w-4 mr-2" />
                        <span>Align Left</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlignCenter className="h-4 w-4 mr-2" />
                        <span>Align Center</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlignRight className="h-4 w-4 mr-2" />
                        <span>Align Right</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="h-6 w-px bg-border mx-1" />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <LinkIcon className="h-4 w-4" />
                          <span className="sr-only">Insert Link</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Link</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ImageIcon className="h-4 w-4" />
                          <span className="sr-only">Insert Image</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Image</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Email Body */}
                <Textarea
                  placeholder="Compose your email..."
                  className="min-h-[200px] resize-none"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />

                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Attachments</Label>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                            <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeAttachment(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="p-4 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Button onClick={handleSend} disabled={isSending || !to.trim() || !subject.trim() || !body.trim()}>
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
                  <Button variant="outline" size="icon" onClick={handleAttachmentClick}>
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach files</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  Discard
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
