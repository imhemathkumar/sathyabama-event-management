"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Update the form schema to handle both single date and date range
const formSchema = z
  .object({
    studentName: z.string().min(2, "Student name must be at least 2 characters"),
    studentId: z.string().min(3, "Student ID must be at least 3 characters"),
    reason: z.string().min(3, "Reason must be at least 3 characters"),
    event: z.string().min(3, "Event name must be at least 3 characters"),
    dateMode: z.enum(["single", "range"]),
    singleDate: z.date().optional(),
    dateRange: z
      .object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
      .optional(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
  })
  // Add conditional validation based on dateMode
  .refine(
    (data) => {
      if (data.dateMode === "single") {
        return !!data.singleDate
      } else {
        return !!data.dateRange?.from && !!data.dateRange?.to
      }
    },
    {
      message: "Please select the required date(s)",
      path: ["dateMode"],
    },
  )
  .refine(
    (data) => {
      if (data.dateMode === "range" && data.dateRange?.from && data.dateRange?.to) {
        return data.dateRange.from <= data.dateRange.to
      }
      return true
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["dateRange"],
    },
  )
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true

      // Convert times to 24-hour format for comparison
      const convertTo24Hour = (time: string) => {
        const [timeStr, period] = time.split(" ")
        let [hours, minutes] = timeStr.split(":").map(Number)
        if (period === "PM" && hours !== 12) hours += 12
        if (period === "AM" && hours === 12) hours = 0
        return hours * 60 + minutes
      }

      const startMinutes = convertTo24Hour(data.startTime)
      const endMinutes = convertTo24Hour(data.endTime)

      // If single date or same dates in range, check times
      if (
        data.dateMode === "single" ||
        (data.dateMode === "range" &&
          data.dateRange?.from &&
          data.dateRange?.to &&
          data.dateRange.from.toDateString() === data.dateRange.to.toDateString())
      ) {
        return endMinutes > startMinutes
      }

      // If dates are different, any time is valid
      return true
    },
    {
      message: "End time must be after start time on the same day",
      path: ["endTime"],
    },
  )

interface NewODRequestProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: z.infer<typeof formSchema>) => void
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const period = hour >= 12 ? "PM" : "AM"
      const displayHour = hour % 12 === 0 ? 12 : hour % 12
      const displayMinute = minute === 0 ? "00" : minute
      options.push(`${displayHour}:${displayMinute} ${period}`)
    }
  }
  return options
}

const timeOptions = generateTimeOptions()

// Update the component to include dateMode selection and conditional date pickers
export function NewODRequest({ isOpen, onClose, onSubmit }: Readonly<NewODRequestProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      studentId: "",
      reason: "",
      event: "",
      dateMode: "single",
      singleDate: new Date(),
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      startTime: "9:00 AM",
      endTime: "5:00 PM",
      description: "",
    },
  })

  // Watch the dateMode to conditionally render the appropriate date picker
  const dateMode = form.watch("dateMode")

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Format date based on the selected mode
      let formattedDate
      if (data.dateMode === "single" && data.singleDate) {
        formattedDate = format(data.singleDate, "yyyy-MM-dd")
      } else if (data.dateMode === "range" && data.dateRange?.from && data.dateRange?.to) {
        formattedDate = `${format(data.dateRange.from, "yyyy-MM-dd")} to ${format(data.dateRange.to, "yyyy-MM-dd")}`
      }

      // Format the time range
      const timeRange = `${data.startTime} to ${data.endTime}`

      // Add the formatted data
      const submissionData = {
        ...data,
        date: formattedDate,
        time: timeRange,
      }

      await onSubmit(submissionData)
      form.reset()
      onClose()
    } catch (error) {
      console.error("Error submitting request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New On-Duty Request</DialogTitle>
          <DialogDescription>Submit a new on-duty request for approval</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reason for on-duty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event/Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event or activity name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Mode Selection */}
            <FormField
              control={form.control}
              name="dateMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Date Selection</FormLabel>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="single-date"
                        value="single"
                        checked={field.value === "single"}
                        onChange={() => field.onChange("single")}
                        className="h-4 w-4 text-primary"
                      />
                      <label htmlFor="single-date" className="text-sm font-medium">
                        Single Day
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="date-range"
                        value="range"
                        checked={field.value === "range"}
                        onChange={() => field.onChange("range")}
                        className="h-4 w-4 text-primary"
                      />
                      <label htmlFor="date-range" className="text-sm font-medium">
                        Date Range
                      </label>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Single Date Picker */}
            {dateMode === "single" && (
              <FormField
                control={form.control}
                name="singleDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Date Range Picker */}
            {dateMode === "range" && (
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value as { from: Date; to: Date } | undefined}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select start time">
                            {field.value ? (
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {field.value}
                              </div>
                            ) : (
                              "Select start time"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select end time">
                            {field.value ? (
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {field.value}
                              </div>
                            ) : (
                              "Select end time"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide additional details about your request"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

