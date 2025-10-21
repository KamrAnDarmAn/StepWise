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

// Types for quick sort visualization
interface QuickSortStep {
    type: 'partition' | 'pivot' | 'swap' | 'complete'
    array: number[]
    pivotIndex: number
    leftIndex: number
    rightIndex: number
    pivotValue: number
    description: string
    level: number
    partitionIndex?: number
}

const QuickSort = () => {
    const [originalArray, setOriginalArray] = useState<number[]>([])
    const [rawInput, setRawInput] = useState<string>('')
    const [currentStep, setCurrentStep] = useState(0)
    const [steps, setSteps] = useState<QuickSortStep[]>([])
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

    // Generate all quick sort steps for visualization
    const generateQuickSortSteps = useCallback((arr: number[]): QuickSortStep[] => {
        const steps: QuickSortStep[] = []

        // Helper function to add a step
        const addStep = (type: QuickSortStep['type'], array: number[], pivotIndex: number, leftIndex: number, rightIndex: number, pivotValue: number, description: string, level: number, partitionIndex?: number) => {
            steps.push({
                type,
                array: [...array],
                pivotIndex,
                leftIndex,
                rightIndex,
                pivotValue,
                description,
                level,
                partitionIndex
            })
        }

        // Partition function that returns the final pivot position
        const partition = (array: number[], low: number, high: number, level: number): number => {
            const pivot = array[high]
            let i = low - 1

            addStep('pivot', array, high, low, high, pivot, `Choose pivot: ${pivot} (index ${high})`, level)

            for (let j = low; j < high; j++) {
                addStep('partition', array, high, j, i + 1, pivot, `Compare: ${array[j]} vs pivot ${pivot}`, level)

                if (array[j] <= pivot) {
                    i++
                    if (i !== j) {
                        // Swap elements
                        [array[i], array[j]] = [array[j], array[i]]
                        addStep('swap', array, high, j, i, pivot, `Swap: ${array[i]} ↔ ${array[j]}`, level)
                    }
                }
            }

            // Swap pivot with element at i+1
            if (i + 1 !== high) {
                [array[i + 1], array[high]] = [array[high], array[i + 1]]
                addStep('swap', array, high, high, i + 1, pivot, `Place pivot: ${array[i + 1]} at position ${i + 1}`, level)
            }

            addStep('complete', array, i + 1, -1, -1, pivot, `Partition complete: pivot ${array[i + 1]} at position ${i + 1}`, level, i + 1)
            return i + 1
        }

        // Quick sort function
        const quickSort = (array: number[], low: number, high: number, level: number = 0) => {
            if (low < high) {
                const pivotIndex = partition(array, low, high, level)

                // Recursively sort elements before and after partition
                quickSort(array, low, pivotIndex - 1, level + 1)
                quickSort(array, pivotIndex + 1, high, level + 1)
            }
        }

        // Create a copy of the array to avoid mutating the original
        const arrayCopy = [...arr]
        quickSort(arrayCopy, 0, arrayCopy.length - 1)

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
        const generatedSteps = generateQuickSortSteps(parsed)
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
            toast.success('Quick Sort Complete!')
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
        const generatedSteps = generateQuickSortSteps(arr)
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
                    Quick Sort Visualizer
                </CardTitle>
                <CardDescription>
                    A divide-and-conquer algorithm that picks a pivot and partitions the array around it
                </CardDescription>

                {/* Input Form */}
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
                            <h4 className='font-semibold mb-2'>How Quick Sort Works:</h4>
                            <ol className='list-decimal list-inside space-y-1 text-sm'>
                                <li><strong>Choose Pivot:</strong> Select an element as pivot (usually last element)</li>
                                <li><strong>Partition:</strong> Rearrange array so elements smaller than pivot are before it, larger after it</li>
                                <li><strong>Recurse:</strong> Apply quick sort to the sub-arrays before and after pivot</li>
                            </ol>
                            <div className='mt-2 text-xs text-muted-foreground'>
                                <strong>Time Complexity:</strong> O(n log n) average, O(n²) worst | <strong>Space Complexity:</strong> O(log n)
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

                        {/* Current Array State */}
                        <div className='flex flex-col items-center gap-2'>
                            <span className='text-xs font-medium text-muted-foreground'>Current Array</span>
                            <motion.div className='flex gap-2'>
                                {currentStepData.array.map((value, index) => (
                                    <motion.div
                                        key={`current-${index}`}
                                        animate={{
                                            scale:
                                                (currentStepData.type === 'partition' && (index === currentStepData.leftIndex || index === currentStepData.rightIndex)) ||
                                                    (currentStepData.type === 'swap' && (index === currentStepData.leftIndex || index === currentStepData.rightIndex)) ||
                                                    (currentStepData.type === 'pivot' && index === currentStepData.pivotIndex)
                                                    ? 1.2 : 1,
                                            backgroundColor:
                                                currentStepData.type === 'pivot' && index === currentStepData.pivotIndex
                                                    ? '#f59e0b' // orange for pivot
                                                    : currentStepData.type === 'partition' && index === currentStepData.leftIndex
                                                        ? '#ef4444' // red for comparing
                                                        : currentStepData.type === 'partition' && index === currentStepData.rightIndex
                                                            ? '#10b981' // green for comparing
                                                            : currentStepData.type === 'swap' && (index === currentStepData.leftIndex || index === currentStepData.rightIndex)
                                                                ? '#8b5cf6' // purple for swapping
                                                                : currentStepData.type === 'complete' && currentStepData.partitionIndex !== undefined && index === currentStepData.partitionIndex
                                                                    ? '#06b6d4' // cyan for final pivot position
                                                                    : '#3b82f6' // blue default
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

                        {/* Legend */}
                        <div className='flex flex-wrap gap-4 text-xs text-muted-foreground mt-2'>
                            <div className='flex items-center gap-1'>
                                <div className='w-3 h-3 bg-orange-500 rounded'></div>
                                <span>Pivot</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <div className='w-3 h-3 bg-red-500 rounded'></div>
                                <span>Comparing</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <div className='w-3 h-3 bg-purple-500 rounded'></div>
                                <span>Swapping</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <div className='w-3 h-3 bg-cyan-500 rounded'></div>
                                <span>Final Position</span>
                            </div>
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
                            🎉 Quick Sort Complete!
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

export default QuickSort