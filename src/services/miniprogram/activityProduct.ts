import { request } from '@umijs/max';

/** 新增活动商品赠品 POST /activityProduct/add */
export async function addActProd(body: API.ActivityProduct, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/activityProduct/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页查询活动商品赠品 GET /activityProduct/page */
export async function pageActProd(params: API.pageActProdParams, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/activityProduct/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新活动商品赠品 POST /activityProduct/update */
export async function updateActProd(body: API.ActivityProduct, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/activityProduct/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 活动商品 /activityProduct/delete */
export async function deleteActProd(params: API.IdParams, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/activityProduct/delete', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
