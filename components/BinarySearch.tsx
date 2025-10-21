'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, StepForward, Shuffle, RotateCcw, ArrowDown, Search } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
const BinarySearch = () => {
    const [input, setInput] = useState<number[]>([])
    const [rawInput, setRawInput] = useState<string>('')
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(-1);
    const [target, setTarget] = useState<number>()
    const [playing, setPlaying] = useState(false)
    const [speedMs, setSpeedMs] = useState(800)
    const [foundIndex, setFoundIndex] = useState<number | null>(null)

    const mid = useMemo(() => (start <= end && end >= 0 ? Math.floor((start + end) / 2) : -1), [start, end])

    function parseNumbers(source: string): number[] {
        const parts = source
            .split(/[^-\d.]+/g) // split by non-number separators (commas, spaces, etc.)
            .filter(Boolean)
        const nums: number[] = []
        for (const part of parts) {
            const n = Number(part)
            if (!Number.isFinite(n)) return []
            nums.push(n)
        }
        return nums
    }

    function handleInsertion(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const parsed = parseNumbers(rawInput)
        if (parsed.length === 0) {
            toast.error('Please enter a list of numbers, e.g. 1, 3, 5, 7')
            return
        }
        const sorted = [...parsed].sort((a, b) => a - b)
        setInput(sorted)
        setStart(0)
        setEnd(sorted.length - 1)
        setFoundIndex(null)
        setPlaying(false)
        toast.success('Array set (auto-sorted ascending)')
    }

    function stepOnce() {
        if (target === undefined || target === null) {
            toast.error('Please provide a target to search for')
            return
        }
        if (input.length === 0) {
            toast.error('Please insert an array first')
            return
        }
        if (start > end) {
            toast.error(`${target} is not present in the array`)
            setPlaying(false)
            return
        }
        if (mid === -1) return
        if (input[mid] === target) {
            setFoundIndex(mid)
            setPlaying(false)
            toast.success(`${target} found at index ${mid}`)
            return
        }
        if (input[mid] < target) {
            setStart(mid + 1)
        } else {
            setEnd(mid - 1)
        }
    }
    function reset() {
        setStart(0)
        setEnd(input.length - 1)
        setFoundIndex(null)
        setPlaying(false)
    }

    function randomize() {
        const size = 10
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90))
        const sorted = arr.sort((a, b) => a - b)
        setInput(sorted)
        setStart(0)
        setEnd(sorted.length - 1)
        setFoundIndex(null)
        setPlaying(false)
        setRawInput(sorted.join(', '))
    }

    useEffect(() => {
        if (!playing) return
        const id = setInterval(() => {
            stepOnce()
        }, speedMs)
        return () => clearInterval(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing, speedMs, start, end, target, input, mid])
    return (
        <Card className='w-full h-full'>
            <CardHeader>
                <CardTitle>Binary Search</CardTitle>
                <CardDescription>A divide and conquer algorithm (array auto-sorted)</CardDescription>
                <form onSubmit={handleInsertion} className='space-x-3'>
                    <Input value={rawInput} onChange={e => setRawInput(e.target.value)} placeholder='Insert elements: e.g. 1, 3, 5, 7' className='w-72' />
                    <Input value={target ?? ''} onChange={e => setTarget(e.target.value === '' ? undefined : +e.target.value)} placeholder='Target element' className='w-48' type='number' />
                    <Button type='submit' variant={'default'}>
                        <Search className='h-4 w-4 mr-2' /> Set
                    </Button>
                    <Button type='button' variant={'secondary'} onClick={randomize}>
                        <Shuffle className='h-4 w-4 mr-2' /> Randomize
                    </Button>
                </form>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 items-center justify-center h-full'>
                <motion.div className='flex gap-2'>
                    {
                        input && input.length > 0 && input.map((ele, i) => (
                            <div key={i} className='flex flex-col items-center'>
                                <motion.p
                                    animate={{
                                        scale: i === mid ? 1.1 : 1,
                                        opacity: i < start || i > end ? 0.4 : 1,
                                        backgroundColor: foundIndex === i ? '#16a34a' : undefined
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    whileHover={{ scale: 1.08 }}
                                    className={cn(`bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 h-8 w-8 md:h-12 md:w-12 lg:h-20 lg:w-20 flex items-center justify-center font-semibold rounded-sm`)}>{ele}</motion.p>
                                <AnimatePresence>
                                    {i === mid && mid !== -1 && (
                                        <motion.div
                                            key={`mid-${i}`}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className='flex flex-col items-center text-xs md:text-sm'
                                        >
                                            <ArrowDown className='h-4 w-4' />
                                            mid
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <AnimatePresence>
                                    {i === start && start <= end && (
                                        <motion.div
                                            key={`start-${i}`}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className='flex flex-col items-center text-xs md:text-sm'
                                        >
                                            <ArrowDown className='h-4 w-4' />
                                            start
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <AnimatePresence>
                                    {i === end && end >= start && (
                                        <motion.div
                                            key={`end-${i}`}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className='flex flex-col items-center text-xs md:text-sm'
                                        >
                                            <ArrowDown className='h-4 w-4' />
                                            end
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    }
                </motion.div>
                <div className="flex w-full items-center justify-center gap-3 md:gap-5">
                    <Button onClick={stepOnce} variant={'default'}>
                        <StepForward className='h-4 w-4 mr-2' /> Step
                    </Button>
                    <Button onClick={() => setPlaying(p => !p)} variant={playing ? 'destructive' : 'secondary'}>
                        {playing ? <Pause className='h-4 w-4 mr-2' /> : <Play className='h-4 w-4 mr-2' />} {playing ? 'Pause' : 'Play'}
                    </Button>
                    <Button onClick={reset} variant={'ghost'}>
                        <RotateCcw className='h-4 w-4 mr-2' /> Reset
                    </Button>
                </div>
                <div className='flex items-center gap-3 pt-2'>
                    <span className='text-xs text-muted-foreground'>Speed</span>
                    <input
                        type='range'
                        min={200}
                        max={2000}
                        step={100}
                        value={speedMs}
                        onChange={e => setSpeedMs(+e.target.value)}
                    />
                    <span className='text-xs text-muted-foreground'>{speedMs} ms</span>
                </div>
            </CardContent>
            <CardFooter className='absolute bottom-0 '>
            </CardFooter>
        </Card>
    )
}

export default BinarySearch