import { GlobalFilter } from '@/typings/global'
import {
  FlowsFilter,
  DeploymentsFilter,
  FlowRunsFilter,
  TaskRunsFilter
} from '@/plugins/api'
import { State } from '.'
import { GetterTree } from 'vuex'

export type UnionFilter = FlowFilter &
  DeploymentFilter &
  FlowRunFilter &
  TaskRunFilter
export type UnionFilters =
  | FlowsFilter
  | DeploymentsFilter
  | FlowRunsFilter
  | TaskRunsFilter

export interface Getters extends GetterTree<State, any> {
  start(state: State): Date
  end(state: State): Date
  globalFilter(state: State): GlobalFilter
  baseFilter(state: State): (object: string) => UnionFilter
  composedFilter(state: State, getters: GetterTree<State, Getters>): UnionFilter
}

export const start = (state: State): Date => {
  const timeframe = state.globalFilter.flow_runs.timeframe?.from
  if (!timeframe) return new Date()
  if (timeframe.timestamp) return timeframe.timestamp
  if (timeframe.unit && timeframe.value) {
    const date = new Date()

    switch (timeframe.unit) {
      case 'minutes':
        date.setMinutes(date.getMinutes() - timeframe.value)
        break
      case 'hours':
        date.setHours(date.getHours() - timeframe.value)
        break
      case 'days':
        date.setDate(date.getDate() - timeframe.value)
        break
      default:
        break
    }

    return date
  }
  throw new Error('There was an issue calculating start time in the store.')
}

export const end = (state: State): Date => {
  const timeframe = state.globalFilter.flow_runs.timeframe?.to
  if (!timeframe) return new Date()
  if (timeframe.timestamp) return timeframe.timestamp
  if (timeframe.unit && timeframe.value) {
    const date = new Date()

    switch (timeframe.unit) {
      case 'minutes':
        date.setMinutes(date.getMinutes() + timeframe.value)
        break
      case 'hours':
        date.setHours(date.getHours() + timeframe.value)
        break
      case 'days':
        date.setDate(date.getDate() + timeframe.value)
        break
      default:
        break
    }

    return date
  }
  throw new Error('There was an issue calculating start time in the store.')
}

export const baseInterval = (state: State, getters: any): number => {
  return Math.floor(
    (getters.end.getTime() - getters.start.getTime()) / 1000 / 30
  )
}

export const globalFilter = (state: State): GlobalFilter => state.globalFilter

type GlobalFilterKeys = 'flows' | 'deployments' | 'flow_runs' | 'task_runs'
const keys: GlobalFilterKeys[] = [
  'flows',
  'deployments',
  'flow_runs',
  'task_runs'
]

const timeKeys: { [key: string]: 'start_time' | 'expected_start_time' } = {
  task_runs: 'start_time',
  flow_runs: 'expected_start_time'
}

export const baseFilter =
  (state: State) =>
  (object: GlobalFilterKeys): UnionFilter => {
    const timeKey: keyof UnionFilter = timeKeys[object]
    const val: UnionFilter = {
      id: undefined,
      name: undefined,
      tags: undefined,
      [timeKey]: undefined
    }

    if (
      state.globalFilter[object]?.ids &&
      state.globalFilter[object]?.ids?.length
    ) {
      val.id = { any_: state.globalFilter[object].ids }
    }

    if (
      state.globalFilter[object]?.names &&
      state.globalFilter[object]?.names?.length
    ) {
      val.name = { any_: state.globalFilter[object].names }
    }

    if (
      state.globalFilter[object]?.tags &&
      state.globalFilter[object]?.tags?.length
    ) {
      val.tags = { all_: state.globalFilter[object].tags }
    }

    // Only add state and timeframe filters for flow run and task run objects
    if (object == 'flow_runs' || object == 'task_runs') {
      const from = state.globalFilter[object]?.timeframe?.from
      const to = state.globalFilter[object]?.timeframe?.to
      const fromExists = from && ((from.value && from.unit) || from.timestamp)
      const toExists = to && ((to.value && to.unit) || to.timestamp)

      if (fromExists || toExists) {
        val[timeKey] = {
          before_: undefined,
          after_: undefined
        }
      }

      if (fromExists && from.timestamp) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        val[timeKey]!.after_ = from.timestamp.toISOString()
      }

      if (fromExists && from.value && !from.timestamp) {
        const date = new Date()

        switch (from.unit) {
          case 'minutes':
            date.setMinutes(date.getMinutes() - from.value)
            break
          case 'hours':
            date.setHours(date.getHours() - from.value)
            break
          case 'days':
            date.setDate(date.getDate() - from.value)
            break
          default:
            break
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        val[timeKey]!.after_ = date.toISOString()
      }

      if (toExists && to.timestamp) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        val[timeKey]!.before_ = to.timestamp.toISOString()
      }

      if (toExists && to.value && !to.timestamp) {
        const date = new Date()

        switch (to.unit) {
          case 'minutes':
            date.setMinutes(date.getMinutes() + to.value)
            break
          case 'hours':
            date.setHours(date.getHours() + to.value)
            break
          case 'days':
            date.setDate(date.getDate() + to.value)
            break
          default:
            break
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        val[timeKey]!.before_ = date.toISOString()
      }

      const states = state.globalFilter[object]?.states

      if (states && states.length) {
        // TODO: This is hacky and not easy to maintain the more we use it;
        // once we have a way to query for user-defined states in the API
        // we should use those values as the basis for when to query for names vs. types
        const namedStates = ['Late', 'Crashed']
        val['state'] = {}

        const stateTypes: string[] = []
        const stateNames: string[] = []

        states.forEach((state) => {
          if (namedStates.includes(state.name)) stateNames.push(state.name)
          else stateTypes.push(state.type)
        })

        if (stateTypes.length > 0) {
          val['state'].type = { any_: stateTypes }
        }

        if (stateNames.length > 0) {
          val['state'].name = { any_: stateNames }
        }
      }
    }

    Object.entries(val).forEach(([key, value]) => {
      if (!value) delete val[key as keyof UnionFilter]
    })

    return val
  }

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const composedFilter = (state: State, getters: any): UnionFilters => {
  const val: FlowsFilter | DeploymentsFilter | FlowRunsFilter | TaskRunsFilter =
    {}

  keys.forEach((k) => {
    const filter = getters.baseFilter(k)
    if (Object.keys(filter).length > 0) {
      val[k] = filter
    }
  })

  return { ...val }
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
