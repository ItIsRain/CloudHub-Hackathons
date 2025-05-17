"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Task {
  id: number
  title: string
  completed: boolean
  priority: "high" | "medium" | "low"
  dueDate: string
  hackathon: string
}

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete project submission for AI Innovation Challenge",
      completed: false,
      priority: "high",
      dueDate: "2025-05-20",
      hackathon: "AI Innovation Challenge",
    },
    {
      id: 2,
      title: "Review team member code contributions",
      completed: false,
      priority: "medium",
      dueDate: "2025-05-18",
      hackathon: "AI Innovation Challenge",
    },
    {
      id: 3,
      title: "Prepare presentation slides for demo day",
      completed: false,
      priority: "medium",
      dueDate: "2025-05-25",
      hackathon: "AI Innovation Challenge",
    },
    {
      id: 4,
      title: "Schedule mentor session for technical review",
      completed: true,
      priority: "low",
      dueDate: "2025-05-15",
      hackathon: "AI Innovation Challenge",
    },
    {
      id: 5,
      title: "Register team for Web3 Hackathon",
      completed: true,
      priority: "high",
      dueDate: "2025-05-10",
      hackathon: "Web3 Hackathon",
    },
  ])

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const priorityColors = {
    high: "bg-rose-100 text-rose-700 hover:bg-rose-100 hover:text-rose-800",
    medium: "bg-amber-100 text-amber-700 hover:bg-amber-100 hover:text-amber-800",
    low: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800",
  }

  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage your hackathon tasks and deadlines</CardDescription>
        </div>
        <Button size="sm" className="gap-1 bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-2">Active Tasks ({activeTasks.length})</h3>
            <div className="space-y-2">
              {activeTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} priorityColors={priorityColors} />
              ))}
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Completed ({completedTasks.length})</h3>
              <div className="space-y-2 opacity-70">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} priorityColors={priorityColors} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  priorityColors: Record<string, string>
}

function TaskItem({ task, onToggle, priorityColors }: TaskItemProps) {
  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-violet-200 transition-colors">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-1 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={`task-${task.id}`}
          className={`text-sm font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-900"}`}
        >
          {task.title}
        </label>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <Badge className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <span className="text-xs text-slate-500">Due {formattedDate}</span>
          <span className="text-xs text-violet-600">{task.hackathon}</span>
        </div>
      </div>
    </div>
  )
}
