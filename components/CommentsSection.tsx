import React, { useEffect, useState } from 'react'

type Comment = {
    id: number,
    author: string,
    text: string,
    likes: number
}

const CommentsSection = ({postId} : {postId: number}) => {
    const [comments, setComments] = useState<Comment[] | null>([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/posts/${postId}/comments`)
        .then(res => res.json())
        .then(setComments);
    }, [postId]);

    return (
        <div className="mt-4 border-t pt-4">
        {comments?.length === 0 ? (
            <p>No comments yet</p>
        ) : (
            comments?.map(c => (
            <div key={c.id} className="py-2 border-b">
                <p className="font-bold">{c.author}</p>
                <p>{c.text}</p>
                <p>{c.likes}</p>
            </div>
            ))
        )}
        </div>
    );

  return (
    <div>CommentsSection</div>
  )
}

export default CommentsSection