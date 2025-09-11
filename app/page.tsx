'use client'
import Image from "next/image";
import { useState, useEffect, FormEvent, useRef, useMemo } from "react";
import PostCard from '@/components/PostCard'
import { Post } from '../types/types'
import Link from "next/link";
import { useMobileOpen } from "@/components/MobileOpenProvider";
import { signOut, useSession } from "next-auth/react";
import InfiniteScroll from "react-infinite-scroll-component";

type MobileOpenContextType = {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  isMobile: boolean
}
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState<string>("");
  const [codeNewContent, setCodeContent] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCodeMode, setCodeMode] = useState<boolean>(false);
  const codeTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const {isMobile} = useMobileOpen();
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const {data: session} = useSession();
  console.log(imageURL)
  console.log(session)

  const fetchPosts = async(): Promise<void> => {
      const res = await fetch(`http://localhost:8080/api/posts/get?page=${page}&size=30`);
      const data = await res.json();
      console.log(data);
      if (!data){
        return;
      }

      if (data.length < 5) {
        setHasMore(false);
      }

      setPosts((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
  }

  useEffect(() => {
    fetchPosts();
  }, [])
  console.log(page)
  console.log(posts)

  const handleCreatePost = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() && !codeNewContent.trim() && !imageURL) return;

    const newPost: Post = {
      id: posts.length > 0 ? posts[0].id + 1 : 1, // safe incremental ID
      author: session?.user?.name as string,
      content: newContent,
      codeContent: isCodeMode ? codeNewContent : undefined,
      likesCount: 0 as number,
      commentsCount: 0 as number,
      commentsList: [],
      createdAt: new Date().toISOString(),
      imageURL: imageURL || undefined,
    };

    const {id, ...postWithoutId} = newPost

    const response = await fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postWithoutId),
    })
    console.log(response?.ok)

    setPosts([newPost, ...posts]);
    setNewContent("");
    setCodeContent("");
    setImageURL(null);
  };

  const setContent = (letter: string): void => {
    setNewContent(letter)
  }

  const setCodeContentState = (letter: string): void => {
    setCodeContent(letter)
  }

    // Auto-resize textarea as user types
  useEffect((): void => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 400) + "px"
    }

    if (codeTextAreaRef.current){
      codeTextAreaRef.current.style.height = "auto";
      codeTextAreaRef.current.style.height = Math.min(codeTextAreaRef.current.scrollHeight, 400) + "px"
    }
  }, [newContent, codeNewContent]);

  const setCodeModeState = () =>{
    setCodeMode(!isCodeMode);
  }

  function handleEmojiClicker(event: any): void {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const url = URL.createObjectURL(file); // temporary URL for preview
    setImageURL(url);
  };

  const postCards = 
      posts.map((post) => (
        <PostCard key={post.id} post={post} setPosts={() => setPosts}/>
      ))

  console.log(posts);
  console.log(isMobile)

  return (
    <main className="flex justify-center gap-8">
      {/* CONTAINER THAT HOLDS NAV + FEED */}
      <div className="grid w-full max-w-4xl md:grid-cols-[200px_1fr]">
        {/* LEFT NAV */}
        <nav className="border-r border-gray-300 pr-6 flex flex-col space-y-4 hidden md:flex">
          <Link href = "/" title = "Home" className="flex items-center gap-5 px-3 py-2 rounded-md hover:bg-gray-200 font-medium text-2xl cursor-pointer">
            <Image src="/homeImage.png" alt="Home" width={30} height={30} />
            Home
          </Link>
          <Link href = "/" title = "Profile" className="flex items-center gap-5 px-3 py-2 rounded-md hover:bg-gray-200 font-medium text-2xl cursor-pointer">
            <Image src="/profile.png" alt="Profile"  width={30} height={30} />
            Profile
          </Link>
          <Link href = "/" title = "Settings" className="flex items-center gap-5 px-3 py-2 rounded-md hover:bg-gray-200 font-medium text-2xl cursor-pointer">
            <Image src="/settingsImage.png" alt="Settings"  width={30} height={30} />
            Settings
          </Link>
          {session?.user &&
            <button title = "Logout" className="flex items-center gap-5 px-3 py-2 rounded-md hover:bg-gray-200 font-medium text-2xl cursor-pointer" onClick = {() => signOut}>
              <Image src="/logout.png" alt="Logout"  width={30} height={30} />
              Logout
            </button>
          }
          
        </nav>

        {/* FEED */}
        <main className="flex flex-col">
          {/* POST BOX */}
          <div className="border border-gray-300 p-4 bg-white shadow-sm sm:w-full">
            {/* INPUT */}
            <textarea
              ref={textareaRef}
              placeholder="What's on your mind?"
              value={newContent}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 resize-none focus:outline-none overflow-hidden"
              rows={3} // start small
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
            {imageURL && (
            <div className="my-2 w-full flex flex-col items-center">
              <img src={imageURL} alt="Uploaded" className="max-h-80 rounded" />
              <button
                type="button"
                className="text-red-500 text-sm mt-1 hover:underline cursor-pointer"
                onClick={() => setImageURL(null)}
              >
                Remove Image
              </button>
            </div>
          )}
            {isCodeMode &&
            <textarea
              ref={codeTextAreaRef}
              value={codeNewContent}
              onChange={(e) => setCodeContentState(e.target.value)}
              placeholder="Type code here..."
              className={"w-full p-2 resize-none focus:outline-none overflow-y-auto rounded-md bg-gray-100 font-mono text-sm border border-gray-400"}
              rows={3}
            />}

            {/* ACTIONS */}
            <div className="flex items-center justify-between mt-2">
              {/* Emoji / Image Buttons */}
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-200 rounded-full cursor-pointer" onClick={() => fileInputRef.current?.click()} title = "Image File Upload">
                  <img src="imageIcon.png" alt="Image" className="w-6 h-6" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full cursor-pointer" onClick = {handleEmojiClicker} title = "Emojis">
                  <img src="emojiIcon.png" alt="Emoji" className="w-6 h-6" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full cursor-pointer" title = "GIFs">
                  <img src="gifIcon.png" alt="GIF" className="w-6 h-6" />
                </button>
                <button className = "p-2 hover:bg-gray-200 rounded-full cursor-pointer" title = {isCodeMode === true ? "Close Code Editor" : "Insert Code"} onClick = {setCodeModeState}>
                  <img src="codeSymbol.jpg" alt="Code" className="w-6 h-6" />
                </button>
              </div>

              {/* Post Button */}
              <button className="bg-black text-white px-5 py-2 font-bold rounded-full cursor-pointer hover:bg-gray-700" onClick = {handleCreatePost}>
                Post
              </button>
            </div>
          </div>
          <InfiniteScroll
           dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p className="text-3xl font-bold">No more posts</p>}
          scrollThreshold={0.9} // triggers earlier
          style={{ overflow: 'visible' }}> 
              {postCards}
          </InfiniteScroll>
          {/* feed posts */}
        </main>
      </div>

    </main>
  );
}
