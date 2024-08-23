import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('update form fields and call onSubmit', async () => {
  const blog = {
    title: 'Canonical string reduction',
    author: 'Edsget W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  };

  const addBlog = vi.fn((object) => object);

  render(<BlogForm createBlog={addBlog} />);

  const inputTitle = screen.getByPlaceholderText('title');
  const inputAuthor = screen.getByPlaceholderText('author');
  const inputUrl = screen.getByPlaceholderText('url');

  const user = userEvent.setup();
  await user.type(inputTitle, blog.title);
  await user.type(inputAuthor, blog.author);
  await user.type(inputUrl, blog.url);

  const addButton = screen.getByText('add');
  await user.click(addButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  assert.deepEqual(addBlog.mock.calls[0][0], blog);
});