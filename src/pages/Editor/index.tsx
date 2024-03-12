import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BottomSurface from './unit/BottomSurface'
import CabinetEdge from './unit/CabinetEdge'

const Editor = () => {
  return (
    <div className='h-[100vh] w-[100vw]'>
      <Canvas camera={{ position: [0, 10, 10], fov: 75 }}>
        <ambientLight />
        <OrbitControls/>
        <BottomSurface/>
        <CabinetEdge/>
      </Canvas>
    </div>
  )
}

export default Editor
