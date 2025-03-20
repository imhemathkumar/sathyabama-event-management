"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  regNo: z.string().min(1, "Registration number is required"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["student", "faculty"], {
    required_error: "Please select a user type",
  }),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regNo: "",
      password: "",
      userType: "student",
    },
  })

  // Prefetch dashboard routes on page load
  useEffect(() => {
    router.prefetch("/dashboard/student")
    router.prefetch("/dashboard/faculty")
  }, [router])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Prefetch the dashboard routes while authentication is happening
      if (values.userType === "student") {
        router.prefetch(`/dashboard/student?id=${values.regNo}`)
      } else {
        router.prefetch(`/dashboard/faculty?id=${values.regNo}`)
      }

      // Simulate API call - in a real app, this would be your auth API
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Show success message
      toast({
        title: "Login successful",
        description: "Welcome back to the portal!",
      })

      // Store user info in localStorage for persistence
      localStorage.setItem("userId", values.regNo)
      localStorage.setItem("userType", values.userType)

      // Redirect based on user type with the ID parameter
      if (values.userType === "student") {
        router.push(`/dashboard/student?id=${values.regNo}`)
      } else {
        router.push(`/dashboard/faculty?id=${values.regNo}`)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[450px] bg-white/80 border border-gray-200 rounded-lg shadow-xl p-6"
    >
      <div className="flex justify-center mb-6">
        <div className="rounded-lg p-4 w-full">
          <Image
            src="/logo.jpg"
            alt="College Logo"
            width={600}
            height={200}
            className="w-full h-20 object-contain"
            priority
          />
        </div>
      </div>

      <p className="text-center text-gray-700 mb-8">
        {form.watch("userType") === "student"
          ? "Enter your RegNo and Password to access your panel."
          : "Enter your Email and Password to access your panel."}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  {form.watch("userType") === "student" ? "Register Number" : "Email"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      form.watch("userType") === "student" ? "Enter your register number" : "Enter your email address"
                    }
                    {...field}
                    className="bg-white pr-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-grey-700">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "LOG IN"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:text-sky-500">
          Forgot your password?
        </Link>
      </div>
    </motion.div>
  )
}

