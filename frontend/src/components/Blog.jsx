import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, update, canRemove, remove }) => {
  const [full, setFull] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  };

  const toggleView = () => setFull(!full);

  const shortView = () => {
    return (
      <>
        {blog.title} - {blog.author}
        <button onClick={toggleView}>view</button>
      </>
    );
  };

  const fullView = () => {
    return (
      <>
        {blog.title} - {blog.author}
        <button onClick={toggleView}>hide</button><br />
        {blog.url !== undefined ?
          <>
            <a href={blog.url}>{blog.url}</a><br />
          </>
          : ''}
        {blog.likes !== undefined ?
          <>
            likes {blog.likes}
            <button onClick={update}>like</button><br />
          </>
          : ''}
        {blog.user.name}<br />
        {canRemove ? <button onClick={remove}>remove</button> : ''}
      </>
    );
  };

  return (
    <div style={blogStyle} data-testid='blog'>
      {full ? fullView() : shortView()}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  }),
  update: PropTypes.func,
  canRemove: PropTypes.bool,
  remove: PropTypes.func,
};

export default Blog;