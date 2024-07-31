const endpoints = {
  users: {
    login: '/users/login',
    info: '/users/info',
    first_login: '/users/first_login',
    store_info: '/users/store_info',
  },
  notice: {
    list: '/notice/list',
    info: '/notice/info',
    send_file_link: '/notice/send_file_link',
  },
  order: {
    list: '/order/list',
    table: '/order/table',
    info: '/order/info',
    error: '/order/error',
    orderChecked: '/order/orderChecked',
    orderProductChecked: 'order/orderProductChecked',
    tableReset: '/order/tableReset',
  },
  category: {
    list: '/category/list',
    update: '/category/update',
  },
  goods: {
    list: '/goods/list',
    info: '/goods/info',
    update: '/goods/update',
  },
  option: {
    info: '/option/info',
    update: '/option/update',
    language: '/option/language',
  },
  dashboard: { masterDashboard: '/masterDashboard' },
  message: {
    create: '/message/create',
    update: '/message/update',
    list: '/message/list',
    info: '/message/info',
    delete: '/message/delete',
  },
  quick: {
    info: '/quick/info',
    update: '/quick/update',
  },
  happyTalk: { req: '/happyTalk/req' },
};

export default endpoints;
