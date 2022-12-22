// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建订单第一步 点击兑换触发 POST /orders/add0 */
export async function addOrder(body: API.Order, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orders/add0', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建订单第二步 确认兑换触发 POST /orders/add1 */
export async function addOrder2(body: API.Order, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orders/add1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 取消订单 传订单id即可 POST /orders/cancel */
export async function cancelOrder(body: API.Order, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orders/cancel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 订单分页 GET /orders/page */
export async function getOrders(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageOrderParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/orders/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新订单收货地址 传id和地址即可 POST /orders/updateAddress */
export async function updateOrderAddr(body: API.Order, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orders/updateAddress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 订单发货中 传id和status即可 POST /orders/updateStatus */
export async function updateStatus(body: API.Order, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/orders/updateStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
