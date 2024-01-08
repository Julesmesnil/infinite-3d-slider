import { Vector3, Box3 } from 'three'

export default function getSize (mesh, precise) {
  const target = new Vector3()

  new Box3().setFromObject(mesh, precise).getSize(target)

  return target
}