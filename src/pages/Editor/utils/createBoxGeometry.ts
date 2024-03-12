/* eslint-disable no-void */
import { BoxGeometry, BufferGeometry, Color, CurvePath, ExtrudeGeometry, Group, LineCurve3, Mesh, MeshBasicMaterial, QuadraticBezierCurve3, Quaternion, ShaderMaterial, Shape, Vector3 } from 'three'

export interface TextureParamsType {
  texture?: string
  repeatX?: number
  repeatY?: number
  wrapS?: number
  wrapT?: number
}

/**
 * TODO: 参数优化
 * create box geometry by two points
 * just provide data not create mesh
 * @param a
 * @param b
 * @param height
 * @param depth
 */
const createBoxGeometryByPoints = (a: Vector3, b: Vector3, height = 30, depth = 10, material?: ShaderMaterial) => {
  const width = a.distanceTo(b)
  const box = new BoxGeometry(width, height, depth)

  let currentMaterial: MeshBasicMaterial | ShaderMaterial = new MeshBasicMaterial({ color: new Color('#fff') })
  if (material)
    currentMaterial = material

  const mesh = new Mesh(box, currentMaterial)
  const midpoint = new Vector3().addVectors(a, b).multiplyScalar(0.5)

  mesh.position.x = midpoint.x
  mesh.position.y = midpoint.y + height / 2
  mesh.position.z = midpoint.z

  const direction = new Vector3()
  direction.subVectors(a, b)
  direction.normalize()

  const axis = new Vector3(0, 1, 0) // axis
  const angle = new Vector3(1, 0, 0).angleTo(direction)

  const quaternion = new Quaternion().setFromAxisAngle(axis, angle)
  const newDirection = new Vector3(1, 0, 0).applyQuaternion(quaternion)

  if (!newDirection.angleTo(direction))
    mesh.rotateOnAxis(axis, angle)
  else
    mesh.rotateOnAxis(axis, -angle)

  return mesh
}

/**
 * rectangle  shape
 * @param w
 * @param h
 * @returns
 */
const rectangle = (w = 0.1, h = 50) => {
  const shape = new Shape()

  shape.moveTo(0, 0)
  shape.lineTo(0, w)
  shape.lineTo(h, w)
  shape.lineTo(h, 0)
  shape.lineTo(0, 0)

  return shape
}

const defMaterial = new ShaderMaterial({
  uniforms: {
    u_color: { value: new Color('#fab73f') },
    u_height: { value: 100 },
    u_opacity: { value: 1.0 },
  },

  vertexShader: `
        uniform float u_height;
        uniform float u_speed;
        varying float v_opacity;

        void main() {
          v_opacity = mix(1.0, 0.0, position.y / u_height);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
  fragmentShader: `
        uniform vec3 u_color;
        uniform float u_opacity;
        varying float v_opacity;

        void main() {
          gl_FragColor = vec4(u_color, 1.0);
        }
  `,
  transparent: true,
  side: 2,
  depthTest: false,
})

// const material = new MeshBasicMaterial({ color: new Color('#fab73f'), side: DoubleSide })

/**
 * create round curve
 * @param points
 * @param radius
 * @param close
 * @returns
 */
const createCurve = (points: Vector3[], radius = 20, height = 50, close = false, material?: ShaderMaterial) => {
  if (!material)
    material = defMaterial

  const curve = new CurvePath()
  const shape = rectangle(0.1, height)

  if (points.length < 2)
    throw new Error('At least two points are required to create a curve')

  if (points.length === 2) {
    const line = new LineCurve3(points[0], points[1])
    curve.curves.push(line)

    return curve
  }

  const lines = []

  for (let i = 0; i < points.length - 1; i++) {
    if (i === 0) {
      const dir = points[0].clone().sub(points[1]).normalize()
      const realEndPoints = points[1].clone().add(dir.multiplyScalar(radius))

      let firstPoint = points[0]

      if (close)
        firstPoint = points[0].clone().add(points[1].clone().sub(points[0]).normalize().multiplyScalar(radius))

      lines.push(new LineCurve3(firstPoint, realEndPoints))
    }
    else if (i === points.length - 1) {
      //
    }
    else {
      const dir1 = points[i - 1].clone().sub(points[i]).normalize()
      const dir2 = points[i + 1].clone().sub(points[i]).normalize()
      const dir3 = points[i].clone().sub(points[i + 1]).normalize()

      const nextDir1 = dir2.clone()
      const nextDir2 = points[i].clone().sub(points[i + 1]).normalize()

      const p1 = points[i].clone().add(dir1.multiplyScalar(radius))
      const p2 = points[i].clone()
      const p3 = points[i].clone().add(dir2.multiplyScalar(radius))

      const beziercurve = new QuadraticBezierCurve3(p1, p2, p3)

      const realLastPoints = points[i].clone().add(nextDir1.multiplyScalar(radius))
      const realEndPoints = points[i + 1].clone().add(nextDir2.multiplyScalar(radius))

      lines.push(beziercurve)
      lines.push(new LineCurve3(realLastPoints, i + 1 === points.length - 1
        ? close
          ? points[i + 1].clone().add(dir3.multiplyScalar(radius))
          : points[i + 1]
        : realEndPoints))
    }
  }

  if (close) {
    // first point
    const dir1 = points[1].clone().sub(points[0]).normalize()
    const dir2 = points[points.length - 1].clone().sub(points[0]).normalize()

    const p1 = points[0].clone().add(dir1.multiplyScalar(radius))
    const p2 = points[0]
    const p3 = points[0].clone().add(dir2.multiplyScalar(radius))

    const beziercurve = new QuadraticBezierCurve3(p3, p2, p1)

    // last point
    const dir3 = points[0].clone().sub(points[points.length - 1]).normalize()
    const dir4 = points[points.length - 2].clone().sub(points[points.length - 1]).normalize()

    const p4 = points[points.length - 1].clone().add(dir3.multiplyScalar(radius))
    const p5 = points[points.length - 1]
    const p6 = points[points.length - 1].clone().add(dir4.multiplyScalar(radius))

    const beziercurve2 = new QuadraticBezierCurve3(p6, p5, p4)

    // last line
    const laseLine = new LineCurve3(p4, p3)

    lines.push(beziercurve2)
    lines.push(laseLine)
    lines.push(beziercurve)
  }

  const group = new Group()

  lines.forEach((line) => {
    curve.curves.push(line)

    if (line.type === 'QuadraticBezierCurve3') {
      const extrudeSettings = {
        steps: 100,
        bevelEnabled: false,
        extrudePath: line,
      }

      const geometry = new ExtrudeGeometry(shape, extrudeSettings)
      const arcWall = new Mesh(geometry, material)

      arcWall.translateY(arcWall.position.y + height)

      if (radius)
        group.add(arcWall)
    }
    else {
      const mesh = createBoxGeometryByPoints(line.v1, line.v2, height, 0.1, material)
      group.add(mesh)
    }
  })

  return [curve, group] as any
}

interface RoundLineGeometryOption {
  radius: number
  close: boolean
  pointNum?: number
  height?: number
}

class RoundLineGeometry extends BufferGeometry {
  constructor(points: Vector3[], option: RoundLineGeometryOption) {
    super()

    const [curve] = createCurve(points, option.radius ?? 20, void 0, option.close || false)
    const currentPoints = curve.getPoints(option.pointNum || 1000)

    const geometry = new BufferGeometry()
    geometry.setFromPoints(currentPoints)

    return geometry
  }
}

const createRoundLineWallMesh = (points: Vector3[], option: RoundLineGeometryOption, material?: ShaderMaterial) => {
  const [_, group] = createCurve(points, option.radius ?? 20, option.height ?? 50, option.close || false, material)

  return group
}

export {
  RoundLineGeometry,
  createRoundLineWallMesh,
}
