// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增商品规格 POST /amount/add */
export async function addProdSpecs(body: API.ProductSpecs, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/amount/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询商品规格 GET /amount/list */
export async function listProdSpecs(params: API.ProdIdParams, options?: { [key: string]: any }) {
  return request<API.ListResult>('/amount/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新商品规格 POST /amount/update */
export async function updateProdSpecs(body: API.ProductSpecs, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/amount/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
