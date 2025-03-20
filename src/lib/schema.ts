import { z } from "zod"

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "That's not a date!",
  }),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  organizer: z.string().min(1, "Organizer is required"),
  capacity: z.number().min(1, "Capacity is required"),
  image: z.string().min(1, "Image is required"),
})

export type FormData = z.infer<typeof formSchema>