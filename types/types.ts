// types.ts
export type Post = {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  createdAt?: string;
}