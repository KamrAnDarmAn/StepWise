'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, StepForward, Shuffle, RotateCcw, Info, Zap } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Types for merge sort visualization
interface MergeStep {
    type: 'divide' | 'merge' | 'compare'
    leftArray: number[]
    rightArray: number[]
    mergedArray: number[]
    leftIndex: number
    rightIndex: number
    description: string
    level: number
}

const MergeSort = () => {
    const [originalArray, setOriginalArray] = useState<number[]>([])
    const [rawInput, setRawInput] = useState<string>('')
    const [currentStep, setCurrentStep] = useState(0)
    const [steps, setSteps] = useState<MergeStep[]>([])
    const [playing, setPlaying] = useState(false)
    const [speedMs, setSpeedMs] = useState(1000)
    const [isComplete, setIsComplete] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)

    // Parse input numbers
    function parseNumbers(source: string): number[] {
        const parts = source
            .split(/[^-\d.]+/g)
            .filter(Boolean)
        const nums: number[] = []
        for (const part of parts) {
            const n = Number(part)
            if (!Number.isFinite(n)) return []
            nums.push(n)
        }
        return nums
    }

    const generateMergeSortSteps = useCallback((arr: number[]): MergeStep[] => {
        const steps: MergeStep[] = []
        const levels: number[][] = []

        // Initialize with original array
        levels[0] = [...arr]

        // Generate divide steps
        const divide = (array: number[], level: number, startIdx: number = 0) => {
            if (array.length <= 1) return

            const mid = Math.floor(array.length / 2)
            const left = array.slice(0, mid)
            const right = array.slice(mid)

            // Add divide step
            steps.push({
                type: 'divide',
                leftArray: left,
                rightArray: right,
                mergedArray: [],
                leftIndex: -1,
                rightIndex: -1,
                description: `Divide: [${array.join(', ')}] → [${left.join(', ')}] + [${right.join(', ')}]`,
                level: level
            })

            // Recursively divide
            divide(left, level + 1, startIdx)
            divide(right, level + 1, startIdx + mid)
        }

        // Generate merge steps
        const merge = (left: number[], right: number[], level: number): number[] => {
            const merged: number[] = []
            let leftIdx = 0
            let rightIdx = 0

            // Add initial merge step
            steps.push({
                type: 'merge',
                leftArray: [...left],
                rightArray: [...right],
                mergedArray: [],
                leftIndex: leftIdx,
                rightIndex: rightIdx,
                description: `Merge: [${left.join(', ')}] + [${right.join(', ')}]`,
                level: level
            })

            // Compare and merge elements
            while (leftIdx < left.length && rightIdx < right.length) {
                // Add comparison step
                steps.push({
                    type: 'compare',
                    leftArray: [...left],
                    rightArray: [...right],
                    mergedArray: [...merged],
                    leftIndex: leftIdx,
                    rightIndex: rightIdx,
                    description: `Compare: ${left[leftIdx]} vs ${right[rightIdx]}`,
                    level: level
                })

                if (left[leftIdx] <= right[rightIdx]) {
                    merged.push(left[leftIdx])
                    leftIdx++
                } else {
                    merged.push(right[rightIdx])
                    rightIdx++
                }

                // Add merge step
                steps.push({
                    type: 'merge',
                    leftArray: [...left],
                    rightArray: [...right],
                    mergedArray: [...merged],
                    leftIndex: leftIdx,
                    rightIndex: rightIdx,
                    description: `Merged: [${merged.join(', ')}]`,
                    level: level
                })
            }

            // Add remaining elements
            while (leftIdx < left.length) {
                merged.push(left[leftIdx])
                leftIdx++
                steps.push({
                    type: 'merge',
                    leftArray: [...left],
                    rightArray: [...right],
                    mergedArray: [...merged],
                    leftIndex: leftIdx,
                    rightIndex: rightIdx,
                    description: `Add remaining: ${left[leftIdx - 1]}`,
                    level: level
                })
            }

            while (rightIdx < right.length) {
                merged.push(right[rightIdx])
                rightIdx++
                steps.push({
                    type: 'merge',
                    leftArray: [...left],
                    rightArray: [...right],
                    mergedArray: [...merged],
                    leftIndex: leftIdx,
                    rightIndex: rightIdx,
                    description: `Add remaining: ${right[rightIdx - 1]}`,
                    level: level
                })
            }

            return merged
        }

        // Generate merge sort steps
        const mergeSort = (array: number[], level: number = 0): number[] => {
            if (array.length <= 1) return array

            const mid = Math.floor(array.length / 2)
            const left = array.slice(0, mid)
            const right = array.slice(mid)

            const sortedLeft = mergeSort(left, level + 1)
            const sortedRight = mergeSort(right, level + 1)

            return merge(sortedLeft, sortedRight, level)
        }

        divide(arr, 0)
        mergeSort(arr)

        return steps
    }, [])

    // Handle array input
    function handleInsertion(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const parsed = parseNumbers(rawInput)
        if (parsed.length === 0) {
            toast.error('Please enter a list of numbers, e.g. 8, 3, 1, 6, 4')
            return
        }
        if (parsed.length > 10) {
            toast.error('Please enter maximum 10 numbers for better visualization')
            return
        }

        setOriginalArray(parsed)
        const generatedSteps = generateMergeSortSteps(parsed)
        setSteps(generatedSteps)
        setCurrentStep(0)
        setIsComplete(false)
        setPlaying(false)
        toast.success(`Array set with ${parsed.length} elements`)
    }

    // Step through the algorithm
    function stepOnce() {
        if (steps.length === 0) {
            toast.error('Please insert an array first')
            return
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            setIsComplete(true)
            setPlaying(false)
            toast.success('Merge Sort Complete!')
        }
    }

    // Reset to beginning
    function reset() {
        setCurrentStep(0)
        setIsComplete(false)
        setPlaying(false)
    }

    // Generate random array
    function randomize() {
        const size = Math.floor(Math.random() * 6) + 5 // 5-10 elements
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1)

        setOriginalArray(arr)
        setRawInput(arr.join(', '))
        const generatedSteps = generateMergeSortSteps(arr)
        setSteps(generatedSteps)
        setCurrentStep(0)
        setIsComplete(false)
        setPlaying(false)
        toast.success(`Random array generated with ${arr.length} elements`)
    }

    // Auto-play effect
    useEffect(() => {
        if (!playing || isComplete) return
        const id = setInterval(() => {
            stepOnce()
        }, speedMs)
        return () => clearInterval(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing, speedMs, currentStep, steps.length, isComplete])

    // Get current step data
    const currentStepData = steps[currentStep] || null
    return (
        <Card className='w-full h-full lg:flex-wrap'>
            <CardHeader className='mb-3'>
                <CardTitle className='flex items-center gap-2'>
                    <Zap className='h-5 w-5' />
                    Merge Sort Visualizer
                </CardTitle>
                <CardDescription>
                    A divide-and-conquer algorithm that splits arrays and merges them back sorted
                </CardDescription>

                <form onSubmit={handleInsertion} className='flex flex-wrap gap-3 items-end'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium'>Array Elements</label>
                        <Input
                            value={rawInput}
                            onChange={e => setRawInput(e.target.value)}
                            placeholder='e.g. 8, 3, 1, 6, 4'
                            className='w-64'
                        />
                    </div>
                    <Button type='submit' variant='default'>
                        Set Array
                    </Button>
                    <Button type='button' variant='secondary' onClick={randomize}>
                        <Shuffle className='h-4 w-4 mr-2' /> Randomize
                    </Button>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => setShowExplanation(!showExplanation)}
                    >
                        <Info className='h-4 w-4 mr-2' />
                        {showExplanation ? 'Hide' : 'Show'} Info
                    </Button>
                </form>

                {/* Algorithm Information */}
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className='mt-4 p-4 bg-muted rounded-lg'
                        >
                            <h4 className='font-semibold mb-2'>How Merge Sort Works:</h4>
                            <ol className='list-decimal list-inside space-y-1 text-sm'>
                                <li><strong>Divide:</strong> Split the array into two halves recursively</li>
                                <li><strong>Conquer:</strong> Sort each half independently</li>
                                <li><strong>Merge:</strong> Combine the sorted halves back together</li>
                            </ol>
                            <div className='mt-2 text-xs text-muted-foreground'>
                                <strong>Time Complexity:</strong> O(n log n) | <strong>Space Complexity:</strong> O(n)
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardHeader>

            <CardContent className='flex flex-col gap-4 items-center justify-center min-h-[600px]'>
                {/* Original Array */}
                {originalArray.length > 0 && (
                    <div className='flex flex-col items-center gap-2'>
                        <h3 className='text-sm font-medium text-muted-foreground'>Original Array</h3>
                        <motion.div className='flex gap-2'>
                            {originalArray.map((value, index) => (
                                <motion.div
                                    key={`original-${index}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={cn(
                                        'bg-blue-500 text-white h-12 w-12 flex items-center justify-center font-semibold rounded-lg shadow-md'
                                    )}
                                >
                                    {value}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}

                {/* Current Step Visualization */}
                {currentStepData && (
                    <div className='flex flex-col items-center gap-4 w-full'>
                        {/* Step Description */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-center p-3 bg-primary/10 rounded-lg border'
                        >
                            <div className='font-medium text-sm'>
                                Step {currentStep + 1} of {steps.length}
                            </div>
                            <div className='text-sm text-muted-foreground mt-1'>
                                {currentStepData.description}
                            </div>
                        </motion.div>

                        {/* Visual Arrays */}
                        <div className='flex flex-col gap-4 items-center'>
                            {/* Left Array */}
                            {currentStepData.leftArray.length > 0 && (
                                <div className='flex flex-col items-center gap-2'>
                                    <span className='text-xs font-medium text-muted-foreground'>Left Array</span>
                                    <motion.div className='flex gap-2'>
                                        {currentStepData.leftArray.map((value, index) => (
                                            <motion.div
                                                key={`left-${index}`}
                                                animate={{
                                                    scale: currentStepData.type === 'compare' && index === currentStepData.leftIndex ? 1.2 : 1,
                                                    backgroundColor: currentStepData.type === 'compare' && index === currentStepData.leftIndex ? '#ef4444' : '#3b82f6'
                                                }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                className={cn(
                                                    'text-white h-10 w-10 flex items-center justify-center font-semibold rounded-lg shadow-md'
                                                )}
                                            >
                                                {value}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            )}

                            {/* Merge Arrow */}
                            {currentStepData.type === 'merge' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='text-2xl text-muted-foreground'
                                >
                                    ↓
                                </motion.div>
                            )}

                            {/* Right Array */}
                            {currentStepData.rightArray.length > 0 && (
                                <div className='flex flex-col items-center gap-2'>
                                    <span className='text-xs font-medium text-muted-foreground'>Right Array</span>
                                    <motion.div className='flex gap-2'>
                                        {currentStepData.rightArray.map((value, index) => (
                                            <motion.div
                                                key={`right-${index}`}
                                                animate={{
                                                    scale: currentStepData.type === 'compare' && index === currentStepData.rightIndex ? 1.2 : 1,
                                                    backgroundColor: currentStepData.type === 'compare' && index === currentStepData.rightIndex ? '#ef4444' : '#10b981'
                                                }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                className={cn(
                                                    'text-white h-10 w-10 flex items-center justify-center font-semibold rounded-lg shadow-md'
                                                )}
                                            >
                                                {value}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            )}

                            {/* Merged Array */}
                            {currentStepData.mergedArray.length > 0 && (
                                <div className='flex flex-col items-center gap-2 '>
                                    <span className='text-xs font-medium text-muted-foreground'>Merged Array</span>
                                    <motion.div className='flex gap-2'>
                                        {currentStepData.mergedArray.map((value, index) => (
                                            <motion.div
                                                key={`merged-${index}`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={cn(
                                                    'bg-purple-500 text-white h-10 w-10 flex items-center justify-center font-semibold rounded-lg shadow-md'
                                                )}
                                            >
                                                {value}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Completion Message */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg border border-green-300 dark:border-green-700'
                    >
                        <div className='text-green-800 dark:text-green-200 font-semibold'>
                            🎉 Merge Sort Complete!
                        </div>
                        <div className='text-green-600 dark:text-green-400 text-sm mt-1'>
                            Array is now sorted in ascending order
                        </div>
                    </motion.div>
                )}

                {/* Controls */}
                <div className="flex w-full items-center justify-center gap-3 md:gap-5 mt-4">
                    <Button
                        onClick={stepOnce}
                        variant='default'
                        disabled={isComplete}
                    >
                        <StepForward className='h-4 w-4 mr-2' />
                        {isComplete ? 'Complete' : 'Step'}
                    </Button>
                    <Button
                        onClick={() => setPlaying(p => !p)}
                        variant={playing ? 'destructive' : 'secondary'}
                        disabled={isComplete}
                    >
                        {playing ? <Pause className='h-4 w-4 mr-2' /> : <Play className='h-4 w-4 mr-2' />}
                        {playing ? 'Pause' : 'Play'}
                    </Button>
                    <Button onClick={reset} variant='ghost'>
                        <RotateCcw className='h-4 w-4 mr-2' /> Reset
                    </Button>
                </div>

                {/* Speed Control */}
                <div className='flex items-center gap-3 pt-2'>
                    <span className='text-xs text-muted-foreground'>Speed</span>
                    <input
                        type='range'
                        min={500}
                        max={3000}
                        step={100}
                        value={speedMs}
                        onChange={e => setSpeedMs(+e.target.value)}
                        className='w-24'
                    />
                    <span className='text-xs text-muted-foreground'>{speedMs}ms</span>
                </div>

                {/* Progress Bar */}
                {steps.length > 0 && (
                    <div className='w-full max-w-md'>
                        <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                            <span>Progress</span>
                            <span>{currentStep + 1} / {steps.length}</span>
                        </div>
                        <div className='w-full bg-muted rounded-full h-2'>
                            <motion.div
                                className='bg-primary h-2 rounded-full'
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default MergeSort