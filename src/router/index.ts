const router = [
  {
    name: 'demo',
    path: '/',
    component: '@/layout',
    routes: [
      { path: '', component: '@/pages/Admin' },
    ],
  },
]

export default router
