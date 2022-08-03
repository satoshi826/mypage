import getPhotoList from './photoList'
import Photo from '../../mesh/Photo'
// import img from './test.jpg'

export default function Gallery() {

  const photoList = getPhotoList()
  const photoListLength = photoList.length

  return (
    <group>
      {photoList.map((photo, index) =>
        <Photo url={photo.path} position = {calcPosition(index, photoListLength)} rotation={calcRotation(index, photoListLength)} key={index}/>
      )}
    </group>
  )
}

function calcPosition(index, photoListLength) {
  const r = 40
  const unitAngle = 2 * Math.PI / photoListLength
  return(
    [
      r * Math.cos(index * unitAngle),
      5,
      r * Math.sin(index * unitAngle),
    ]
  )
}

function calcRotation(index, photoListLength) {
  const unitAngle = 2 * Math.PI / photoListLength
  return(
    [
      0,
      Math.PI / 2 - index * unitAngle,
      0,
    ]
  )
}