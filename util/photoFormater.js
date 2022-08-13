import sharp from 'sharp'

sharp('./util/DSC00069.JPG')
  .resize({
    width : 1000,
    height: 1000,
    fit   : 'inside'
  })
  .webp({quality: 70})
  .toFile('output.webp')