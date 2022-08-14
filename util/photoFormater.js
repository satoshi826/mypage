import fs from 'fs'
import sharp from 'sharp'

const photos = fs.readdirSync('./util/rawPhotos')

photos.forEach((photo, index) => {
  sharp(`./util/rawPhotos/${photo}`)
    .resize({
      width : 360,
      height: 360,
      fit   : 'inside'
    })
    .webp({quality: 30})
    .toFile(`./util/formatted/${index}.webp`)
})

