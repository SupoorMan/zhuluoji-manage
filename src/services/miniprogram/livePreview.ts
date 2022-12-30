import { request } from '@umijs/max';

/** 新增直播预告 POST /livePreview/add */
export async function addLivePreview(body: API.LivePreview, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/livePreview/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询直播预告详情 GET /livePreview/get */
export async function getLivePreview(params: API.IdParams, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/livePreview/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询直播预告 GET /livePreview/page */
export async function pageLivePreview(
  params: API.pageLiveParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/livePreview/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新直播预告 POST /livePreview/update */
export async function updateLivePreview(body: API.LivePreview, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/livePreview/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
