import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, Clock, FileText, Inbox, MessageSquare, Sparkles, ThumbsUp, Zap } from "lucide-react"

export default function AssistantFeatures() {
  return (
    <div className="p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Smart Reply Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Smart Replies
              </CardTitle>
              <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                New
              </Badge>
            </div>
            <CardDescription>AI-powered response suggestions</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=JS" alt="John Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-medium">John Smith</p>
                  <p className="text-muted-foreground">Can we schedule a meeting to discuss the project timeline?</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Suggested replies:</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="h-auto py-1.5">
                    <span>Sure, I'm available tomorrow afternoon.</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-1.5">
                    <span>Yes, what time works for you?</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-1.5">
                    <span>I'll send you my availability shortly.</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View more emails
            </Button>
          </CardFooter>
        </Card>

        {/* Email Analytics Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              Email Analytics
            </CardTitle>
            <CardDescription>Insights about your email activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>Received</span>
                    <span className="font-medium">24</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>Sent</span>
                    <span className="font-medium">18</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>Response Rate</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </TabsContent>
              <TabsContent value="weekly" className="space-y-4">
                {/* Weekly content would go here */}
                <div className="text-center text-sm text-muted-foreground py-4">Weekly analytics data</div>
              </TabsContent>
              <TabsContent value="monthly" className="space-y-4">
                {/* Monthly content would go here */}
                <div className="text-center text-sm text-muted-foreground py-4">Monthly analytics data</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Email Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Email Summary
            </CardTitle>
            <CardDescription>AI-generated summaries of long emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Quarterly Report Review</p>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Summarized
                </Badge>
              </div>
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">Summary:</span> The quarterly report shows a 15% increase in revenue,
                  with marketing campaigns exceeding targets. Three action items require your attention by Friday.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Partnership Opportunity</p>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Summarized
                </Badge>
              </div>
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">Summary:</span> Sarah proposes a partnership for co-marketing
                  activities. She suggests a meeting next week to discuss potential collaboration opportunities.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View all summaries
            </Button>
          </CardFooter>
        </Card>

        {/* Priority Inbox Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Priority Inbox
            </CardTitle>
            <CardDescription>Important emails that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=JS" alt="John Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">John Smith</p>
                  <p className="text-xs text-muted-foreground truncate">Quarterly Report Review</p>
                </div>
                <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Urgent</Badge>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=HR" alt="HR Department" />
                  <AvatarFallback>HR</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">HR Department</p>
                  <p className="text-xs text-muted-foreground truncate">Important: Benefits Enrollment</p>
                </div>
                <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100">Important</Badge>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=CT" alt="Conference Team" />
                  <AvatarFallback>CT</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Conference Team</p>
                  <p className="text-xs text-muted-foreground truncate">Speaker Confirmation: Industry Summit 2023</p>
                </div>
                <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100">Important</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View all priority emails
            </Button>
          </CardFooter>
        </Card>

        {/* Follow-up Reminders Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Follow-up Reminders
            </CardTitle>
            <CardDescription>Emails that need your response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=SJ" alt="Sarah Johnson" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground truncate">Partnership Opportunity</p>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  2 days ago
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=AW" alt="Alex Wong" />
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Alex Wong</p>
                  <p className="text-xs text-muted-foreground truncate">Project Timeline Update</p>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  3 days ago
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=MT" alt="Marketing Team" />
                  <AvatarFallback>MT</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Marketing Team</p>
                  <p className="text-xs text-muted-foreground truncate">Campaign Strategy for Q3</p>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  4 days ago
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View all follow-ups
            </Button>
          </CardFooter>
        </Card>

        {/* Email Assistant Tips Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Assistant Tips
            </CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <ThumbsUp className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Optimize your inbox</p>
                  <p className="text-xs text-muted-foreground">
                    Create filters to automatically categorize incoming emails and reduce clutter.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Inbox className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Achieve Inbox Zero</p>
                  <p className="text-xs text-muted-foreground">
                    You have 24 unread emails. Set aside 15 minutes to process them.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Schedule email time</p>
                  <p className="text-xs text-muted-foreground">
                    Designate specific times to check email instead of constantly monitoring it.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View more tips
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
