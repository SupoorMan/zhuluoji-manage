// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询签到集合 GET /signIn/list */
export async function listSignIn(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ListSignInParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/signIn/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 签到 POST /signIn/sign */
export async function signDay(options?: { [key: string]: any }) {
  return request<API.CommonResult>('/signIn/sign', {
    method: 'POST',
    ...(options || {}),
  });
}
