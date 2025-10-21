"use client"
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { type Algorithm } from '@/types/types'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Clock, Database, ArrowRight } from 'lucide-react'

const AlgoCard = ({ algo }: { algo: Algorithm }) => {
  const href = `/${algo.slug ?? algo.name?.toLowerCase?.().replace(/\s+/g, '-') ?? 'binary-search'}`
  const src = algo.imageUrl || '/algo-initial/binary_search.jpg'
  return (
    <Link href={href} aria-label={`Open ${algo.name} visualizer`}>
      <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
        <Card className='m-4 h-full  border-neutral-200/60 dark:border-neutral-800/60 hover:shadow-lg transition-shadow'>
          <CardHeader className='pb-2 '>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <CardTitle className='text-base md:text-lg'>{algo.name}</CardTitle>
                <div className='flex items-center gap-4 text-xs text-muted-foreground mt-1'>
                  <span className='inline-flex items-center gap-1'><Clock className='h-3.5 w-3.5' />{algo.timeComplexity}</span>
                  <span className='inline-flex items-center gap-1'><Database className='h-3.5 w-3.5' />{algo.spaceComplexity}</span>
                </div>
              </div>
              <ArrowRight className='h-4 w-4 opacity-60' />
            </div>
            <CardDescription className='sr-only'>{algo.type} Algorithm</CardDescription>
          </CardHeader>
          <CardContent className='pt-0 '>
            <div className='relative aspect-[16/9] w-full overflow-hidden rounded-md'>
              <Image
                src={src}
                alt={`${algo.name} illustration`}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover transition-transform duration-300 ease-out hover:scale-[1.03]'
                priority={false}
              />
            </div>
          </CardContent>
          <CardFooter className='text-xs text-muted-foreground'>
            <p>{algo.type} Algorithm</p>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}

export default AlgoCard