import Vue from 'vue'
import Router from 'vue-router'
import Lines from '@/components/line/line'
import List from '@/page/visualize/list/list'
import DashboardList from '@/page/dashboard/list/list'
import Detail from '@/page/visualize/detail/detail'
import Edit from '@/page/visualize/edit/edit'
import DashboardEdit from '@/page/dashboard/edit/edit'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/line',
      name: 'Lines',
      component: Lines
    },
    {
      path: '/',
      name: 'List',
      component: List,
    },
    {
	  path: '/detail',
	  name: 'Detail',
	  component: Detail
	},
	{
	  path: '/edit',
	  name: 'Edit',
	  component: Edit
	},
	{
	  path: '/dashboardList',
	  name: 'DashboardList',
	  component: DashboardList
	},
	{
	  path: '/dashboardEdit',
	  name: 'DashboardEdit',
	  component: DashboardEdit
	},
	{
	  path: '/visualizeList',
	  name: 'List',
	  component: List
	}
  ]
})
