import { useState, useEffect, useRef } from 'react';

import blogService from './services/blogs';
import loginService from './services/login';

import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [ user, setUser ] = useState(null);
  const [ blogs, setBlogs ] = useState([]);

  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ info, setInfo ] = useState({ message: null });

  const blogFormRef = useRef();

  const updateList = () => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs.toSorted((a, b) => b.likes - a.likes)));
  };

  useEffect(updateList, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedUser');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const notifyMessage = (message, type='info') => {
    setInfo({ message, type });
    setTimeout(() => setInfo({ message: null }), 3000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      notifyMessage(`welcome, ${user.name}`);
    } catch (exception) {
      notifyMessage(exception.response.data.error, 'error');
    }

    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    blogService.setToken('');
    notifyMessage('you are successfully logged out');
  };

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const newBlog = await blogService.add(blogObject);
      setBlogs(blogs.concat(newBlog));
      notifyMessage(`a new blog ${newBlog.title} added`);
      updateList();
    } catch (exception) {
      notifyMessage(exception.response.data.error, 'error');
    }
  };

  const loginForm = () => {
    return (
      <>
        <h2>Log into Bloglist</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={event => setUsername(event.target.value)}
              data-testid="username"
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={event => setPassword(event.target.value)}
              data-testid="password"
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    );
  };

  const handleLikes = (blog) => async () => {
    const blogToUpdate = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    };
    await blogService.update(blogToUpdate);
    updateList();
  };

  const handleRemove = (blog) => async () => {
    if (window.confirm('Remove blog ' + blog.title)) {
      await blogService.remove(blog);
      updateList();
    }
  };

  const bloglistForm = () => {
    return (
      <>
        <h2>Bloglist</h2>
        <p>
          {user.name} is logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        {blogs.map(b => <Blog
          key={b.id}
          blog={b}
          update={handleLikes(b)}
          canRemove={b.user.username === user.username}
          remove={handleRemove(b)}
        />)}
        <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      </>
    );
  };

  return (
    <>
      <Notification info={info} />
      {user === null ? loginForm() : bloglistForm()}
    </>
  );
};

export default App;