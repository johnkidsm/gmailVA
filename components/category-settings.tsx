"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, Trash2 } from "lucide-react"

interface CategorySettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategorySettings({ isOpen, onClose }: CategorySettingsProps) {
  const [activeTab, setActiveTab] = useState("categories")
  const [categories, setCategories] = useState([
    { id: "primary", name: "Primary", enabled: true, color: "#3b82f6", default: true },
    { id: "social", name: "Social", enabled: true, color: "#22c55e" },
    { id: "promotions", name: "Promotions", enabled: true, color: "#eab308" },
    { id: "updates", name: "Updates", enabled: true, color: "#a855f7" },
    { id: "forums", name: "Forums", enabled: true, color: "#ef4444" },
  ])

  const [rules, setRules] = useState([
    { id: 1, category: "social", condition: "from", value: "@twitter.com", enabled: true },
    { id: 2, category: "social", condition: "from", value: "@facebook.com", enabled: true },
    { id: 3, category: "promotions", condition: "subject", value: "discount", enabled: true },
    { id: 4, category: "promotions", condition: "from", value: "@marketing.com", enabled: true },
    { id: 5, category: "updates", condition: "from", value: "@amazon.com", enabled: true },
  ])

  const toggleCategory = (id: string) => {
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, enabled: !cat.enabled } : cat)))
  }

  const toggleRule = (id: number) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const setDefaultCategory = (id: string) => {
    setCategories(categories.map((cat) => ({ ...cat, default: cat.id === id })))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Email Category Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="rules">Categorization Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Enable or disable email categories and customize their appearance.
              </div>

              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <Label htmlFor={`category-${category.id}`} className="flex-1">
                      {category.name}
                      {category.default && (
                        <Badge variant="outline" className="ml-2">
                          Default
                        </Badge>
                      )}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!category.default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDefaultCategory(category.id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Set as default</span>
                      </Button>
                    )}
                    <Switch
                      id={`category-${category.id}`}
                      checked={category.enabled}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                  </div>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Category
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4 pt-4">
            <div className="text-sm text-muted-foreground">
              Define rules to automatically categorize incoming emails.
            </div>

            {rules.map((rule) => (
              <div key={rule.id} className="space-y-2 p-3 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: categories.find((c) => c.id === rule.category)?.color || "#888",
                      }}
                    ></div>
                    <span className="font-medium capitalize">{rule.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete rule</span>
                    </Button>
                    <Switch id={`rule-${rule.id}`} checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground mr-2">If</span>
                  <span className="font-medium mr-2">{rule.condition}</span>
                  <span className="text-muted-foreground mr-2">contains</span>
                  <Badge variant="outline">{rule.value}</Badge>
                </div>
              </div>
            ))}

            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Rule
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
