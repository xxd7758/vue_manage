export default [
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/Welcome'),
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/Users'),
      },
      {
        path: '/rights',
        name: 'Right',
        component: () => import('@/views/Power/rights.vue'),
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/views/Power/roles.vue'),
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('@/views/goods/Goods.vue'),
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import('@/views/goods/Params.vue'),
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('@/views/goods/Categories.vue'),
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: () => import('@/views/goods/Add.vue'),
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/Orders'),
      },
    ],
  },
  { path: '/login', name: 'Login', component: () => import('@/views/Login') },
];
