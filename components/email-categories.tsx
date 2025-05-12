"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import EmailList from "./email-list"

// Define the category types
export type EmailCategory = "primary" | "social" | "promotions" | "updates" | "forums"

// Sample category counts
const categoryCounts = {
  primary: 12,
  social: 5,
  promotions: 18,
  updates: 7,
  forums: 2,
}

// Sample category descriptions
const categoryDescriptions = {
  primary: "Important emails from people",
  social: "Messages from social networks and media sharing sites",
  promotions: "Deals, offers, and other marketing emails",
  updates: "Confirmations, receipts, bills, and statements",
  forums: "Messages from online groups, discussions, and mailing lists",
}

// Sample category colors
const categoryColors = {
  primary: "bg-blue-500",
  social: "bg-green-500",
  promotions: "bg-yellow-500",
  updates: "bg-purple-500",
  forums: "bg-red-500",
}

interface EmailCategoriesProps {
  defaultCategory?: EmailCategory
  onCategoryChange?: (category: EmailCategory) => void
}

export default function EmailCategories({ defaultCategory = "primary", onCategoryChange }: EmailCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<EmailCategory>(defaultCategory)

  const handleCategoryChange = (category: EmailCategory) => {
    setActiveCategory(category)
    if (onCategoryChange) {
      onCategoryChange(category)
    }
  }

  return (
    <div className="w-full">
      <Tabs
        defaultValue={defaultCategory}
        onValueChange={(value) => handleCategoryChange(value as EmailCategory)}
        className="w-full"
      >
        <div className="flex items-center justify-between px-4 border-b">
          <TabsList className="h-12">
            <TabsTrigger value="primary" className="relative data-[state=active]:bg-background">
              Primary
              {categoryCounts.primary > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.primary}
                </Badge>
              )}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  activeCategory === "primary" ? categoryColors.primary : "hidden"
                }`}
              />
            </TabsTrigger>
            <TabsTrigger value="social" className="relative data-[state=active]:bg-background">
              Social
              {categoryCounts.social > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.social}
                </Badge>
              )}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  activeCategory === "social" ? categoryColors.social : "hidden"
                }`}
              />
            </TabsTrigger>
            <TabsTrigger value="promotions" className="relative data-[state=active]:bg-background">
              Promotions
              {categoryCounts.promotions > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.promotions}
                </Badge>
              )}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  activeCategory === "promotions" ? categoryColors.promotions : "hidden"
                }`}
              />
            </TabsTrigger>
            <TabsTrigger value="updates" className="relative data-[state=active]:bg-background">
              Updates
              {categoryCounts.updates > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.updates}
                </Badge>
              )}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  activeCategory === "updates" ? categoryColors.updates : "hidden"
                }`}
              />
            </TabsTrigger>
            <TabsTrigger value="forums" className="relative data-[state=active]:bg-background">
              Forums
              {categoryCounts.forums > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.forums}
                </Badge>
              )}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  activeCategory === "forums" ? categoryColors.forums : "hidden"
                }`}
              />
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" className="mr-2">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Category Settings</span>
          </Button>
        </div>

        <div className="bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
          {categoryDescriptions[activeCategory]}
        </div>

        <TabsContent value="primary" className="m-0">
          <EmailList category="primary" />
        </TabsContent>
        <TabsContent value="social" className="m-0">
          <EmailList category="social" />
        </TabsContent>
        <TabsContent value="promotions" className="m-0">
          <EmailList category="promotions" />
        </TabsContent>
        <TabsContent value="updates" className="m-0">
          <EmailList category="updates" />
        </TabsContent>
        <TabsContent value="forums" className="m-0">
          <EmailList category="forums" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
