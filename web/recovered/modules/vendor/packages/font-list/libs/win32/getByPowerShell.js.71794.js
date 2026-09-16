/**
 * getByPowerShell
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = __webpack_require__(63129).exec

const parse = (str) => {
  let fonts = []
  str.split('\n').map(ln => {
    ln = ln.trim()
    if (!ln || !ln.includes(':')) return

    ln = ln.split(':')
    if (ln.length !== 2 || ln[0].trim() !== 'Name') return

    fonts.push(ln[1].trim())
  })

  return fonts
}

/*
@see https://superuser.com/questions/760627/how-to-list-installed-font-families

  [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing")
  (New-Object System.Drawing.Text.InstalledFontCollection).Families
*/
module.exports = () => new Promise((resolve, reject) => {
  let cmd = `powershell -command "chcp 65001;[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing');(New-Object System.Drawing.Text.InstalledFontCollection).Families"`

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
    if (err) {
      reject(err)
      return
    }

    resolve(parse(stdout))
  })
})


//# sourceURL=webpack://qqmusic/./node_modules/font-list/libs/win32/getByPowerShell.js?