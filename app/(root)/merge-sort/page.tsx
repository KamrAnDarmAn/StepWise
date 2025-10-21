import MergeSort from '@/components/MergeSort'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const App = () => {
    return (
        <>
            <Button variant='link'>
                <Link href='/' className='text-neutral-50'>Go Back</Link>
            </Button>
            <main className='h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-50 flex items-center justify-center'>
                <MergeSort />
            </main>
        </>
    )
}
export default App