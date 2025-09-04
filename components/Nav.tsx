'use client'
import React from 'react'
import { useState } from 'react';

const Nav = (): React.JSX.Element =>  {
    const [inputValue, setInputValue] = useState<string>("");

    const setInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            console.log("Search for:", inputValue);
        }
    };
  return (
    <nav className = "justify-center border border-gray-300 flex h-16 w-full">
        <input className = "h-8 border-2 border border-gray-500 justify-self-center self-center w-100 rounded-md outline-none p-2 m-2" placeholder = "Search" name = "search" type= "text" value = {inputValue} onChange={(e) => setInput(e)} onKeyDown={handleKeyDown}></input>
    </nav>
  )
}

export default Nav