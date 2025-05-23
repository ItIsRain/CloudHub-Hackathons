"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Megaphone,
  Bell,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  PenLine,
  Trash2,
  Plus,
  Filter,
  ChevronDown,
  Eye,
  Calendar as CalendarIcon,
  ArrowUpRight,
  Search,
  CalendarDays,
  Info,
  AlertTriangle,
  X,
  UserCircle2,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEditor, EditorContent } from "@tiptap/react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
} from "lucide-react"
import StarterKit from "@tiptap/starter-kit"
import { Link as TiptapLink } from "@tiptap/extension-link"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  targetAudience: string;
  author: string;
  createdAt: string;
  publishedAt?: string;
  scheduledFor?: string;
}

interface DialogState {
  type: "create" | "edit" | "view" | "delete" | null;
  announcement: Announcement | null;
}

interface CreateEditDialogProps {
  type: "create" | "edit";
  data: Announcement;
  onClose: () => void;
  onUpdateData: (data: Announcement) => void;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  isSubmitting: boolean;
  onSubmit: (data: Announcement) => void;
  getCategoryColor: (category: string) => string;
}

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

const calendarVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" }
};

interface EditorToolbarProps {
  editor: any;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;
  
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(editor.isActive("bold") && "bg-accent")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(editor.isActive("italic") && "bg-accent")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(editor.isActive("bulletList") && "bg-accent")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(editor.isActive("orderedList") && "bg-accent")}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
};

const CreateEditDialog = ({
  type,
  data,
  onClose,
  onUpdateData,
  selectedDate,
  onSelectDate,
  isSubmitting,
  onSubmit,
  getCategoryColor
}: CreateEditDialogProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({
        openOnClick: false
      })
    ],
    content: data?.content || "",
    onUpdate: ({ editor }) => {
      onUpdateData({ ...data, content: editor.getHTML() });
    }
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] flex-col p-0 gap-0 border-none shadow-2xl overflow-hidden sm:max-w-[800px]">
        <VisuallyHidden asChild>
          <DialogTitle>
            {type === "create" ? "Create New Announcement" : "Edit Announcement"}
          </DialogTitle>
        </VisuallyHidden>
        
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative h-full px-6 py-4 flex items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                    {type === "create" ? "New Announcement" : "Edit Announcement"}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                    TechInnovate 2024
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {type === "create" ? "Create New Announcement" : "Edit Announcement"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={data?.title || ""}
                  onChange={(e) => onUpdateData({ ...data, title: e.target.value })}
                  placeholder="Enter announcement title..."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="border rounded-md overflow-hidden">
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} className="prose max-w-none p-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={data?.category || ""}
                    onValueChange={(value) => onUpdateData({ ...data, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select
                    value={data?.targetAudience || ""}
                    onValueChange={(value) => onUpdateData({ ...data, targetAudience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Participants</SelectItem>
                      <SelectItem value="mentors">Mentors</SelectItem>
                      <SelectItem value="judges">Judges</SelectItem>
                      <SelectItem value="participants">Participants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="font-medium">Schedule for Later</Label>
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
                    <button
                      onClick={() => onSelectDate(undefined)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-colors",
                        !selectedDate ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      Publish Now
                    </button>
                    <button
                      onClick={() => onSelectDate(new Date())}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-colors",
                        selectedDate ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      Schedule
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      variants={calendarVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="overflow-hidden"
                    >
                      <div className="border rounded-lg p-4 space-y-4 bg-white">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4" />
                          <span>Select Publication Date</span>
                        </div>
                        
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date: Date | undefined) => onSelectDate(date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          fromDate={new Date()}
                          toDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
                          classNames={{
                            months: "space-y-4",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: cn(
                              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                            ),
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-slate-500 rounded-md w-8 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: cn(
                              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                              "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100"
                            ),
                            day: cn(
                              "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
                            ),
                            day_range_end: "day-range-end",
                            day_selected: "bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50",
                            day_today: "bg-slate-100 text-slate-900",
                            day_outside: "text-slate-500 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30",
                            day_disabled: "text-slate-500 opacity-50",
                            day_hidden: "invisible"
                          }}
                        />

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Info className="h-4 w-4" />
                          <span>Announcement will be automatically published on the selected date</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Preview</h3>
                <div className="space-y-2">
                  <h4 className="font-medium">{data?.title || "Untitled Announcement"}</h4>
                  <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: data?.content || "" }} />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {selectedDate && (
                      <>
                        <CalendarIcon className="h-4 w-4" />
                        <span>Scheduled for {format(selectedDate, "PPP")}</span>
                        <span className="text-muted-foreground">•</span>
                      </>
                    )}
                    <Users className="h-4 w-4" />
                    <span>{data?.targetAudience || "All Participants"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onUpdateData({ ...data, status: "draft" })}>
              Save as Draft
            </Button>
            <Button variant="outline" onClick={() => onUpdateData({ ...data, status: "preview" })}>
              Preview
            </Button>
            <Button 
              onClick={() => onSubmit({ ...data, status: "published" })}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {type === "create" ? "Publishing..." : "Updating..."}
                </>
              ) : (
                type === "create" ? "Publish Announcement" : "Update Announcement"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ViewDialog = ({ announcement, onClose }: { announcement: Announcement; onClose: () => void }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex flex-col p-0 gap-0 border-none shadow-2xl overflow-hidden sm:max-w-[800px] max-h-[90vh]">
        <VisuallyHidden asChild>
          <DialogTitle>View Announcement: {announcement.title}</DialogTitle>
        </VisuallyHidden>
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="flex flex-col h-full"
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="relative h-full px-6 py-4 flex items-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                      {announcement.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                      TechInnovate 2024
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {announcement.title}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Content */}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: announcement.content }} />

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {announcement.status === "published" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : announcement.status === "scheduled" ? (
                      <Clock className="h-5 w-5 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="font-medium capitalize">{announcement.status}</span>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Target Audience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-5 w-5 text-slate-500" />
                    <span className="font-medium">{announcement.targetAudience}</span>
                  </div>
                </div>

                {/* Schedule Info */}
                {announcement.scheduledFor && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>Scheduled For</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-indigo-500" />
                      <span className="font-medium">
                        {format(new Date(announcement.scheduledFor), "MMMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCircle2 className="h-4 w-4" />
                    <span>Author</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-5 w-5 text-slate-500" />
                    <span className="font-medium">{announcement.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialog = ({ 
  announcement, 
  onClose,
  onConfirm,
  isDeleting
}: { 
  announcement: Announcement;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex flex-col p-0 gap-0 border-none shadow-2xl overflow-hidden sm:max-w-[500px] max-h-[90vh]">
        <VisuallyHidden asChild>
          <DialogTitle>Delete Announcement: {announcement.title}</DialogTitle>
        </VisuallyHidden>
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="flex flex-col h-full"
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0">
            <div className="relative h-32 bg-gradient-to-r from-red-600 to-rose-600">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="relative h-full px-6 py-4 flex items-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                      Delete Announcement
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Confirm Deletion
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p>Are you sure you want to delete this announcement?</p>
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{announcement.title}</span>
                      <br />
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={onConfirm}
                disabled={isDeleting}
                className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Announcement"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const defaultFormData: Announcement = {
  id: "",
  title: "",
  content: "",
  category: "general",
  status: "draft",
  targetAudience: "all",
  author: "John Doe",
  createdAt: new Date().toISOString(),
};

// Reusable modern badge component
const ModernBadge = ({ 
  children, 
  variant = "default",
  className = "",
  icon: Icon
}: { 
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  icon?: React.ElementType;
}) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm";
  const variants = {
    default: "bg-slate-500/10 text-slate-700 border border-slate-200/50",
    success: "bg-emerald-500/10 text-emerald-700 border border-emerald-200/50",
    warning: "bg-amber-500/10 text-amber-700 border border-amber-200/50",
    danger: "bg-red-500/10 text-red-700 border border-red-200/50",
    info: "bg-blue-500/10 text-blue-700 border border-blue-200/50"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
};

// Engagement metric card component
const EngagementMetric = ({ 
  title, 
  value, 
  trend,
  icon: Icon,
  color
}: {
  title: string;
  value: string | number;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  icon: React.ElementType;
  color: string;
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 transition-shadow hover:shadow-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-white rounded-full transform translate-x-16 -translate-y-16" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-600">{title}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          {trend && (
            <span className={`text-sm font-medium ${
              trend.direction === "up" ? "text-emerald-600" : 
              trend.direction === "down" ? "text-red-600" : 
              "text-slate-600"
            }`}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AnnouncementsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>({ type: null, announcement: null });
  const [formData, setFormData] = useState<Announcement>(defaultFormData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Welcome to TechInnovate 2024!",
      content: "We're excited to kick off this year's hackathon. Get ready for an amazing journey of innovation and creativity...",
      category: "Important",
      status: "published",
      createdAt: "2024-03-15T09:00:00",
      publishedAt: "2024-03-15T09:00:00",
      targetAudience: "all",
      author: "John Doe"
    },
    {
      id: "2",
      title: "Project Submission Deadline Extended",
      content: "Due to numerous requests, we're extending the project submission deadline by 24 hours...",
      category: "Urgent",
      status: "published",
      createdAt: "2024-03-14T15:30:00",
      publishedAt: "2024-03-14T15:30:00",
      targetAudience: "all",
      author: "Jane Smith"
    },
    {
      id: "3",
      title: "Upcoming Workshop: AI Integration",
      content: "Join us for an exclusive workshop on integrating AI into your projects...",
      category: "General",
      status: "scheduled",
      createdAt: "2024-03-15T10:00:00",
      scheduledFor: "2024-03-20T14:00:00",
      targetAudience: "specific-teams",
      author: "Mike Johnson"
    }
  ]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedAnnouncement: Announcement = {
        ...formData,
        id: formData.id || crypto.randomUUID(),
        createdAt: formData.createdAt || new Date().toISOString(),
        scheduledFor: selectedDate ? selectedDate.toISOString() : undefined,
        status: selectedDate ? "scheduled" : "published",
        publishedAt: selectedDate ? undefined : new Date().toISOString()
      };

      setAnnouncements(prev => {
        if (dialogState.type === "edit") {
          return prev.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a);
        }
        return [...prev, updatedAnnouncement];
      });

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDialog = (type: DialogState["type"], announcement?: Announcement) => {
    setDialogState({ type, announcement: announcement || null });
    if (type === "create") {
      setFormData(defaultFormData);
      setSelectedDate(undefined);
    } else if (type === "edit" && announcement) {
      setFormData(announcement);
      setSelectedDate(announcement.scheduledFor ? new Date(announcement.scheduledFor) : undefined);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogState({ type: null, announcement: null });
    setFormData(defaultFormData);
    setSelectedDate(undefined);
    setIsDialogOpen(false);
  };

  const handleDelete = (announcement: Announcement) => {
    handleOpenDialog("delete", announcement);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-200";
      case "Important":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "General":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "scheduled":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "draft":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleEdit = (announcement: Announcement) => {
    handleOpenDialog("edit", announcement);
  };

  const handleView = (announcement: Announcement) => {
    handleOpenDialog("view", announcement);
  };

  const handleDeleteConfirm = async () => {
    if (!dialogState.announcement) return;
    
    setIsSubmitting(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update announcements state after successful deletion
      setAnnouncements(prev => prev.filter(a => a.id !== dialogState.announcement?.id));
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 px-6">
      {/* Modern Header Section with Stats */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg mt-6 mb-8">
        {/* Gradient background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative p-8 sm:p-10">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Megaphone className="h-4 w-4 text-purple-200" />
                <span className="font-medium tracking-wide">Announcements Dashboard</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">Manage Communications</h1>
              
              <p className="text-white/90 text-lg mb-6 max-w-lg font-light">
                Create and manage announcements to keep your hackathon participants informed and engaged.
              </p>
              
              <div className="space-x-2">
                <Button 
                  onClick={() => handleOpenDialog("create")}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/25 hover:bg-white/20 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Create Announcement
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">12</h3>
                  <p className="text-xs text-white/80 mt-1">Total Announcements</p>
                  <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">+</span>
                    </div>
                    3 this week
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">98%</h3>
                  <p className="text-xs text-white/80 mt-1">Read Rate</p>
                  <div className="text-xs text-purple-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-purple-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">↑</span>
                    </div>
                    High engagement
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">4</h3>
                  <p className="text-xs text-white/80 mt-1">Scheduled Posts</p>
                  <div className="text-xs text-blue-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">!</span>
                    </div>
                    Next in 2 days
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">2.5k</h3>
                  <p className="text-xs text-white/80 mt-1">Total Recipients</p>
                  <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">↑</span>
                    </div>
                    Active audience
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1">
        {/* Announcements List */}
        <Card className="border-slate-200 shadow-lg overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800 pl-2">Recent Announcements</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id}
                  className="group rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{announcement.title}</h3>
                        <Badge variant="outline" className={`${getCategoryColor(announcement.category)}`}>
                          {announcement.category}
                        </Badge>
                        <Badge variant="outline" className={`${getStatusColor(announcement.status)}`}>
                          {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-600 line-clamp-2">{announcement.content}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          <span>{announcement.targetAudience === "all" ? "All Participants" : "Specific Teams"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PenLine className="h-4 w-4" />
                          <span>{announcement.author}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-slate-600 hover:text-purple-600 hover:bg-purple-50"
                        onClick={() => handleView(announcement)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleEdit(announcement)}
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(announcement)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {dialogState.type === "create" || dialogState.type === "edit" ? (
          <CreateEditDialog 
            type={dialogState.type} 
            data={formData} 
            onClose={handleCloseDialog}
            onUpdateData={setFormData}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            getCategoryColor={getCategoryColor}
          />
        ) : dialogState.type === "view" && dialogState.announcement ? (
          <ViewDialog 
            announcement={dialogState.announcement}
            onClose={handleCloseDialog}
          />
        ) : dialogState.type === "delete" && dialogState.announcement ? (
          <DeleteDialog
            announcement={dialogState.announcement}
            onClose={handleCloseDialog}
            onConfirm={handleDeleteConfirm}
            isDeleting={isSubmitting}
          />
        ) : null}
      </Dialog>
    </div>
  )
} 