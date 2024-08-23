import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

describe('title and author only', () => {
  let blog;

  beforeEach(() => {
    blog = {
      title: 'Canonical string reduction',
      author: 'Edsget W. Dijkstra',
      user: {
        id: 'somerandomid',
        name: 'tester',
      },
    };
  });

  test('render short blog', () => {
    render(<Blog blog={blog} />);

    const element = screen.getByText('Canonical string reduction - Edsget W. Dijkstra');

    expect(element).toBeDefined();
  });

  test('render full blog', async () => {
    render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const element1 = screen.getByText('Canonical string reduction - Edsget W. Dijkstra', {
      exact: false
    });

    const element2 = screen.getByText('tester', {
      exact: false
    });

    expect(element1).toBe(element2);
  });
});

describe('all data blog', () => {
  let blog;

  beforeEach(() => {
    blog = {
      title: 'Canonical string reduction',
      author: 'Edsget W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 24,
      user: {
        id: 'somerandomid',
        username: 'tester',
        name: 'tester',
      },
    };
  });

  test('render full blog', async () => {
    render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const element1 = screen.getByText('Canonical string reduction - Edsget W. Dijkstra', {
      exact: false
    });

    const element2 = screen.getByText('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', {
      exact: false
    });

    expect(element1).toBeDefined();
    expect(element2).toBeDefined();
  });

  test('press like button twice', async () => {
    const mockHandler = vi.fn();

    render(<Blog blog={blog} update={mockHandler} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const likesButton = screen.getByText('like');
    await user.click(likesButton);
    await user.click(likesButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});