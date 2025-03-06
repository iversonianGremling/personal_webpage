interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  image: string;
  date: string;
  type: string;
  visibility: string;
  views: number;
  comments: Comment[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  ipAddress: string;
  isBanned: boolean;
  createdAt: Date;
  post?: Post; // Optional since you might not always need the related post
  postId?: number; // Optional ID reference, useful for creation
}

// For admin dashboard/moderation views
export interface CommentWithPost extends Comment {
  post: Post;
}

// For creation
export interface CreateCommentDto {
  content: string;
  postId: number;
}

export default Post;
