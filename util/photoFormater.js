import fs from 'fs'
import sharp from 'sharp'

const photos = fs.readdirSync('./util/rawPhotos')

photos.forEach((photo, index) => {
  sharp(`./util/rawPhotos/${photo}`)
    .resize({
      width : 250,
      height: 250,
      fit   : 'inside'
    })
    .webp({quality: 25})
    .toFile(`./util/formatted/${index}.webp`)
})

photos.forEach((photo, index) => {
  sharp(`./util/rawPhotos/${photo}`)
    .resize({
      width : 1920,
      height: 1920,
      fit   : 'inside'
    })
    .webp({quality: 75})
    .toFile(`./util/hiRes/Hi_${index}.webp`)
})

