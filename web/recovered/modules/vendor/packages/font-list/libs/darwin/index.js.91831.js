/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */



const path = __webpack_require__(85622)
const execFile = __webpack_require__(63129).execFile

const bin = path.join(__dirname, 'fontlist')
const font_exceptions = ['iconfont']

function tryToGetFonts(s) {
  let fonts = []
  let m = s.match(/\(([\s\S]+)\)/)
  if (m) {
    fonts = m[1].split('\n')
      .map(i => i.trim())
      .map(i => i.replace(/,$/, ''))
  }

  return fonts
}

module.exports = () => new Promise((resolve, reject) => {
  execFile(bin, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      reject(error)
      return
    }

    let fonts = []
    if (stdout) {
      fonts = fonts.concat(tryToGetFonts(stdout))
    }
    if (stderr) {
      fonts = fonts.concat(tryToGetFonts(stderr))
    }

    fonts = Array.from(new Set(fonts))
      .filter(i => i && !font_exceptions.includes(i))

    resolve(fonts)
  })
})


//# sourceURL=webpack://qqmusic/./node_modules/font-list/libs/darwin/index.js?