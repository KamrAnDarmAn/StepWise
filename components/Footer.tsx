import React from 'react'

const Footer = () => {
    return (
        <footer className='border-t border-neutral-200/60 dark:border-neutral-800/60 '>
            <div className='mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground flex items-center justify-between'>
                <p>© {new Date().getFullYear()} StepWise</p>
                <p className='hidden sm:block'>Built with Next.js and shad/cn/ui</p>
            </div>
        </footer>
    )
}

export default Footer