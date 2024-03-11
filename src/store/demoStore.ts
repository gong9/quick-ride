import { create } from 'zustand'

/**
 * @file: demoStore.ts
 */
export interface DemoStoreProps {
  demo: number
  setDemo: (demo: number) => void

}

const demoStore = create<DemoStoreProps>(set => ({
  demo: 1,
  setDemo: demo => set({ demo }),
}))

export type DemoStoreType = typeof demoStore

export default demoStore
