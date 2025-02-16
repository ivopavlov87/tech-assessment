const fs = require('fs')

const jsonReader = (filePath, cb) => {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err)
    }
    try {
      const object = JSON.parse(fileData)
      return cb && cb(null, object)
    } catch(err) {
      return cb && cb(err)
    }
  })
}

module.exports = jsonReader;