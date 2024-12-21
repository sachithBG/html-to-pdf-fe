import { baseURL } from "./api";

export const createTag = async (data: any, token: string) => {
  const res = await fetch(`${baseURL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: data }),
  });
  return await res.json();
}

export const updateTag = async (data: any, token: string) => {
  const res = await fetch(`${baseURL}/tags`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: data }),
  });
  return await res.json();
}

export const findTagById = async (id: any, token: string) => {
  const res = await fetch(`${baseURL}/tags/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

export const findAllTags = async (addon_ids: Number[], token: string) => {
  const queryParams = new URLSearchParams({ addon_ids: JSON.stringify(addon_ids) }).toString();
  const res = await fetch(`${baseURL}/tags?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

export const findTagPage = async (
  page: Number,
  pageSize: Number,
  field: String,
  sort: String,
  quickFilterValues: String,
  active: Boolean
) => {
  const res = await fetch(`/api/public/tag/page`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page,
      pageSize,
      field,
      sort,
      quickFilterValues,
      active,
    }),
  });
  return await res.json();
};

export const deleteTag = async (id: any, token: string) => {
  const res = await fetch(`${baseURL}/tags/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}
