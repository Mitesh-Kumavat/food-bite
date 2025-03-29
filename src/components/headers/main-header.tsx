import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '../theme-toggler'

const Header = () => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex w-full items-center justify-between gap-6">
                <h1 className="text-lg font-semibold">Your App</h1>
                <div className='flex gap-4'>
                    <Button variant={'outline'} className="flex items-center gap-2">
                        Profile
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}

export default Header