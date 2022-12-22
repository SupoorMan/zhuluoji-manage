// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 微信小程序退出 退出 POST /wx/auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.CommonResult>('/wx/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 微信小程序登录 微信登录获取OpenId,SessionKey,unionid POST /wx/login */
export async function login(body: API.WeChatLogin, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/wx/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
