import React, { useEffect, useRef, useState } from 'react'
import { Post } from '../types/types'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import AnalysisModal from './AnalysisModal';

type Comment = {
    id: number,
    text: string,
    author: string, // or a User entity if you have authentication
    post: Post;
}

const PostCard = ({post, setPosts, onClick}: {post: Post, setPosts: any, onClick: () => void}) => {
  console.log(post)
  const [commentsCount, setCommentsCount] = useState<number>(post.commentsCount);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [likes, setLikes] = useState(post.likesCount);
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false); // updated from backend below
  const [isModalOpen, setModalOpen] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHasLiked = async () => {
      if (!session) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/posts/${post.id}/liked?email=${session?.user?.email}`
        );
        const data = await res.json();
        setLiked(data);
      } catch (err) {
        console.error("Failed to fetch like info:", err);
      }
    };

    fetchHasLiked();
  }, [post.id, session]);

  // Debounce backend updates
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const syncLikeToBackend = async (likeNow: boolean) => {
    if (!session) return;
    try {
      if (likeNow) {
        await fetch(
          `http://localhost:8080/api/posts/${post.id}/like?email=${session.user?.email}`,
          { method: "POST" }
        );
      } else {
        await fetch(
          `http://localhost:8080/api/posts/${post.id}/unlike?email=${session.user?.email}`,
          { method: "DELETE" }
        );
      }
    } catch (err) {
      console.error("Failed to sync like:", err);
    }
  };

  const handleLike = () => {
    // optimistic UI
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    // debounce backend call
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      syncLikeToBackend(!liked);
    }, 1000); // adjust delay as needed
  };

  async function handleAiAnalysis(): Promise<void> {
    try {
      setLoading(true);
      setModalOpen(true);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: post?.content,
          codeContent: post?.codeContent || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI analysis");

      const data = await response.json();
      setAnalysisText(data?.analysis);
    } catch (err) {
      console.error(err);
      setAnalysisText("Failed to get AI analysis. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
    
  }
  console.log(liked)



const handleCommentSubmit = async () => {
    const res = await fetch(`http://localhost:8080/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newComment, author: "User123", createdAt: new Date().toISOString(),})
    });
    const data = await res.json();
    setCommentsCount((prev)=> prev + 1);
    setCommentsList(prev => [...prev, data]);
    setNewComment("");
  };

  return (
    <div className="p-4 shadow-sm max-w-full min-w-0 hover:bg-gray-300 cursor-pointer" onClick = {onClick}>
      {/* Post Header */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <span className="font-semibold">{post.author}</span>
        
        <div className="flex items-center space-x-5">
          {/* Button wrapping the AI image */}
          <button className="p-0 hover:bg-gray-500 rounded-full" onClick={() => handleAiAnalysis()}>
            <Image 
              width={40} 
              height={40} 
              alt="ai" 
              title = "Ask Grok to analyze the post"
              src="/aiImage.jpg"
              className="cursor-pointer rounded-full p-1"
            />
          </button>
          

          {post.createdAt && (
            <span className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <AnalysisModal analysisText={loading ? "Loading AI analysis..." : analysisText} isOpen = {isModalOpen} onClose = {() => setModalOpen(false)}></AnalysisModal>

      {/* Post Content */}
      {post.content && <p className="mb-2 break-word">{post.content}</p>}

      {/* Code Content */}
      {post.codeContent && (
        <pre className="bg-gray-100 p-2 rounded font-mono text-xs mb-2 whitespace-pre-wrap break-all text-justify">
          {post.codeContent}
        </pre>
      )}

      {/* Image */}
      {post.imageURL && (
        <img
          src={post.imageURL}
          alt="Post"
          className="w-full h-auto max-h-80 object-contain rounded mb-2"
        />
      )}

      {/* Post Footer */}
      <div className="flex justify-between text-gray-500 text-sm mt-2">
        <button
          className="flex items-center space-x-1 hover:text-blue-500"
          onClick={() => handleLike()}
        >
          <span>👍</span>
          <span>{likes}</span>
        </button>

        <button
          className="flex items-center space-x-1 hover:text-blue-500"
          onClick={(e) => {
            setIsCommenting(!isCommenting)
            e.stopPropagation()
          }}
          
        >
          <span>💬</span>
          <span>{commentsCount}</span>
        </button>
      </div>
      {/* Comment input */}
      {isCommenting && (
        <div className="mt-2 flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value)
            }}
            onClick = {(e)=> e.stopPropagation()}
            placeholder="Write a comment..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            className="bg-blue-500 text-white px-3 rounded cursor-pointer"
            onClick={(e) => {
              setNewComment("")
              e.stopPropagation()
              handleCommentSubmit()
            }}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard