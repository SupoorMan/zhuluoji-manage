import { request } from '@umijs/max';

/** 新增banner POST /banner/add */
export async function addBanner(body: API.Banner, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/banner/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询banner GET /banner/list */
export async function listBanner(options?: { [key: string]: any }) {
  return request<API.CommonResult>('/banner/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新banner POST /banner/update */
export async function updateBanner(body: API.Banner, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/banner/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 删除轮播图 POST /banner/delete */
export async function deleteBanner(body: API.Banner, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/banner/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
