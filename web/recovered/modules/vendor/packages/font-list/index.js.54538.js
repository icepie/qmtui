/**
 * @author oldj
 * @blog http://oldj.net
 */



const for_darwin = __webpack_require__(91831)
const for_win32 = __webpack_require__(96602)
const for_linux = __webpack_require__(97513)

const platform = process.platform

const defaultOptions = {
  disableQuoting: false
}

exports.getFonts = async (options) => {
  options = Object.assign({}, defaultOptions, options)

  let fonts

  if (platform === 'darwin') {
    fonts = await for_darwin()

  } else if (platform === 'win32') {
    fonts = await for_win32()

  } else if (platform === 'linux') {
    fonts = await for_linux()

  } else {
    throw new Error(`Error: font-list can not run on ${platform}.`)
  }

  fonts = fonts.map(i => {
    // parse unicode names, eg: '"\\U559c\\U9e4a\\U805a\\U73cd\\U4f53"' -> '"喜鹊聚珍体"'
    try {
      i = i.replace(/\\u([\da-f]{4})/ig, (m, s) => String.fromCharCode(parseInt(s, 16)))
    } catch (e) {
      console.log(e)
    }

    if (options && options.disableQuoting) {
      if (i.startsWith('"') && i.endsWith('"')) {
        i = `${i.substr(1, i.length - 2)}`
      }
    } else if (i.includes(' ') && !i.startsWith('"')) {
      i = `"${i}"`
    }

    return i
  })

  fonts.sort((a, b) => {
    return a.replace(/^['"]+/, '').toLocaleLowerCase() < b.replace(/^['"]+/, '').toLocaleLowerCase() ? -1 : 1
  })

  return fonts
}


//# sourceURL=webpack://qqmusic/./node_modules/font-list/index.js?