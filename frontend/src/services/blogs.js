import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = 'Bearer ' + newToken;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const add = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, {
    headers: {
      Authorization: token,
    }
  });
  return response.data;
};

const update = async (blogToUpdate) => {
  const response = await axios.put(`${baseUrl}/${blogToUpdate.id}`, blogToUpdate, {
    headers: {
      Authorization: token,
    }
  });
  return response.data;
};

const remove = async (blogToRemove) => {
  await axios.delete(`${baseUrl}/${blogToRemove.id}`, {
    headers: {
      Authorization: token,
    }
  });
};

export default {
  setToken,
  getAll,
  add,
  update,
  remove,
};