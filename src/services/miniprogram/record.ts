// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户登录记录分页查询 GET /loginLog/page */
export async function pageloginLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PageLoginLogParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/loginLog/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
