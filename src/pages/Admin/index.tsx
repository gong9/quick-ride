import type { FC } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

interface AdminProps {

}

const Admin: FC<AdminProps> = () => {
  return (
    <div className='h-[100vh] w-[100vw]'>
      <Canvas>
        <ambientLight />
        <OrbitControls/>
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='pink' />
        </mesh>
      </Canvas>
    </div>
  )
}

export default Admin
