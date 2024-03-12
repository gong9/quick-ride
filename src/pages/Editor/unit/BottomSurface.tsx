import type { ThreeEvent } from '@react-three/fiber'

const BottomSurface = () => {
  const handlePlaneClick = (e: ThreeEvent<MouseEvent>) => {
    console.log('plane clicked', [~~e.point.x.toFixed(2), ~~e.point.y.toFixed(2), ~~e.point.z.toFixed(2)])
  }

  return (
    <mesh onClick={handlePlaneClick} rotation={[-Math.PI / 2, 0, 0]} >
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color='lightblue' />
    </mesh>
  )
}

export default BottomSurface
