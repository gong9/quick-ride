const router = [
  {
    name: 'editor',
    path: '/',
    component: '@/layout',
    routes: [
      { path: '', component: '@/pages/Editor' },
    ],
  },
]

export default router
