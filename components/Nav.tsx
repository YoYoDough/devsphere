'use client'
import Image from 'next/image';
import React from 'react'
import { useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react"
import { useMobileOpen } from './MobileOpenProvider';
import Link from 'next/link';

const Nav = (): React.JSX.Element =>  {
    const [inputValue, setInputValue] = useState<string>("");
    const {isMenuOpen, setIsMenuOpen, isMobile} = useMobileOpen();
    const {data: session} = useSession()

    const setInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            console.log("Search for:", inputValue);
        }
    };

    const menuLinks = (
        <>
            <Link href="/" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded cursor-pointer">Feed</Link>
            <Link href="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded cursor-pointer">Profile</Link>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded cursor-pointer">Settings</button>
            {session !== null ?<button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded text-red-500 cursor-pointer">Logout</button> : <button className = "flex items-center gap-2 px-3 py-2 w-fit rounded-full bg-black p-4 m-2 text-white font-bold cursor-pointer hover:bg-gray-700 cursor-pointer" onClick = {() => signIn('google')}>Log In</button>}
        </>
    )
  return (
    <nav className = "flex justify-between border border-gray-300 h-20 w-full p-4">
        {!isMobile &&
        <div className = "max-w-full flex items-center gap-3">
            <Image src='/globe.svg' width = {50} height = {50} alt = "Globe" className='w-6 h-12 sm:w-10 sm:h-10 xs:w-8 xs:h-8'></Image>
            <h1 className = "font-extrabold text-2xl sm:text-xl xs:text-lg truncate ">DevSphere</h1>
        </div>
        }

        {/* Hamburger for mobile */}
        {isMobile && (
            <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 w-15 rounded-md bg-gray-200 cursor-pointer"
            >
            ☰
            </button>
        )}
        
        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
            <div className="absolute top-20 left-0 w-48 bg-white border border-gray-300 shadow-md flex flex-col space-y-1 p-2 z-50">
            {menuLinks}
            </div>
        )}

        <div className="relative max-w-100">
            <input
                className="h-12 w-full rounded-full border-2 border-gray-500 pl-10 pr-4 outline-none"
                placeholder="Search"
                name="search"
                type="text"
                value={inputValue}
                onChange={(e) => setInput(e)}
                onKeyDown={handleKeyDown}
            />
            <img
                src="/searchImage.png"
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
        </div>

        {!isMobile && <button className = "text-center w-24 rounded-full bg-black p-4 m-2 self-center text-white font-bold cursor-pointer hover:bg-gray-700" onClick = {() => signIn('google')}>Log In</button>}
    </nav>
  )
}

export default Nav