'use client'
import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import PostCard from '@/components/PostCard'
import { Post } from '../types/types'


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState<string>("");

  useEffect(() => {
    const fetchFeedData = async(): Promise<void> => {
      const response: Response = await fetch("http:localhost/8080");
      if (!response){
        return;
      }
      const data: Post[] = await response.json();
      setPosts(data);
    }
    fetchFeedData();
  }, [posts])

  function handleCreatePost(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <main className="grid grid-rows-[auto_1fr]">
      <form onSubmit = {handleCreatePost}>
        <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border border-solid border-gray-400 outline-none p-4 resize-none"
          />
      </form>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}
