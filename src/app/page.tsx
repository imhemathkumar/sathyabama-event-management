"use client"

import { AuthRedirect } from "@/components/auth-redirect"
import { ParticlesAnimation } from "@/components/particles-animation"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Award, BookOpen, Building, Calendar, FileText, GraduationCap, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Refs for animations
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)

  // Scroll animations
  const { scrollYProgress } = useScroll()
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const heroOpacity = useTransform(smoothScrollY, [0, 0.2], [1, 0])
  const heroScale = useTransform(smoothScrollY, [0, 0.2], [1, 0.95])

  // Prefetch routes
  useEffect(() => {
    router.prefetch("/auth/login")
    router.prefetch("/dashboard/student")
    router.prefetch("/dashboard/faculty")
  }, [router])

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      <AuthRedirect redirectAuthenticated={true} />

      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        {/* Background gradients */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-blue-500/20 rounded-full blur-[150px] transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-500/20 rounded-full blur-[150px] transform translate-x-1/2 translate-y-1/2" />
          <div
            className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-[#800000]/20 rounded-full blur-[150px] transform -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * 0.01}px), calc(-50% + ${mousePosition.y * 0.01}px))`,
            }}
          />
        </div>

        {/* Particles animation */}
        <div className="fixed inset-0 z-0">
          <ParticlesAnimation />
        </div>

        {/* Noise texture overlay */}
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[url('/noise.png')] bg-repeat" />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl px-4 mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/10 backdrop-blur-md rounded-md p-1"
              >
                <Image
                  src="/logo2.jpg"
                  alt="Sathyabama Institute Logo"
                  width={40}
                  height={40}
                  priority
                  className="rounded-md"
                />
              </motion.div>
              <h1 className="text-xl font-bold text-white hidden sm:block">Sathyabama Institute Portal</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-white/70 hover:text-white transition-colors">
                About
              </a>
              <a href="#features" className="text-white/70 hover:text-white transition-colors">
                Features
              </a>
              <a href="#contact" className="text-white/70 hover:text-white transition-colors">
                Contact
              </a>
            </nav>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-[#800000] to-[#600000] hover:from-[#700000] hover:to-[#500000] text-white border  border-white/20">
                  Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center px-6"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="max-w-4xl mx-auto text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                Your Complete <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-[#ff9966]">
                  Academic Portal
                </span>{" "}
                for <br />
                Success
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-white/80 max-w-2xl mx-auto"
              >
                Manage events, certificates, and on-duty requests in one powerful platform designed for students and
                faculty.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Link href="#features">
                    <Button
                      variant="outline"
                      className="bg-gradient-to-r rounded-full from-[#800000] to-[#600000] hover:from-[#700000] hover:to-[#500000] text-white hover:text-white px-8 py-6 h-16 text-lg">
                      Explore Features
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#800000]/20 to-[#ff9966]/20 blur-xl"
              animate={{
                x: [0, -50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 18,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="py-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold mb-4"
              >
                Powerful Features for Students & Faculty
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/70 max-w-3xl mx-auto"
              >
                Our comprehensive platform streamlines academic processes and enhances campus life
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p className="text-white/70">
                  Create, manage, and register for campus events. Get real-time updates on attendance and event details.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Certificate Portal</h3>
                <p className="text-white/70">
                  Generate, issue, and download digital certificates. Maintain a secure record of all your achievements.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">On-Duty Management</h3>
                <p className="text-white/70">
                  Submit and track on-duty requests digitally. Faculty can approve or reject requests with ease.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">User-Specific Dashboards</h3>
                <p className="text-white/70">
                  Tailored interfaces for students and faculty with role-specific features and information.
                </p>
              </motion.div>

              {/* Feature 5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Academic Resources</h3>
                <p className="text-white/70">
                  Access course materials, schedules, and academic resources in one centralized location.
                </p>
              </motion.div>

              {/* Feature 6 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Student Progress Tracking</h3>
                <p className="text-white/70">
                  Monitor academic performance, attendance, and participation in extracurricular activities.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          ref={aboutRef}
          className="py-20 px-6 relative z-10 bg-gradient-to-b from-transparent to-black/30"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-6">About Sathyabama Institute</h2>
                <p className="text-white/70 text-lg mb-6">
                  Sathyabama Institute of Science and Technology is a premier educational institution committed to
                  excellence in teaching, research, and innovation. Established in 1987, we have grown to become one of
                  the leading universities in India.
                </p>
                <p className="text-white/70 text-lg mb-6">
                  Our mission is to provide quality education that transforms students into competent professionals with
                  strong ethical values and social responsibility. We offer a wide range of undergraduate, postgraduate,
                  and doctoral programs across various disciplines.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <h3 className="text-3xl font-bold text-[#ff9966] mb-2">30+</h3>
                    <p className="text-white/70">Years of Excellence</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }} 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 rounded-lg p-4">
                    <h3 className="text-3xl font-bold text-[#ff9966] mb-2">15,000+</h3>
                    <p className="text-white/70">Students</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }} 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10">
                    <h3 className="text-3xl font-bold text-[#ff9966] mb-2">50+</h3>
                    <p className="text-white/70">Programs Offered</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }} 
                    className="bg-white/5 backdrop-blur-sm border hover:bg-white/10 border-white/10 rounded-lg p-4">
                    <h3 className="text-3xl font-bold text-[#ff9966] mb-2">100+</h3>
                    <p className="text-white/70">Research Publications</p>
                </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src="/photo.jpg"
                    alt="Sathyabama Institute Campus"
                    width={800}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-br from-[#800000] to-[#ff9966] rounded-full blur-[100px] opacity-30 z-0"></div>
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-500/30 rounded-full blur-[100px] opacity-30 z-0"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="py-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold mb-4"
              >
                Get in Touch
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/70 max-w-3xl mx-auto"
              >
                Have questions about our portal? We&apos;re here to help.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Building className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-white/70">
                  Jeppiaar Nagar, Rajiv Gandhi Salai,
                  <br />
                  Chennai - 600 119,
                  <br />
                  Tamil Nadu, India
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white h-6 w-6"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-white/70">
                  Phone: +91-44-2450 3150
                  <br />
                  Fax: +91-44-2450 2344
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="bg-gradient-to-br from-[#800000] to-[#ff9966] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white h-6 w-6"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-white/70">
                  Email: info@sathyabama.ac.in
                  <br />
                  Support: support@sathyabama.ac.in
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0a0a0a] border-t border-white/10 py-12 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Logo and Description */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-md p-1">
                    <Image
                      src="/logo2.jpg"
                      alt="Sathyabama Institute Logo"
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </div>
                  <h2 className="text-xl font-bold">Sathyabama Institute Portal</h2>
                </div>
                <p className="text-white/70 mb-6">
                  Your comprehensive platform for academic management, events, certificates, and campus services.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                      Academics
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                      Research
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                      Campus Life
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <address className="not-italic text-white/70">
                  <p>Jeppiaar Nagar, Rajiv Gandhi Salai,</p>
                  <p>Chennai - 600 119, Tamil Nadu, India</p>
                  <p className="mt-4">Email: info@sathyabama.ac.in</p>
                  <p>Phone: +91-44-2450 3150</p>
                </address>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-center text-white/50">
                © 2025 Sathyabama Institute of Science and Technology. All rights reserved.
              </p>
              <div className="flex justify-center gap-6 mt-4">
                <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

