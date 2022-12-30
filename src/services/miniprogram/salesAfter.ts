// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 售后申请 POST /afterSales/add */
export async function addAfterSals(body: API.AfterSales, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/afterSales/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 售后详情查询 传id参数 GET /afterSales/get */
export async function getSalesDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.IdParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/afterSales/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 售后分页查询 GET /afterSales/page */
export async function pageAfterSales(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PageAfterSalesParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/afterSales/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 售后处理更新 POST /afterSales/update */
export async function updateSales(body: API.AfterSales, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/afterSales/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
