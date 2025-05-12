"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ComposeEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ComposeEmailModal({ isOpen, onClose }: ComposeEmailModalProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSend = () => {
    // Here you would handle sending the email
    console.log("Sending email...")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                onClick={onClose}
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
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
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
                    <Input id="to" placeholder="Recipients" className="flex-1" />
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
                      <Input id="cc" placeholder="Carbon copy recipients" className="flex-1" />
                    </div>
                  )}

                  {showBcc && (
                    <div className="flex items-center">
                      <Label htmlFor="bcc" className="w-12">
                        Bcc
                      </Label>
                      <Input id="bcc" placeholder="Blind carbon copy recipients" className="flex-1" />
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div className="flex items-center">
                  <Label htmlFor="subject" className="w-12">
                    Subject
                  </Label>
                  <Input id="subject" placeholder="Subject" className="flex-1" />
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
                <Textarea placeholder="Compose your email..." className="min-h-[200px] resize-none" />

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
                  <Button onClick={handleSend}>Send</Button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
                  <Button variant="outline" size="icon" onClick={handleAttachmentClick}>
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach files</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
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
