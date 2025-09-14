import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

type Comment = {
    id: number,
    author: string,
    text: string,
    likes: number
    likedByUser: boolean
    createdAt: string,
}

const CommentsSection = ({post, commentsList, setCommentsList, setCommentsCount }: { post: any, commentsList: Comment[], setCommentsList: any, setCommentsCount: any } ) => {
    const {data: session} = useSession();
    const [liked, setLiked] = useState(false); // updated from backend below
    

    useEffect(() => {
        const fetchComments = async () => {
        const res = await fetch(`http://localhost:8080/api/comments/${post.id}/comments?email=${session?.user?.email}`);
        const data = await res.json();

        const likedRes = await fetch(`http://localhost:8080/api/comments/liked?email=${session?.user?.email}`);
        const likedCommentIds: number[] = await likedRes.json();

        const updatedComments = data.map((c: Comment) => ({
            ...c,
            likedByUser: likedCommentIds.includes(c.id),
        }));

        setCommentsList(updatedComments);
        };

        fetchComments();
    }, [post, session, setCommentsList]);

    console.log(commentsList)

    const handleLikeComment = async (commentId: number) => {
        const comment = commentsList?.find(c => c.id === commentId);
        if (!comment) return;

        setCommentsList((prev: any[]) => {
            if (!prev) return []; // return an empty array if prev is null
            return prev.map(c =>
                c.id === commentId
                ? {
                    ...c,
                    likes: c.likedByUser ? c.likes - 1 : c.likes + 1 as number,
                    likedByUser: !c.likedByUser as boolean,
                    }
                : c
            );
        });

        if (comment.likedByUser) {
        await fetch(`http://localhost:8080/api/comments/${commentId}/like?email=${session?.user?.email}`, {
            method: "DELETE",
        });
        } else {
        await fetch(`http://localhost:8080/api/comments/${commentId}/like?email=${session?.user?.email}`, {
            method: "POST",
        });
        }
    };

    return (
        <div className="mt-4 border-t border-gray-300 pt-4">
        {commentsList?.length === 0 ? (
            <p>No comments yet</p>
        ) : (
            commentsList?.map(c => (
                
            <div key={c.id} className="p-4 m-4 border border-gray-300 shadow">
                <div className = "flex justify-between">
                    <p className="font-bold">{c.author}</p>
                    <p>{new Date(c.createdAt).toLocaleString()}</p>
                </div>
        
                <p className = "my-2 py-2">{c.text}</p>
                <div className="flex items-center space-x-2 space-y-2">
                    <button className = "text-xl transition-transform duration-200 hover:scale-150 cursor-pointer" onClick={() => handleLikeComment(c.id)}>👍</button>
                    <span className = "text-black">{c.likes}</span>
                </div>
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