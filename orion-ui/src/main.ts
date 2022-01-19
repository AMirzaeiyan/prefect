import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import api from './plugins/api'

if (import.meta.env.VITE_PREFECT_USE_MIRAGEJS ?? false) {
  const { startServer } = await import('./server')

  startServer()
}

// Global components
import ButtonCard from '@/components/Global/ButtonCard/ButtonCard.vue'
import ButtonRounded from '@/components/Global/ButtonRounded/ButtonRounded.vue'
import BreadCrumbs from '@/components/Global/BreadCrumb/BreadCrumb.vue'
import Drawer from '@/components/Global/Drawer/Drawer.vue'
import List from '@/components/Global/List/List.vue'
import ListItem from '@/components/Global/List/ListItem/ListItem.vue'
import ListItemDeployment from '@/components/Global/List/ListItemDeployment/ListItemDeployment.vue'
import ListItemFlow from '@/components/Global/List/ListItemFlow/ListItemFlow.vue'
import ListItemFlowRun from '@/components/Global/List/ListItemFlowRun/ListItemFlowRun.vue'
import ListItemSubFlowRun from '@/components/Global/List/ListItemSubFlowRun/ListItemSubFlowRun.vue'
import ListItemTaskRun from '@/components/Global/List/ListItemTaskRun/ListItemTaskRun.vue'
import ResultsList from '@/components/Global/ResultsList/ResultsList.vue'
import Row from '@/components/Global/Row/Row.vue'
import RadarNode from '@/components/Radar/Nodes/Node.vue'
import RadarFlowRunNode from '@/components/Radar/Nodes/FlowRunNode.vue'
import RadarOverflowNode from '@/components/Radar/Nodes/OverflowNode.vue'
import StateIcon from '@/components/Global/StateIcon/StateIcon.vue'

import '@prefecthq/miter-design/dist/style.css'
import MiterDesign from '@prefecthq/miter-design'

import '@prefecthq/orion-design/dist/style.css'

import '@/styles/main.scss'

const storageKey = 'orion-color-mode'
const storedMode = localStorage.getItem(storageKey)?.toLowerCase()
const defaultClass = 'default-color-mode'
const colorMode = storedMode ? storedMode + '-color-mode' : defaultClass
document.body.classList.add(colorMode)

const app = createApp(App).use(MiterDesign).use(store).use(router).use(api)

app.component('ButtonCard', ButtonCard)
app.component('BreadCrumbs', BreadCrumbs)
app.component('ButtonRounded', ButtonRounded)
app.component('Drawer', Drawer)
app.component('List', List)
app.component('ListItem', ListItem)
app.component('ListItemDeployment', ListItemDeployment)
app.component('ListItemFlow', ListItemFlow)
app.component('ListItemFlowRun', ListItemFlowRun)
app.component('ListItemSubFlowRun', ListItemSubFlowRun)
app.component('ListItemTaskRun', ListItemTaskRun)
app.component('ResultsList', ResultsList)
app.component('Row', Row)
app.component('RadarNode', RadarNode)
app.component('RadarFlowRunNode', RadarFlowRunNode)
app.component('RadarOverflowNode', RadarOverflowNode)
app.component('StateIcon', StateIcon)

app.mount('#app')
