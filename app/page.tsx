"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Archive,
  BarChart2,
  Clock,
  Inbox,
  Mail,
  MailPlus,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmailList from "@/components/email-list"
import AssistantFeatures from "@/components/assistant-features"
import { ThemeToggle } from "@/components/theme-toggle"

// Import the ComposeEmailModal component at the top of the file
import { useState } from "react"
import ComposeEmailModal from "@/components/compose-email-modal"

// Update the Home component to include state for the compose modal
export default function Home() {
  const [composeModalOpen, setComposeModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-semibold">Gmail Assistant</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search emails..." className="w-full pl-8 bg-muted" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 p-4 border-r shrink-0">
          {/* Update the Compose button in the sidebar to open the modal */}
          {/* Find the Button with "Compose" text and replace it with: */}
          <Button className="flex items-center justify-start gap-2 mb-6" onClick={() => setComposeModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Compose</span>
          </Button>

          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="#">
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
                <Badge className="ml-auto">24</Badge>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="#">
                <Star className="w-4 h-4" />
                <span>Starred</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="#">
                <Clock className="w-4 h-4" />
                <span>Snoozed</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="#">
                <MailPlus className="w-4 h-4" />
                <span>Important</span>
                <Badge className="ml-auto">7</Badge>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="#">
                <Archive className="w-4 h-4" />
                <span>Archived</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="#">
                <Trash2 className="w-4 h-4" />
                <span>Trash</span>
              </Link>
            </Button>
          </nav>

          <div className="mt-6 pt-6 border-t">
            <h2 className="mb-2 text-sm font-semibold">Assistant Features</h2>
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link href="#">
                  <MessageSquare className="w-4 h-4" />
                  <span>Smart Replies</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link href="#">
                  <BarChart2 className="w-4 h-4" />
                  <span>Email Analytics</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link href="#">
                  <User className="w-4 h-4" />
                  <span>Contact Insights</span>
                </Link>
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="md:hidden p-2">
            <div className="relative w-full mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search emails..." className="w-full pl-8 bg-muted" />
            </div>
          </div>

          <Tabs defaultValue="inbox" className="w-full">
            <div className="px-4 border-b">
              <TabsList className="h-12">
                <TabsTrigger value="inbox" className="data-[state=active]:bg-background">
                  Inbox
                </TabsTrigger>
                <TabsTrigger value="assistant" className="data-[state=active]:bg-background">
                  Assistant
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="inbox" className="m-0">
              <EmailList />
            </TabsContent>

            <TabsContent value="assistant" className="m-0">
              <AssistantFeatures />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* Add the ComposeEmailModal component at the end of the component, just before the closing </div> */}
      {/* Add this right before the final closing </div> tag: */}
      <ComposeEmailModal isOpen={composeModalOpen} onClose={() => setComposeModalOpen(false)} />
    </div>
  )
}
