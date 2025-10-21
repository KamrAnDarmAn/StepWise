"use client"
import React from 'react'
import { motion } from 'motion/react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, Target, Heart, Code, BookOpen, Zap, Globe } from 'lucide-react'
import Link from 'next/link'

const About = () => {
    const stats = [
        { icon: <Code className="h-6 w-6" />, label: "Algorithms", value: "3+" },
        { icon: <Users className="h-6 w-6" />, label: "Contributors", value: "Growing" },
        { icon: <BookOpen className="h-6 w-6" />, label: "Students Helped", value: "10+" },
        { icon: <Zap className="h-6 w-6" />, label: "Visualizations", value: "Interactive" },
    ]

    const features = [
        {
            icon: <Clock className="h-8 w-8 text-blue-500" />,
            title: "Time-Saving Learning",
            description: "Reduce study time by 70% with interactive visualizations that make complex algorithms easy to understand."
        },
        {
            icon: <Target className="h-8 w-8 text-green-500" />,
            title: "Step-by-Step Execution",
            description: "Watch algorithms work in real-time with detailed step-by-step breakdowns and explanations."
        },
        {
            icon: <Heart className="h-8 w-8 text-red-500" />,
            title: "Community Driven",
            description: "Built by students, for students. A collaborative effort to make DSA learning accessible to everyone."
        },
        {
            icon: <Globe className="h-8 w-8 text-purple-500" />,
            title: "Open Source",
            description: "Free, open-source platform that welcomes contributions from developers worldwide."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 py-16"
            >
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
                    >
                        About StepWise
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        Born from the struggle of learning Data Structures & Algorithms, this project aims to
                        <span className="font-semibold text-blue-600 dark:text-blue-400"> save the most precious currency - time </span>
                        for future students.
                    </motion.p>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        >
                            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-neutral-200 dark:border-neutral-800">
                                <CardContent className="p-0">
                                    <div className="flex justify-center mb-3 text-blue-500">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {stat.label}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="mb-16"
                >
                    <Card className="border-neutral-200 dark:border-neutral-800">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
                            <CardDescription className="text-lg">
                                Making Data Structures & Algorithms accessible through interactive visualizations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed">
                                    I suffered with algorithms and their workflow during my learning journey.
                                    The abstract nature of these concepts made it incredibly difficult to understand
                                    how they actually work under the hood.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    This project was born from that struggle. With your help, we can create something
                                    that actually helps people save their most precious resource - <strong className="text-blue-600 dark:text-blue-400">time</strong>.
                                    Together, we can build a platform that transforms the way students learn DSA.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Our goal is simple: <em>No more struggling with abstract algorithm concepts.</em>
                                    Every student should be able to see, understand, and master these fundamental
                                    computer science concepts through interactive visualizations.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100">
                        Why Choose DSA Visualizer?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow border-neutral-200 dark:border-neutral-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="text-center"
                >
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                                Ready to Make a Difference?
                            </h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                                Join our community of developers and educators working to make DSA learning accessible to everyone.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Explore Algorithms
                                    </Button>
                                </Link>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                                    onClick={() => window.open('https://github.com/KamrAnDarmAn/dsa-visualizer', '_blank')}
                                >
                                    Contribute on GitHub
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default About