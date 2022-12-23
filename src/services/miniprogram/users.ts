// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户信息 无参 GET /auser/getUser */
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.CommonResult>('/auser/getUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 小程序用户分页查询 后台管理使用 GET /auser/page */
export async function pageUserInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PageUserInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/auser/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 小程序用户更新 传id和需要更新的字段即可 POST /auser/update */
export async function updateUser(body: API.AppletUser, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/auser/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
