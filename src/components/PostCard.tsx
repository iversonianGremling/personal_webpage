import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${id}`);
  };

  return (
    <a
      onClick={handleClick}
      className="post-card bg-violet-950 text-white flex flex-col justify-left items-left mb-3 transition-colors duration-300 hover:bg-yellow-300 py-6 hover:text-black cursor-pointer pr-72"
    >
      {type === 'blog' && (
        <>
          <div className="flex flex-column ml-6 my-4">

            <div className="date text-3xl mr-6  text-white content-center  flex flex-col text-center ">
              {date.split('-').reverse().map((num, i) => (
                i === 0 ? <span className='text-6xl' key={i}>{num}</span> :
                  i === 1 ? <span className='text-3xl' key={i}>{num}</span> :
                    <span className='text-xl' key={i}>{num.slice(2,4)}</span>
              ))}
            </div>
            <div className='flex flex-col'>
              <div className="title text-3xl text-left">{title}</div>
              <div className="flex flex-row">
                <div className="tags mt-3 mb-4">
                  {tags.map((tag, i) => (
                    <a
                      className="tag m-1 p-1 border-2 border-black  mt-2 transition-colors hover:bg-red-600 hover:text-white select-none text-sm"
                      key={i}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-row ">
                <div className="content text-md text-justify tracking-wide leading-relaxed">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </a>
  );
};

export default PostCard;
