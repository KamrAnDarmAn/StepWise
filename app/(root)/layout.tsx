import { Toaster } from '@/components/ui/sonner'
import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50'>
            <Navbar />
            <section className='mx-auto max-w-6xl px-4 py-6'>
                {children}
            </section>
            <Toaster />
            {/* <Footer /> */}
        </main>
    )
}

export default layout