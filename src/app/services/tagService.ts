export const createTag = async (data: any) => {
  const res = await fetch(`/api/admin/tag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data }),
  });
  return await res.json();
};

export const updateTag = async (data: any) => {
  const res = await fetch(`/api/admin/tag`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data }),
  });
  return await res.json();
};

export const findAllTags = async (active: Boolean | null) => {
  const res = await fetch(`/api/public/tag?active=${active}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};

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

export const deleteTag = async (id: any) => {
  const res = await fetch(
    `/api/admin/tag?` +
      new URLSearchParams({
        id: id,
      }),
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return await res.json();
};

//################### API V2
export const findAllTagsV2 = async (session: any, req: any) => {
  const host = req.headers.host;
  // console.log(session);
  // console.log('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  const res = await fetch(`http://${host}/api/admin/tag`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${session?.accessToken}`,
    },
  });
  return await res.json();
};
