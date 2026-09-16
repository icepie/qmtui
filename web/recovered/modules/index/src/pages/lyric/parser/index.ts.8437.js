/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ parseLyric)
/* harmony export */ });
function playTime2ms(playTime) {
  const _minutes = parseInt(playTime.substring(0, playTime.indexOf(':')), 10) * 60 * 1000;

  const _seconds = parseInt(playTime.substring(playTime.indexOf(':') + 1, playTime.indexOf('.')), 10) * 1000;

  const _mSecond = parseInt(playTime.substring(playTime.indexOf('.') + 1), 10);

  return _minutes + _seconds + _mSecond;
}

function ms2playTime(ms) {
  const _minutes = ms / 60000;

  const _seconds = ms / 1000 % 60;

  const _mSecond = ms - _minutes * 60000 - _seconds * 1000;

  return `${(_minutes > 9 ? '' : '0') + _minutes}:${_seconds > 9 ? '' : '0'}${_seconds}.${_mSecond > 9 ? '' : '0'}${_mSecond}`;
}
/**
 * 格式化歌词数据为列表
 *
 * @param {string} [originLyricStr='']
 * @returns
 */


function parseLyric(originLyricStr = '') {
  const lrcList = [];
  const tmpList = originLyricStr.split('\n');
  const lrcData = {};
  tmpList.forEach(item => {
    let preTime = '',
        _rIndex = item.lastIndexOf(']'),
        _lSubstr = item.substring(0, _rIndex + 1),
        //时间标签子串
    _rSubstr = item.substring(_rIndex + 1),
        //歌词内容子串
    _tmpTimes = _lSubstr.replace(new RegExp('\\[', 'g'), '').split(']'),
        //分割时间标签
    _tLen = _tmpTimes.length,
        j = _tLen - 1,
        _tmpTag = '',
        _pointPos = 0;

    if (j > 0) {
      while (j--) {
        _tmpTag = _tmpTimes[j];

        if (_tmpTag.indexOf('al:') > 0) {
          // album
          _pointPos = _tmpTag.indexOf(':');
          lrcData.album = _tmpTag.substring(_pointPos + 1);
        } else if (_tmpTag.indexOf('ar:') != -1) {
          // artist
          _pointPos = _tmpTag.indexOf(':');
          lrcData.artist = _tmpTag.substring(_pointPos + 1);
        } else if (_tmpTag.indexOf('ti:') != -1) {
          // title
          _pointPos = _tmpTag.indexOf(':');
          lrcData.songTitle = _tmpTag.substring(_pointPos + 1);
        } else if (_tmpTag.indexOf('by:') != -1) {
          // by body
          _pointPos = _tmpTag.indexOf(':');
          lrcData.byBody = _tmpTag.substring(_pointPos + 1);
        } else if (_tmpTag.indexOf('offset:') != -1) {
          // offset
          _pointPos = _tmpTag.indexOf(':');
          lrcData.offset = _tmpTag.substring(_pointPos + 1);
        } else {
          // 歌词时间标签,添加歌词到列表
          _tmpTag = _tmpTag.indexOf('.') != -1 ? _tmpTag : `${_tmpTag}.00`;
          _rSubstr = _rSubstr.trim();

          const _t = playTime2ms(_tmpTag) - (parseInt(lrcData.offset) || 0);

          _tmpTag = ms2playTime(_t);
          _rSubstr = _rSubstr.replace(/&apos;/g, `’`);

          if (_rSubstr) {
            lrcList.push({
              time: _t,
              context: _rSubstr
            });
            preTime = _tmpTag;
          }
        }
      }
    } else {
      _rSubstr = _rSubstr.replace('&apos;', '’');
      lrcList.push({
        time: parseInt(preTime) || 0,
        context: _rSubstr
      });
    }
  });
  lrcList.sort((item1, item2) => {
    return item1.time - item2.time;
  });

  if (lrcList.length == 1 && !lrcList[0].context) {
    lrcList[0].context = '暂无歌词';
  }

  return lrcList;
}

//# sourceURL=webpack://qqmusic/./src/pages/lyric/parser/index.ts?