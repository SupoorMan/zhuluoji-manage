// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增收货地址 POST /appletDeliveryAddress/add */
export async function addAddr(body: API.AppletDeliveryAddress, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/appletDeliveryAddress/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询小程序用户收货地址 GET /appletDeliveryAddress/list */
export async function listAddr(options?: { [key: string]: any }) {
  return request<API.CommonResult>('/appletDeliveryAddress/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新收货地址 POST /appletDeliveryAddress/update */
export async function updateAddr(
  body: API.AppletDeliveryAddress,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/appletDeliveryAddress/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
