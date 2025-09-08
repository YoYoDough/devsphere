import React, { useState } from 'react'
import { Post } from '../types/types'
import Image from 'next/image';


const PostCard = ({post, setPosts}: {post: Post, setPosts: any}) => {
  console.log(post)
  const [likes, setLikes] = useState<number>(post.likes);
  const [comments, setComments] = useState<number>(post.comments);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  function handleAiAnalysis(): void {
    throw new Error('Function not implemented.');
  }

  const handleLike = async() => {
    setLikes(likes + 1); // optimistic UI

    // Optional: send to backend
    try {
      await fetch(`http://localhost:8080/api/posts/${post.id}/like`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
      setLikes(likes); // revert if failed
    }
  };

  const handleCommentClick = () => {
  setIsCommenting(true); // show input
};

const handleCommentSubmit = async () => {
  if (!newComment.trim()) return;

  setComments(comments + 1); // optimistic UI
  setNewComment("");
  setIsCommenting(false);

  // Optional: send to backend
  try {
    await fetch(`http://localhost:8080/api/posts/${post.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
  } catch (err) {
    console.error(err);
    setComments(comments); // revert if failed
  }
};

  return (
    <div className="p-4 shadow-sm max-w-full min-w-0">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <span className="font-semibold">{post.author}</span>
        
        <div className="flex items-center space-x-5">
          {/* Button wrapping the AI image */}
          <button className="p-0 hover:bg-gray-300 rounded-full" onClick={() => handleAiAnalysis()}>
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
          <span>{post.likes}</span>
        </button>

        <button
          className="flex items-center space-x-1 hover:text-blue-500"
          onClick={() => setIsCommenting(!isCommenting)}
        >
          <span>💬</span>
          <span>{post.comments}</span>
        </button>
      </div>
      {/* Comment input */}
      {isCommenting && (
        <div className="mt-2 flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            className="bg-blue-500 text-white px-3 rounded"
            onClick={handleCommentSubmit}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard