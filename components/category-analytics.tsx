"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Sample data for category distribution
const categoryData = [
  { name: "Primary", value: 42, color: "#3b82f6" },
  { name: "Social", value: 18, color: "#22c55e" },
  { name: "Promotions", value: 25, color: "#eab308" },
  { name: "Updates", value: 12, color: "#a855f7" },
  { name: "Forums", value: 3, color: "#ef4444" },
]

// Sample data for category growth
const weeklyGrowth = [
  { category: "Primary", growth: 5 },
  { category: "Social", growth: 12 },
  { category: "Promotions", growth: 8 },
  { category: "Updates", growth: -3 },
  { category: "Forums", growth: 1 },
]

// Sample data for read rates
const readRates = [
  { category: "Primary", rate: 85 },
  { category: "Social", rate: 62 },
  { category: "Promotions", rate: 45 },
  { category: "Updates", rate: 78 },
  { category: "Forums", rate: 90 },
]

export default function CategoryAnalytics() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold tracking-tight">Email Category Analytics</h2>
      <p className="text-muted-foreground">
        Insights about your email distribution and engagement across different categories.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>How your emails are distributed across categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Weekly Growth</CardTitle>
            <CardDescription>Change in email volume by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {weeklyGrowth.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span
                      className={`text-sm font-medium ${
                        item.growth > 0 ? "text-green-600" : item.growth < 0 ? "text-red-600" : ""
                      }`}
                    >
                      {item.growth > 0 ? "+" : ""}
                      {item.growth}%
                    </span>
                  </div>
                  <Progress
                    value={50 + item.growth * 2}
                    className={`h-2 ${item.growth > 0 ? "bg-green-100" : item.growth < 0 ? "bg-red-100" : ""}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Read Rates</CardTitle>
            <CardDescription>Percentage of emails read by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="chart">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={readRates.map((item) => ({
                        name: item.category,
                        value: item.rate,
                        color: categoryData.find((c) => c.name === item.category)?.color || "#888",
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {readRates.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={categoryData.find((c) => c.name === entry.category)?.color || "#888"}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-4">
                  {readRates.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-medium">{item.rate}%</span>
                      </div>
                      <Progress value={item.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
