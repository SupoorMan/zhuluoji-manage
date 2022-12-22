// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增商品收藏 POST /productStater/add */
export async function addCollection(body: API.ProductStater, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/productStater/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除商品收藏 POST /productStater/delete */
export async function deleteCollection(body: API.ProductStater, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/productStater/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新商品收藏 POST /productStater/update */
export async function updateCollection(body: API.ProductStater, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/productStater/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
