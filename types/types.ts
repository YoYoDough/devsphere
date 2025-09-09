// types.ts
export type Comment = {
  id: number;
  text: string;
  author: string;
  createdAt: string;
};
export type Post = {
  id: number;
  author: string;
  content: string;
  imageURL: string | undefined,
  codeContent?: string,
  createdAt?: string;
  likes: number;
  commentsCount: number;   // count
  commentsList?: Comment[]; // optional for when full comments are included
}