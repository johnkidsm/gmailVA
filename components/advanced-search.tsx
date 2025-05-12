"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Plus, Search, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { EmailCategory } from "./email-categories"

// Define the filter types
export type FilterOperator = "contains" | "equals" | "not_contains" | "starts_with" | "ends_with"
type FilterField =
  | "from"
  | "to"
  | "subject"
  | "body"
  | "has_attachment"
  | "category"
  | "date"
  | "is_starred"
  | "is_unread"

export interface FilterCriteria {
  id: string
  field: FilterField
  operator?: FilterOperator
  value: string | boolean | Date | null | EmailCategory
}

interface SavedSearch {
  id: string
  name: string
  filters: FilterCriteria[]
}

// Sample saved searches
const sampleSavedSearches: SavedSearch[] = [
  {
    id: "1",
    name: "Important Work Emails",
    filters: [
      { id: "f1", field: "from", operator: "contains", value: "@company.com" },
      { id: "f2", field: "is_unread", value: true },
    ],
  },
  {
    id: "2",
    name: "Unread Promotions",
    filters: [
      { id: "f1", field: "category", value: "promotions" as EmailCategory },
      { id: "f2", field: "is_unread", value: true },
    ],
  },
  {
    id: "3",
    name: "Attachments Last Month",
    filters: [
      { id: "f1", field: "has_attachment", value: true },
      { id: "f2", field: "date", value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    ],
  },
]

interface AdvancedSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (filters: FilterCriteria[]) => void
}

export default function AdvancedSearch({ isOpen, onClose, onSearch }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<FilterCriteria[]>([
    { id: "1", field: "from", operator: "contains", value: "" },
  ])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(sampleSavedSearches)
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false)
  const [newSearchName, setNewSearchName] = useState("")

  const addFilter = () => {
    const newId = String(Date.now())
    setFilters([...filters, { id: newId, field: "subject", operator: "contains", value: "" }])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id))
  }

  const updateFilter = (id: string, updates: Partial<FilterCriteria>) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id === id) {
          // If changing the field type, reset the value appropriately
          let value = updates.value !== undefined ? updates.value : filter.value
          if (updates.field) {
            switch (updates.field) {
              case "has_attachment":
              case "is_starred":
              case "is_unread":
                value = false
                break
              case "date":
                value = null
                break
              case "category":
                value = "primary" as EmailCategory
                break
              default:
                if (typeof value !== "string") value = ""
            }
          }
          return { ...filter, ...updates, value }
        }
        return filter
      }),
    )
  }

  const handleSearch = () => {
    onSearch(filters)
    onClose()
  }

  const saveSearch = () => {
    if (!newSearchName.trim()) return

    const newSavedSearch: SavedSearch = {
      id: String(Date.now()),
      name: newSearchName,
      filters: [...filters],
    }

    setSavedSearches([...savedSearches, newSavedSearch])
    setNewSearchName("")
    setSaveSearchDialogOpen(false)
  }

  const loadSavedSearch = (search: SavedSearch) => {
    setFilters([...search.filters])
  }

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(savedSearches.filter((search) => search.id !== id))
  }

  const renderFilterInput = (filter: FilterCriteria) => {
    switch (filter.field) {
      case "from":
      case "to":
      case "subject":
      case "body":
        return (
          <div className="flex items-center gap-2 flex-1">
            <Select
              value={filter.operator}
              onValueChange={(value) => updateFilter(filter.id, { operator: value as FilterOperator })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">contains</SelectItem>
                <SelectItem value="equals">equals</SelectItem>
                <SelectItem value="not_contains">doesn't contain</SelectItem>
                <SelectItem value="starts_with">starts with</SelectItem>
                <SelectItem value="ends_with">ends with</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={filter.value as string}
              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
              placeholder={`Enter ${filter.field} text...`}
              className="flex-1"
            />
          </div>
        )

      case "has_attachment":
      case "is_starred":
      case "is_unread":
        return (
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`checkbox-${filter.id}`}
                checked={filter.value as boolean}
                onCheckedChange={(checked) => updateFilter(filter.id, { value: !!checked })}
              />
              <Label htmlFor={`checkbox-${filter.id}`} className="text-sm font-normal">
                {filter.field === "has_attachment"
                  ? "Has attachments"
                  : filter.field === "is_starred"
                    ? "Is starred"
                    : "Is unread"}
              </Label>
            </div>
          </div>
        )

      case "category":
        return (
          <div className="flex items-center gap-2 flex-1">
            <Select
              value={filter.value as string}
              onValueChange={(value) => updateFilter(filter.id, { value: value as EmailCategory })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="promotions">Promotions</SelectItem>
                <SelectItem value="updates">Updates</SelectItem>
                <SelectItem value="forums">Forums</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "date":
        return (
          <div className="flex items-center gap-2 flex-1">
            <Select
              value={filter.operator}
              onValueChange={(value) => updateFilter(filter.id, { operator: value as FilterOperator })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">on</SelectItem>
                <SelectItem value="contains">after</SelectItem>
                <SelectItem value="not_contains">before</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("flex-1 justify-start text-left font-normal", !filter.value && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filter.value ? format(filter.value as Date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filter.value as Date | undefined}
                  onSelect={(date) => updateFilter(filter.id, { value: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Search Filters</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSaveSearchDialogOpen(true)}>
                Save Search
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-2">
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(filter.id, { field: value as FilterField })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from">From</SelectItem>
                    <SelectItem value="to">To</SelectItem>
                    <SelectItem value="subject">Subject</SelectItem>
                    <SelectItem value="body">Body</SelectItem>
                    <SelectItem value="has_attachment">Has Attachment</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="is_starred">Is Starred</SelectItem>
                    <SelectItem value="is_unread">Is Unread</SelectItem>
                  </SelectContent>
                </Select>

                {renderFilterInput(filter)}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFilter(filter.id)}
                  disabled={filters.length === 1}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addFilter} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Saved Searches</h3>
            <ScrollArea className="h-[180px]">
              <div className="space-y-2 pr-4">
                {savedSearches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No saved searches</p>
                ) : (
                  savedSearches.map((search) => (
                    <div key={search.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                      <Button
                        variant="ghost"
                        className="flex-1 justify-start font-normal h-auto py-1"
                        onClick={() => loadSavedSearch(search)}
                      >
                        <span>{search.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {search.filters.length} {search.filters.length === 1 ? "filter" : "filters"}
                        </Badge>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteSavedSearch(search.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete saved search</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Save Search Dialog */}
      <Dialog open={saveSearchDialogOpen} onOpenChange={setSaveSearchDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="search-name">Search Name</Label>
            <Input
              id="search-name"
              value={newSearchName}
              onChange={(e) => setNewSearchName(e.target.value)}
              placeholder="Enter a name for this search"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveSearchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSearch} disabled={!newSearchName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
