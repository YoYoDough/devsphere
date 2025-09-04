import React from 'react'
import { Post } from '../types/types'


const PostCard = ({key, post}: {key: number, post: Post}) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm w-full max-w-2xl">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{post.author}</span>
        {post.createdAt && (
          <span className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleString()}</span>
        )}
      </div>

      {/* Post Content */}
      {post.content && <p className="mb-2">{post.content}</p>}

      {/* Code Content */}
      {post.codeContent && (
        <pre className="bg-gray-100 p-2 rounded font-mono overflow-x-auto mb-2">
          {post.codeContent}
        </pre>
      )}

      {/* Image */}
      {post.imageURL && (
        <img
          src={post.imageURL}
          alt="Post"
          className="w-full max-h-80 object-contain rounded mb-2"
        />
      )}

      {/* Post Footer */}
      <div className="flex justify-between text-gray-500 text-sm mt-2">
        <span>👍 {post.likes}</span>
        <span>💬 {post.comments}</span>
      </div>
    </div>
  );
};

export default PostCard