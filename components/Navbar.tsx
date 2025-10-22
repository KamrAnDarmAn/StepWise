'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Github, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { navItems } from '@/constants/data'

const Navbar = () => {
    function ThemeToggle() {
        const { theme, setTheme } = useTheme()
        const isDark = theme === 'dark'
        return (
            <Button
                variant={"ghost"}
                size={"icon"}
                aria-label="Toggle theme"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
                {isDark ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
            </Button>
        )
    }

    return (
        <header className='sticky top-0 z-40 w-full border-b border-neutral-200/60 dark:border-neutral-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-neutral-950/50'>
            <div className='mx-auto max-w-6xl px-4 py-3 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Link href='/' className='font-semibold tracking-tight text-blue-500 font-bold text-xl '>StepWise</Link>
                    <nav className=' md:flex items-center gap-4 text-sm text-muted-foreground'>
                        {
                            navItems.map(route => (

                                <Link key={route.title} href={route.href} className='hover:text-foreground'>{route.title}</Link>
                            ))
                        }
                    </nav>
                </div>
                <div className='flex items-center gap-2'>
                    <Link href='https://github.com/KamrAnDarmAn/StepWise.git' target='_blank' aria-label='GitHub'>
                        <Button variant={'ghost'} size={'icon'}>
                            <Github className='h-5 w-5' />
                        </Button>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}

export default Navbar