// types.ts
export type Post = {
  id: number;
  author: string;
  content: string;
  imageURL: string | undefined,
  codeContent?: string,
  createdAt?: string;
  likes: number;
  comments: number;
}