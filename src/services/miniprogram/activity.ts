import { request } from '@umijs/max';

/** 新增活动 POST /activity/add */
export async function addActivity(body: API.Activity, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/activity/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新活动 POST /activity/update */
export async function updateActivity(
  body: API.Activity & { deleteList?: [] },
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/activity/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页查询活动商品赠品 GET /activityProduct/page */
export async function pageActivity(
  params: API.pageActivityParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/activity/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 查询活动详情关系 GET /activityDetail/list */
export async function getActDetail(params: API.ActivityIdParams, options?: { [key: string]: any }) {
  return request<API.ListResult>('/activityDetail/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增活动详情关系 POST /activityDetail/add */
export async function addActDetail(body: API.ActivityDetail, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/activityDetail/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新活动详情关系 POST /activityDetail/update */
export async function updateActDetail(body: API.ActivityDetail, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/activityDetail/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
