import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div className='formDiv'>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder='title'
          />
        </div>
        <div>
          <input
            value={author}
            onChange={event => setAuthor(event.target.value)}
            placeholder='author'
          />
        </div>
        <div>
          <input
            value={url}
            onChange={event => setUrl(event.target.value)}
            placeholder='url'
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;