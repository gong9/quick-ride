import type { DemoStoreType } from './demoStore'
import demoStore from './demoStore'

interface StoreType {
  demoStore: DemoStoreType
}

const useStore: StoreType = {
  demoStore,
}

export default useStore
