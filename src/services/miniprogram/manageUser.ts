import { request } from '@umijs/max';

/** 新增系统后台用户 GET /manageUser/add */
export async function addUser(body: API.ManageUser, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/manageUser/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 系统后台登录 POST /manageUser/login */
export async function login(body: API.ManageUser, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/manageUser/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 系统用户分页查询 GET /manageUser/page */
export async function pageUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/manageUser/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新系统后台用户 GET /manageUser/update */
export async function updateUser(body: API.ManageUser, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/manageUser/update', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
