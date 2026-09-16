/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */



const methods = [
  __webpack_require__(71794),
  __webpack_require__(47491)
]

module.exports = async () => {
  let fonts = []

  for (let method of methods) {
    try {
      fonts = await method()
      break
    } catch (e) {
      console.log(e)
    }
  }

  return fonts
}


//# sourceURL=webpack://qqmusic/./node_modules/font-list/libs/win32/index.js?