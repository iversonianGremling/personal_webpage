import React from 'react';

interface Props {
  id: number;
  title: string;
  content: string;
  tags: string[];
  image?: string;
  date: string;
  type: string;
}

const PostCard: React.FC<Props> = ({
  id,
  title,
  content,
  tags,
  image,
  date,
  type,
}) => {
  return (
    <a className="post-card bg-violet-950 text-white flex flex-col justify-left items-left mb-3 transition-colors duration-300 hover:bg-yellow-300 py-6 hover:text-black">
      {type === 'blog' &&
      <>
        <div className="flex flex-row ml-6 my-4">
          <div>
            <div className="title text-4xl text-left ">{title}</div>
            <div className="flex flex-row">
              <div className="date text-3xl  my-2 mr-2">{date}</div>
              <div className="tags mt-3 mb-4 ">{tags.map((tag, i) => <a className="tag m-1 p-2 border-2 border-black rounded-lg mt-2 transition-colors hover:bg-red-600 hover:text-white select-none"key={i}>{tag}</a>)}</div>
            </div>
          </div>
        </div>
        <div className="max-w-64">
        </div>

        {image && <img src={image} alt={`Image ${id}`} className="w-1/2 justify-center mx-auto" loading="lazy" />}
        <div className="flex flex-row mx-6">
          <div className="content text-lg text-justify tracking-wide leading-relaxed">{content}</div>
        </div>
      </>
      }
    </a>
  );
};

export default PostCard;
