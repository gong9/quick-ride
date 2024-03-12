import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { createRoundLineWallMesh } from '../utils/createBoxGeometry'

const demoData = [
  [-23, 0, -14],
  [29, 0, -13],
  [27, 0, 24],
  [-23, 0, 23],
]
const CabinetEdge = () => {
  const { scene } = useThree()

  const mesh = createRoundLineWallMesh(demoData.map(item => new Vector3(item[0], item[1], item[2])), { radius: 0, close: true, height: 10 })
  scene.add(mesh)

  return null
}

export default CabinetEdge
