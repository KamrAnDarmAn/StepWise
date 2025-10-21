import AlgoCard from '@/components/AlgoCard'
import algorithms from '@/constants/algorithms'
import React from 'react'



const App = () => {
    return (
        <main className='w-full grid  h-screen grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-neutral-50 dark:bg-neutral-950  text-neutral-50 dark:text-neutral-50'>
            {
                algorithms.map(algorithm => (
                    <AlgoCard algo={algorithm} key={algorithm.name} />
                ))
            }
        </main>
    )
}

export default App