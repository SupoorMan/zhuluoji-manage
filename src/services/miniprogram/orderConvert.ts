import { request } from '@umijs/max';

/** 新增订单兑换 POST /orderConvert/add */
export async function addConvert(body: API.OrderConvert, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orderConvert/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页查询 GET /orderConvert/page */
export async function pageConvert(params: API.pageConvertParams, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orderConvert/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新/审核 订单兑换 POST /orderConvert/update */
export async function updateConvert(body: API.OrderConvert, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orderConvert/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
