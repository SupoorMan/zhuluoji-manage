import { request } from '@umijs/max';

/** 新增侏罗纪的家 POST /zhuluojiHome/add */
export async function addHome(body: API.Home | API.Home[], options?: { [key: string]: any }) {
  console.log(body);
  return request<API.CommonResult>('/zhuluojiHome/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询侏罗纪的家详情 GET /zhuluojiHome/detail */
export async function getHomeDetail(params: API.IdParams, options?: { [key: string]: any }) {
  return request<API.ListResult>('/zhuluojiHome/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询侏罗纪的家 GET /zhuluojiHome/page */
export async function pageHome(params: API.pageHomeParams, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/zhuluojiHome/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新侏罗纪的家 POST /zhuluojiHome/update */
export async function updateHome(
  body: { deleteList?: string[]; home: API.Home[] },
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/zhuluojiHome/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
