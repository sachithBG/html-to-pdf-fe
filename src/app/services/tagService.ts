import { API } from "./api";

export const createTag = async (data: any, token: string) => {
  return API.post(`/tags`, data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
}

export const updateTag = async (editTag: any, token: string) => {
  return API.put('/tags/' + editTag.id, editTag, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const findTagById = async (id: any, token: string) => {
  return API.get('/tags/' + id, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const findAllTags = async (addon_ids: number[], organization_id: number,token: string) => {
  // const queryParams = new URLSearchParams({ addon_ids: JSON.stringify(addon_ids) }).toString();
  return API.get(`/tags`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      addon_ids: addon_ids,
      organization_id: organization_id
    }
  });
}

export const findTagPage = async (
  page: number,
  pageSize: number,
  field: string,
  sort: string,
  quickFilterValues: string,
  active: boolean
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
  return API.delete('/tags/' + id, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
