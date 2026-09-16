// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ component_play_list_detail)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./node_modules/react-router-dom/esm/react-router-dom.js
var react_router_dom = __webpack_require__(73727);
// EXTERNAL MODULE: ./node_modules/react-router/esm/react-router.js
var react_router = __webpack_require__(16550);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./src/lib/components/button/index.tsx
var components_button = __webpack_require__(32393);
// EXTERNAL MODULE: ./src/lib/common/login.ts
var login = __webpack_require__(68010);
// EXTERNAL MODULE: ./src/hooks/assets.ts
var assets = __webpack_require__(67891);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
// EXTERNAL MODULE: ./node_modules/antd/es/popover/index.js + 1 modules
var popover = __webpack_require__(19181);
;// CONCATENATED MODULE: ./src/component/Qrcode/index.tsx

const qrcode = /*#__PURE__*/react.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 41 29",
  className: "detail_qrcode__icon"
}, /*#__PURE__*/react.createElement("path", {
  d: "M10.605 15c1.34 0 2.437 1.032 2.522 2.336l.006.164v7c0 1.325-1.043 2.41-2.362 2.495l-.166.005H3.528c-1.34 0-2.437-1.032-2.523-2.336L1 24.5v-7c0-1.325 1.043-2.41 2.361-2.495L3.528 15h7.077zm10.616 10v2H19.2v-2h2.022zm4.044 0v2h-2.022v-2h2.022zm-8.088 0v2h-.022a2 2 0 0 1-2-2h2.022zm-6.572-8H3.528a.504.504 0 0 0-.498.41l-.008.09v7c0 .245.179.45.415.492l.09.008h7.078a.504.504 0 0 0 .497-.41l.009-.09v-7c0-.276-.227-.5-.506-.5zm12.638 6v2h-2.022v-2h2.022zm4.044 0v2h-2.022v-2h2.022zM19.2 23v2h-2.022v-2h2.022zm2.022-2v2H19.2v-2h2.022zm4.044 0v2h-2.022v-2h2.022zm-8.088 0v2h-2.022v-2h2.022zm-8.594-1.5v3H5.55v-3h3.033zm14.66-.5v2h-2.022v-2h2.022zm4.044 0v2h-2.022v-2h2.022zM19.2 19v2h-2.022v-2h2.022zm2.022-2v2H19.2v-2h2.022zm4.044 0v2h-2.022v-2h2.022zM19.2 15v2h-2.022v2h-2.022v-2a2 2 0 0 1 2-2h2.044zm4.044 0v2h-2.022v-2h2.022zm2.044 0a2 2 0 0 1 1.995 1.85l.005.15h-2.022v-2h.022zM38.6 12.012a.4.4 0 0 1 .318.643l-2.225 2.916a.4.4 0 0 1-.636 0l-2.224-2.916a.4.4 0 0 1 .318-.643h4.45zM10.605 1c1.34 0 2.437 1.032 2.522 2.336l.006.164v7c0 1.325-1.043 2.41-2.362 2.495l-.166.005H3.528c-1.34 0-2.437-1.032-2.523-2.336L1 10.5v-7c0-1.325 1.043-2.41 2.361-2.495L3.528 1h7.077zM24.76 1c1.34 0 2.436 1.032 2.522 2.336l.005.164v7c0 1.325-1.043 2.41-2.361 2.495L24.76 13h-7.078c-1.34 0-2.436-1.032-2.522-2.336l-.005-.164v-7c0-1.325 1.043-2.41 2.361-2.495L17.682 1h7.078zM10.605 3H3.528a.504.504 0 0 0-.498.41l-.008.09v7c0 .245.179.45.415.492l.09.008h7.078a.504.504 0 0 0 .497-.41l.009-.09v-7c0-.276-.227-.5-.506-.5zM24.76 3h-7.078a.504.504 0 0 0-.497.41l-.008.09v7c0 .245.179.45.415.492l.09.008h7.078a.504.504 0 0 0 .497-.41l.008-.09v-7c0-.276-.226-.5-.505-.5zM8.583 5.5v3H5.55v-3h3.033zm14.155 0v3h-3.034v-3h3.034z"
}));

const Qrcode = () => null;

/* harmony default export */ const component_Qrcode = (Qrcode);
// EXTERNAL MODULE: ./src/lib/common/jump.ts
var jump = __webpack_require__(54128);
// EXTERNAL MODULE: ./src/component/batch_operation/type/index.ts
var type = __webpack_require__(16852);
;// CONCATENATED MODULE: ./src/component/play_list_detail/detail.tsx











const Detail = ({
  detailContent,
  isCollect,
  isSelfCreate,
  onCollect,
  onPlayAll,
  isRecent,
  onClearRecent
}) => {
  var _detailContent$tag;

  const [isPlayListCollect, setIsPlayListCollect] = (0,react.useState)(isCollect);
  const isRecentList = !!(
    isRecent ||
    (detailContent && (
      detailContent.dissid === 'recent' ||
      detailContent.name === '最近播放' ||
      detailContent.id === 'recent' ||
      detailContent.tid === 'recent'
    )) ||
    (typeof window !== 'undefined' && (
      window.location.href.includes('recent') ||
      window.location.hash.includes('recent') ||
      window.location.pathname.includes('recent')
    ))
  );
  const {
    img
  } = detailContent;

  const renderCover = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "detail__cover"
    }, /*#__PURE__*/react.createElement("img", {
      src: img,
      alt: "",
      className: "detail__cover_pic"
    }), detailContent.dirid === 202 && /*#__PURE__*/react.createElement("i", {
      className: "playlist_corner_icon playlist_corner_icon_daily"
    }), detailContent.dirid === 203 && /*#__PURE__*/react.createElement("i", {
      className: "playlist_corner_icon playlist_corner_icon_new"
    }));
  };

  const jumpToUserProfile = () => {
    (0,jump/* default */.Z)(jump/* PAGE_TYPE.PROFILE */.G.PROFILE, {
      id: detailContent.user.encryptUin
    });
  };

  const jumpToBatchOperation = () => {
    (0,jump/* default */.Z)(jump/* PAGE_TYPE.BATCH_OPERATION */.G.BATCH_OPERATION, {
      data: {
        type: type/* OPERATION_TYPE.PLAYLIST */.f.PLAYLIST,
        dissId: detailContent.dissid
      }
    });
  };

  const handleClearRecentList = () => {
    dialog/* default.show */.ZP.show({
      mode: 'common',
      title: '清空最近播放',
      sub_title: '确定要清空全部最近播放记录吗？清空后将无法恢复。',
      button_info1: {
        highlight: 1,
        title: '清空',
        fn: () => {
          dialog/* default.hide */.ZP.hide();
          try {
            localStorage.setItem('__qqmusic_recent_play__', '[]');
            window.dispatchEvent(new CustomEvent('qqmusic_recent_update'));
            popup/* default.show */.Z.show(1, '已清空最近播放列表');
          } catch (e) {}
          onClearRecent === null || onClearRecent === void 0 ? void 0 : onClearRecent();
        }
      },
      button_info2: {
        highlight: 0,
        title: '取消',
        fn: () => {
          dialog/* default.hide */.ZP.hide();
        }
      }
    });
  };

  const handleCollect = () => {
    if (!login/* default.isLogin */.Z.isLogin()) {
      login/* default.loginMiniportal */.Z.loginMiniportal();
      return;
    }

    const prevIsCollect = isPlayListCollect;
    setIsPlayListCollect(!prevIsCollect);
    (0,assets/* updatePlayListFavStatus */.PE)(detailContent.id, prevIsCollect).then(isSuccess => {
      if (isSuccess) {
        onCollect(true);
      } else {
        popup/* default.show */.Z.show(0, '操作失败，请稍后再试~');
        setIsPlayListCollect(prevIsCollect);
      }
    }).catch(() => {
      popup/* default.show */.Z.show(0, '操作失败，请稍后再试~');
      setIsPlayListCollect(prevIsCollect);
    });
  };

  const handlePlayAll = () => {
    onPlayAll === null || onPlayAll === void 0 ? void 0 : onPlayAll();
  };

  const renderUser = () => {
    var _detailContent$user, _detailContent$user2;

    return /*#__PURE__*/react.createElement("a", {
      onClick: jumpToUserProfile
    }, /*#__PURE__*/react.createElement("img", {
      src: utils/* default.fixUrl */.ZP.fixUrl((detailContent === null || detailContent === void 0 ? void 0 : (_detailContent$user = detailContent.user) === null || _detailContent$user === void 0 ? void 0 : _detailContent$user.img) || ''),
      alt: "",
      className: "detail__avator"
    }), detailContent === null || detailContent === void 0 ? void 0 : (_detailContent$user2 = detailContent.user) === null || _detailContent$user2 === void 0 ? void 0 : _detailContent$user2.name);
  };

  const renderDescMoreDetail = () => {
    return (
      /*#__PURE__*/
      // <div className="mod_detail_desc c_tx_thin">
      //     <div className="detail_desc__box">
      //         <div className="detail_desc__cont">
      //             <p className="js_desc_content"> {detailContent.desc}</p>
      //         </div>
      //     </div>
      // </div>
      react.createElement("div", {
        className: "common_popover__content c_txt1 c_bg_floor",
        style: {
          width: '500px'
        }
      }, detailContent.desc)
    );
  };

  const renderDesc = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "mod_detail_desc c_tx_thin"
    }, /*#__PURE__*/react.createElement("div", {
      className: "detail_desc__box"
    }, /*#__PURE__*/react.createElement("div", {
      className: "detail_desc__cont"
    }, /*#__PURE__*/react.createElement("p", {
      className: "js_desc_content"
    }, detailContent.desc)), detailContent.desc && /*#__PURE__*/react.createElement("div", {
      className: "detail_desc__more_box"
    }, /*#__PURE__*/react.createElement(popover/* default */.Z, {
      trigger: "click",
      content: renderDescMoreDetail,
      placement: "left"
    }, /*#__PURE__*/react.createElement("a", {
      className: "detail_desc__more"
    }, "[\u8BE6\u60C5]")))));
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "mod_detail album"
  }, /*#__PURE__*/react.createElement("div", {
    className: "detail__inner"
  }, renderCover(), /*#__PURE__*/react.createElement("div", {
    className: "detail__info"
  }, (detailContent === null || detailContent === void 0 ? void 0 : detailContent.name) && /*#__PURE__*/react.createElement("h1", {
    className: "detail__title c_tx_normal"
  }, detailContent.name), /*#__PURE__*/react.createElement("div", {
    className: "mod_detail_about c_tx_thin"
  }, /*#__PURE__*/react.createElement("div", {
    className: "detail__para"
  }, /*#__PURE__*/react.createElement("div", {
    className: "detail_about__box"
  }, /*#__PURE__*/react.createElement("span", {
    className: "detail_about__item"
  }, renderUser()), detailContent === null || detailContent === void 0 ? void 0 : (_detailContent$tag = detailContent.tag) === null || _detailContent$tag === void 0 ? void 0 : _detailContent$tag.map(item => /*#__PURE__*/react.createElement("span", {
    className: "detail_about__item",
    key: `item.song${item}`
  }, "#", item)))), renderDesc()), /*#__PURE__*/react.createElement("div", {
    className: "mod_detail_operation"
  }, /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    style: {
      verticalAlign: 'top'
    },
    config: {
      highlight: true,
      stroke: true,
      type: 'play',
      text: '播放全部'
    },
    clickFun: handlePlayAll
  }), !isSelfCreate && !isRecentList && /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    style: {
      verticalAlign: 'top'
    },
    config: {
      highlight: false,
      stroke: false,
      type: isPlayListCollect ? 'loved' : 'love',
      text: isPlayListCollect ? '取消收藏' : '收藏'
    },
    clickFun: handleCollect
  }), isRecentList ? /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    style: {
      verticalAlign: 'top'
    },
    config: {
      highlight: false,
      stroke: false,
      type: 'normal',
      text: '清空列表'
    },
    clickFun: handleClearRecentList
  }) : (isSelfCreate && /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    style: {
      verticalAlign: 'top'
    },
    config: {
      type: 'batch',
      text: '批量操作'
    },
    clickFun: jumpToBatchOperation
  })))), /*#__PURE__*/react.createElement(component_Qrcode, {
    type: "playlist",
    url: `${utils/* default.playlistPageUrl */.ZP.playlistPageUrl}&id=${detailContent === null || detailContent === void 0 ? void 0 : detailContent.dissid}`
  })));
};


// EXTERNAL MODULE: ./src/component/song_list/index.tsx + 1 modules
var song_list = __webpack_require__(57224);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/extends.js
var helpers_extends = __webpack_require__(67154);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);
;// CONCATENATED MODULE: ./src/component/comment/type.ts
let CMT_BIZ_TYPE;
/**
 * 0-按时间排序，1-按热度排序
 * http://tapd.oa.com/MusicTermServ1_0/markdown_wikis/show/#1210037541000298847
 */

(function (CMT_BIZ_TYPE) {
  CMT_BIZ_TYPE[CMT_BIZ_TYPE["SONG"] = 1] = "SONG";
  CMT_BIZ_TYPE[CMT_BIZ_TYPE["ALBUM"] = 2] = "ALBUM";
  CMT_BIZ_TYPE[CMT_BIZ_TYPE["PLAYLIST"] = 3] = "PLAYLIST";
  CMT_BIZ_TYPE[CMT_BIZ_TYPE["TOPLIST"] = 4] = "TOPLIST";
  CMT_BIZ_TYPE[CMT_BIZ_TYPE["MV"] = 5] = "MV";
})(CMT_BIZ_TYPE || (CMT_BIZ_TYPE = {}));

let CMT_RANK_TYPE;

(function (CMT_RANK_TYPE) {
  CMT_RANK_TYPE[CMT_RANK_TYPE["TIME"] = 0] = "TIME";
  CMT_RANK_TYPE[CMT_RANK_TYPE["HOT"] = 1] = "HOT";
})(CMT_RANK_TYPE || (CMT_RANK_TYPE = {}));

let CMT_HOT_TYPE;

(function (CMT_HOT_TYPE) {
  CMT_HOT_TYPE[CMT_HOT_TYPE["TOP"] = 1] = "TOP";
  CMT_HOT_TYPE[CMT_HOT_TYPE["MUSICIAN"] = 2] = "MUSICIAN";
  CMT_HOT_TYPE[CMT_HOT_TYPE["AIRBORNE"] = 4] = "AIRBORNE";
})(CMT_HOT_TYPE || (CMT_HOT_TYPE = {}));

var CMT_MOD_KEY;

(function (CMT_MOD_KEY) {
  CMT_MOD_KEY["AIR"] = "air";
  CMT_MOD_KEY["MUSICIAN"] = "musician";
  CMT_MOD_KEY["HOT"] = "hot";
  CMT_MOD_KEY["NEW_HOT"] = "newHot";
  CMT_MOD_KEY["NEW"] = "new";
})(CMT_MOD_KEY || (CMT_MOD_KEY = {}));

var CommentState;

(function (CommentState) {
  CommentState[CommentState["CommentStateSelfSee"] = 0] = "CommentStateSelfSee";
  CommentState[CommentState["CommentStateNormal"] = 1] = "CommentStateNormal";
  CommentState[CommentState["CommentStateDeleted"] = 2] = "CommentStateDeleted";
  CommentState[CommentState["CommentStateHot"] = 3] = "CommentStateHot";
  CommentState[CommentState["CommentStateTop"] = 4] = "CommentStateTop";
  CommentState[CommentState["CommentStateUnknown"] = 5] = "CommentStateUnknown";
})(CommentState || (CommentState = {}));

/**
 * 1-选为热评, 2-取消热评, 3-点赞, 4-取消点赞, 5-置顶, 6-删, 7-仅自己可见, 8-评论ID和手机号绑定, 9-投稿, 10-取消置顶
 */
let CMT_UPDATE_TYPE;

(function (CMT_UPDATE_TYPE) {
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["HOT"] = 1] = "HOT";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["CANCEL_HOT"] = 2] = "CANCEL_HOT";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["PRAISE"] = 3] = "PRAISE";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["CANCEL_PRAISE"] = 4] = "CANCEL_PRAISE";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["TOP"] = 5] = "TOP";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["DEL"] = 6] = "DEL";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["SELF"] = 7] = "SELF";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["CELLPHONE"] = 8] = "CELLPHONE";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["CONTRIBUTE"] = 9] = "CONTRIBUTE";
  CMT_UPDATE_TYPE[CMT_UPDATE_TYPE["CANCEL_TOP"] = 10] = "CANCEL_TOP";
})(CMT_UPDATE_TYPE || (CMT_UPDATE_TYPE = {}));


// EXTERNAL MODULE: ./src/lib/network/index.ts + 1 modules
var network = __webpack_require__(32590);
// EXTERNAL MODULE: ./src/lib/network/comment.ts
var comment = __webpack_require__(35198);
;// CONCATENATED MODULE: ./src/component/comment/action.ts




const getHotCmtList = async opts => {
  var _res$getHotCmtList, _res$getHotCmtList2;

  const {
    type,
    id,
    pageSize = 25,
    pageNum = 0,
    hotType = CMT_HOT_TYPE.TOP,
    lastCommentSeqNo = '',
    withAirborne = 0
  } = opts || {};
  const res = await (0,network/* ufetch */.D)({
    getHotCmtList: (0,comment/* getHotCommentList */.rb)({
      BizType: type,
      BizId: id,
      LastCommentSeqNo: lastCommentSeqNo,
      // 带上上一页最后一条评论的Seq值
      PageSize: pageSize,
      PageNum: pageNum,
      HotType: hotType,
      // 置顶和精彩评论-1，音乐人说-2
      WithAirborne: withAirborne
    })
  });

  if (res.code === 0 && ((_res$getHotCmtList = res.getHotCmtList) === null || _res$getHotCmtList === void 0 ? void 0 : _res$getHotCmtList.code) === 0 && (_res$getHotCmtList2 = res.getHotCmtList) !== null && _res$getHotCmtList2 !== void 0 && _res$getHotCmtList2.data) {
    return Promise.resolve(res.getHotCmtList.data);
  }
};
const getNewCmtList = async opts => {
  var _res$getNewCmtList, _res$getNewCmtList2;

  const {
    type,
    id,
    pageSize = 25,
    pageNum = 0,
    fromCmtId = '',
    lastCommentSeqNo = '',
    withHot = 0
  } = opts || {};
  const res = await (0,network/* ufetch */.D)({
    getNewCmtList: (0,comment/* getNewCommentList */.VN)({
      BizType: type,
      // 1：单曲  2：专辑  3：歌单  4：排行榜  5：MV
      BizId: id,
      // 歌曲或者专辑id
      LastCommentSeqNo: lastCommentSeqNo,
      // 带上上一页最后一条评论的Seq值
      PageSize: pageSize,
      PageNum: pageNum,
      FromCommentId: fromCmtId,
      // 由哪个评论跳转而来（消息中心或者个人主页点击评论跳转）
      WithHot: withHot
    })
  });

  if (res.code === 0 && ((_res$getNewCmtList = res.getNewCmtList) === null || _res$getNewCmtList === void 0 ? void 0 : _res$getNewCmtList.code) === 0 && (_res$getNewCmtList2 = res.getNewCmtList) !== null && _res$getNewCmtList2 !== void 0 && _res$getNewCmtList2.data) {
    return Promise.resolve(res.getNewCmtList.data);
  }
};
const updateHotCmt = async opts => {
  var _res$updateHotComment, _res$updateHotComment2;

  const {
    type,
    id
  } = opts || {};
  const res = await (0,network/* ufetch */.D)({
    updateHotComment: (0,comment/* updateHotComment */.rx)({
      comment_id: id,
      type,
      uin: `${login/* default.getUin */.Z.getUin()}`
    })
  });

  if (res.code === 0 && ((_res$updateHotComment = res.updateHotComment) === null || _res$updateHotComment === void 0 ? void 0 : _res$updateHotComment.code) === 0 && (_res$updateHotComment2 = res.updateHotComment) !== null && _res$updateHotComment2 !== void 0 && _res$updateHotComment2.data) {
    return Promise.resolve(res.updateHotComment.data);
  } else {
    return Promise.reject(res.updateHotComment);
  }
};
const getReplyCmtList = async opts => {
  var _res$getReplyCommentL, _res$getReplyCommentL2;

  const {
    rootCmId,
    pageSize = 10,
    lastRankScore = '',
    lastCommentSeqNo = '',
    rankType
  } = opts || {};
  const res = await (0,network/* ufetch */.D)({
    getReplyCommentList: (0,comment/* getReplyCommentList */.Lh)({
      RootCmId: rootCmId,
      LastCommentSeqNo: lastCommentSeqNo,
      // 带上上一页最后一条评论的Seq值
      PageSize: pageSize,
      LastRankScore: lastRankScore,
      RankType: rankType
    })
  });

  if (res.code === 0 && ((_res$getReplyCommentL = res.getReplyCommentList) === null || _res$getReplyCommentL === void 0 ? void 0 : _res$getReplyCommentL.code) === 0 && (_res$getReplyCommentL2 = res.getReplyCommentList) !== null && _res$getReplyCommentL2 !== void 0 && _res$getReplyCommentL2.data) {
    return Promise.resolve(res.getReplyCommentList.data);
  } else {
    return Promise.reject(res.getReplyCommentList);
  }
};
const deleteCmt = async opts => {
  var _res$deleteComment, _res$deleteComment2;

  const {
    id
  } = opts || {};
  const res = await (0,network/* ufetch */.D)({
    deleteComment: (0,comment/* deleteComment */.YF)({
      CommentId: id
    })
  });

  if (res.code === 0 && ((_res$deleteComment = res.deleteComment) === null || _res$deleteComment === void 0 ? void 0 : _res$deleteComment.code) === 0 && (_res$deleteComment2 = res.deleteComment) !== null && _res$deleteComment2 !== void 0 && _res$deleteComment2.data) {
    return Promise.resolve(res.deleteComment.data);
  } else {
    return Promise.reject(res.deleteComment);
  }
};
const addCmt = async opts => {
  var _res$addCmt, _res$addCmt2;

  const {
    id,
    type,
    content,
    replyCmId
  } = opts || {};
  const res = await (0,network/* ufetch */.D)({
    addCmt: (0,comment/* addComment */.Ir)({
      BizType: type,
      // 1：单曲  2：专辑  3：歌单  4：排行榜  5：MV
      BizId: id,
      // 歌曲或者专辑id
      Content: content,
      RepliedCmId: replyCmId
    })
  });

  if (res.code === 0 && ((_res$addCmt = res.addCmt) === null || _res$addCmt === void 0 ? void 0 : _res$addCmt.code) === 0 && (_res$addCmt2 = res.addCmt) !== null && _res$addCmt2 !== void 0 && _res$addCmt2.data) {
    return Promise.resolve(res.addCmt.data);
  } else {
    return Promise.reject(res.addCmt);
  }
};
;// CONCATENATED MODULE: ./src/component/comment/utils.ts


const formatRepliedCmt = reCmt => ({
  cmId: reCmt.CmId,
  nick: reCmt.Nick,
  encryptUin: reCmt.EncryptUin,
  content: reCmt.Content,
  replyCnt: reCmt.RplCnt,
  isAuthorPraise: !!reCmt.AuthorPraise
});

const formatCmtList = data => {
  const cmtById = {};
  const subCmtById = {};
  const idList = data.Comments && data.Comments.map(item => {
    if (!item || !item.CmId) {
      return null;
    }

    cmtById[item.CmId] = {
      cmId: item.CmId,
      avatar: item.Avatar,
      nick: item.Nick,
      encryptUin: item.EncryptUin,
      vipIcon: item.VipIcon,
      content: item.Content,
      pubTime: item.PubTime,
      praiseNum: item.PraiseNum,
      replyCnt: item.ReplyCnt,
      identityPic: item.IdentityPic,
      identityType: item.IdentityType,
      isShow: item.State !== CommentState.CommentStateDeleted && item.State !== CommentState.CommentStateSelfSee,
      isPraised: !!item.IsPraised,
      isAuthorPraise: !!item.AuthorPraise,
      permission: item.Permission,
      seqNo: item.SeqNo,
      rankScore: item.RankScore,
      repliedCmts: item.RepliedComments && item.RepliedComments.map(formatRepliedCmt),
      subCmtIdList: item.SubComments && item.SubComments.map(subCmt => {
        subCmtById[subCmt.CmId] = {
          cmId: subCmt.CmId,
          avatar: subCmt.Avatar,
          nick: subCmt.Nick,
          encryptUin: subCmt.EncryptUin,
          vipIcon: subCmt.VipIcon,
          content: subCmt.Content,
          pubTime: subCmt.PubTime,
          praiseNum: subCmt.PraiseNum,
          identityPic: subCmt.IdentityPic,
          identityType: subCmt.IdentityType,
          isShow: true,
          isPraised: !!subCmt.IsPraised,
          isAuthorPraise: !!subCmt.AuthorPraise,
          permission: subCmt.Permission,
          seqNo: subCmt.SeqNo,
          rankScore: subCmt.RankScore,
          repliedCmts: subCmt.ParentComment && [subCmt.ParentComment].map(formatRepliedCmt)
        };
        return subCmt.CmId;
      }) || []
    };
    return item.CmId;
  }) || [];
  return {
    hasMore: !!data.HasMore,
    total: data.Total,
    cmtById,
    idList,
    subCmtById
  };
};
const formatAddCmt = (addCmt, content) => {
  return {
    cmId: addCmt.AddedCmId,
    avatar: addCmt.Avatar,
    nick: addCmt.Nick,
    encryptUin: '',
    vipIcon: addCmt.VipIcon,
    content,
    pubTime: Date.now() / 1000,
    praiseNum: 0,
    replyCnt: 0,
    identityPic: addCmt.IdentityPic,
    identityType: addCmt.IdentityType,
    isShow: true,
    isPraised: false,
    isAuthorPraise: false,
    permission: addCmt.Permission,
    seqNo: '',
    rankScore: '',
    repliedCmts: [],
    subCmtIdList: []
  };
};
;// CONCATENATED MODULE: ./src/component/comment/context.ts


const defaultContext = {
  type: CMT_BIZ_TYPE.PLAYLIST
};
const CmtContext = /*#__PURE__*/react.createContext(defaultContext);
/* harmony default export */ const context = (CmtContext);
;// CONCATENATED MODULE: ./src/component/loading/comment_loading.tsx


// 评论
class CommentLoading extends react.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const number = this.props.number || 7;
    const itemList = [];

    for (let index = 0; index < number; index++) {
      itemList.push( /*#__PURE__*/react.createElement("li", {
        key: `CommentLoading${index}`,
        className: "comment__list_item c_b_normal"
      }, /*#__PURE__*/react.createElement("div", {
        className: "comment__avatar"
      }, /*#__PURE__*/react.createElement("img", {
        src: utils/* default.bannerDefaultImg */.ZP.bannerDefaultImg,
        alt: ""
      })), /*#__PURE__*/react.createElement("h4", {
        className: "comment__title c_bg_bone loading__w3"
      }), /*#__PURE__*/react.createElement("p", {
        className: "comment__text c_bg_bone loading__w1 loading__h1"
      }), /*#__PURE__*/react.createElement("div", {
        className: "comment__opt c_bg_bone loading__w1 loading__h1"
      })));
    }

    return /*#__PURE__*/react.createElement("div", {
      className: `mod_comment`
    }, /*#__PURE__*/react.createElement("ul", {
      className: "comment__list"
    }, itemList));
  }

}
;// CONCATENATED MODULE: ./src/component/scroll_view/index.tsx


class ScrollView extends react.PureComponent {
  constructor(...args) {
    super(...args);
    this.clientHeight = void 0;
    this.children = void 0;
    this.boxElement = void 0;

    this.handleWindowScroll = () => {
      const {
        offsetHeight
      } = this.children;
      const {
        bottom,
        onChangeScroll
      } = this.props;
      let scrollTop;

      if (this.boxElement !== window) {
        scrollTop = this.boxElement.scrollTop;
      } else {
        scrollTop = window.scrollY;
      }

      if (offsetHeight - (scrollTop + this.clientHeight) < bottom) {
        onChangeScroll();
      }
    };

    this.handleResize = () => {
      const {
        boxClass
      } = this.props;

      if (boxClass) {
        this.clientHeight = this.boxElement.clientHeight;
      } else {
        this.clientHeight = document.documentElement.clientHeight;
      }
    };
  }

  componentDidMount() {
    const {
      boxClass
    } = this.props;

    if (boxClass) {
      this.boxElement = document.querySelector(`.${boxClass}`);
      this.clientHeight = this.boxElement.clientHeight;
    } else {
      this.boxElement = window;
      this.clientHeight = document.documentElement.clientHeight;
    }

    window.addEventListener('resize', this.handleResize, false);
    this.boxElement.addEventListener('scroll', this.handleWindowScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
    this.boxElement.removeEventListener('scroll', this.handleWindowScroll, false);
  }

  render() {
    const {
      children
    } = this.props;
    return /*#__PURE__*/react.createElement(react.Fragment, null, react.Children.map(children, element => {
      return /*#__PURE__*/react.cloneElement(element, {
        ref: e => this.children = e
      });
    }));
  }

}

ScrollView.defaultProps = {
  bottom: 100
};
/* harmony default export */ const scroll_view = (ScrollView);
;// CONCATENATED MODULE: ./src/component/comment/component/EmojiDialog/emojiChar.ts
const emojiChar = ['😀', '😆', '😅', '😂', '☺️', '😊', '😇', '😉', '😌', '😍', '😘', '😚', '😋', '😛', '😝', '😜', '😎', '😏', '😒', '😔', '😟', '😣', '😖', '😩', '😢', '😭', '😤', '😠', '😡', '😳', '😱', '😨', '😰', '😥', '😓', '😬', '😯', '😴', '😪', '😵', '😷', '😈', '👿', '👻', '👌', '✌', '👈', '👉', '👆', '👍', '👏', '👀', '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐯', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐣', '🌹', '🌝', '🌚', '🌙', '⭐', '🌈', '☀️', '💦', '☔', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍩', '🍪', '🌰', '🍯', '🍼', '🍧', '🍦', '❤️', '💛', '💚', '💙', '💜', '💔', '💓', '🎁', '🎈', '🎀', '🎉', '💌'];
/* harmony default export */ const EmojiDialog_emojiChar = (emojiChar);
;// CONCATENATED MODULE: ./src/component/comment/component/EmojiDialog/emojiEm.ts
const emojiEm = {
  '😀': {
    em: 'e400822',
    hex: '&#x1F600;'
  },
  '😆': {
    em: 'e400828',
    hex: '&#x1F606;'
  },
  '😅': {
    em: 'e400827',
    hex: '&#x1F605;'
  },
  '😂': {
    em: 'e400824',
    hex: '&#x1F602;'
  },
  '🤣': {
    em: 'e402150',
    hex: '&#x1F923;'
  },
  '☺️': {
    em: 'e401074',
    hex: '&#x263A;&#xFE0F;'
  },
  '☺': {
    em: 'e401074',
    hex: '&#x263A;'
  },
  '😊': {
    em: 'e400832',
    hex: '&#x1F60A;'
  },
  '😇': {
    em: 'e400829',
    hex: '&#x1F607;'
  },
  '🙂': {
    em: 'e401948',
    hex: '&#x1F642;'
  },
  '🙃': {
    em: 'e401949',
    hex: '&#x1F643;'
  },
  '😉': {
    em: 'e400831',
    hex: '&#x1F609;'
  },
  '😌': {
    em: 'e400834',
    hex: '&#x1F60C;'
  },
  '😍': {
    em: 'e400835',
    hex: '&#x1F60D;'
  },
  '🥰': {
    em: 'e402326',
    hex: '&#x1F970;'
  },
  '😘': {
    em: 'e400846',
    hex: '&#x1F618;'
  },
  '😚': {
    em: 'e400848',
    hex: '&#x1F61A;'
  },
  '😋': {
    em: 'e400833',
    hex: '&#x1F60B;'
  },
  '😛': {
    em: 'e400849',
    hex: '&#x1F61B;'
  },
  '😝': {
    em: 'e400851',
    hex: '&#x1F61D;'
  },
  '😜': {
    em: 'e400850',
    hex: '&#x1F61C;'
  },
  '🤪': {
    em: 'e402168',
    hex: '&#x1F92A;'
  },
  '🤨': {
    em: 'e402166',
    hex: '&#x1F928;'
  },
  '🧐': {
    em: 'e402416',
    hex: '&#x1F9D0;'
  },
  '🤓': {
    em: 'e402099',
    hex: '&#x1F913;'
  },
  '😎': {
    em: 'e400836',
    hex: '&#x1F60E;'
  },
  '🤩': {
    em: 'e402167',
    hex: '&#x1F929;'
  },
  '🥳': {
    em: 'e402327',
    hex: '&#x1F973;'
  },
  '😏': {
    em: 'e400837',
    hex: '&#x1F60F;'
  },
  '😒': {
    em: 'e400840',
    hex: '&#x1F612;'
  },
  '😔': {
    em: 'e400842',
    hex: '&#x1F614;'
  },
  '😟': {
    em: 'e400853',
    hex: '&#x1F61F;'
  },
  '😣': {
    em: 'e400857',
    hex: '&#x1F623;'
  },
  '😖': {
    em: 'e400844',
    hex: '&#x1F616;'
  },
  '😩': {
    em: 'e400863',
    hex: '&#x1F629;'
  },
  '🥺': {
    em: 'e402331',
    hex: '&#x1F97A;'
  },
  '😢': {
    em: 'e400856',
    hex: '&#x1F622;'
  },
  '😭': {
    em: 'e400867',
    hex: '&#x1F62D;;'
  },
  '😤': {
    em: 'e400858',
    hex: '&#x1F624;'
  },
  '😠': {
    em: 'e400854',
    hex: '&#x1F620;'
  },
  '😡': {
    em: 'e400855',
    hex: '&#x1F621;'
  },
  '🤯': {
    em: 'e402173',
    hex: '&#x1F92F;'
  },
  '😳': {
    em: 'e400873',
    hex: '&#x1F633;'
  },
  '🥵': {
    em: 'e402329',
    hex: '&#x1F975;'
  },
  '🥶': {
    em: 'e402330',
    hex: '&#x1F976;'
  },
  '😱': {
    em: 'e400871',
    hex: '&#x1F631;'
  },
  '😨': {
    em: 'e400862',
    hex: '&#x1F628;'
  },
  '😰': {
    em: 'e400870',
    hex: '&#x1F630;'
  },
  '😥': {
    em: 'e400859',
    hex: '&#x1F625;'
  },
  '😓': {
    em: 'e400841',
    hex: '&#x1F613;'
  },
  '🤗': {
    em: 'e401183',
    hex: '&#x1F917;'
  },
  '🤔': {
    em: 'e401184',
    hex: '&#x1F914;'
  },
  '🤭': {
    em: 'e402171',
    hex: '&#x1F92D;'
  },
  '😬': {
    em: 'e400866',
    hex: '&#x1F62C;'
  },
  '🙄': {
    em: 'e401185',
    hex: '&#x1F644;'
  },
  '😯': {
    em: 'e400869',
    hex: '&#x1F62F;'
  },
  '😴': {
    em: 'e400874',
    hex: '&#x1F634;'
  },
  '🤤': {
    em: 'e402151',
    hex: '&#x1F924;'
  },
  '😪': {
    em: 'e400864',
    hex: '&#x1F62A;'
  },
  '😵': {
    em: 'e400875',
    hex: '&#x1F635;'
  },
  '🤐': {
    em: 'e401186',
    hex: '&#x1F910;'
  },
  '🤧': {
    em: 'e402165',
    hex: '&#x1F927;'
  },
  '😷': {
    em: 'e400877',
    hex: '&#x1F637;'
  },
  '😈': {
    em: 'e400830',
    hex: '&#x1F608;'
  },
  '👿': {
    em: 'e400571',
    hex: '&#x1F47F;'
  },
  '🤡': {
    em: 'e402148',
    hex: '&#x1F921;'
  },
  '👻': {
    em: 'e400562',
    hex: '&#x1F47B;'
  },
  '👌': {
    em: 'e400402',
    hex: '&#x1F44C;'
  },
  '✌': {
    em: 'e402646',
    hex: '&#x270C;'
  },
  '🤞': {
    em: 'e402135',
    hex: '&#x1F91E;'
  },
  '🤟': {
    em: 'e402141',
    hex: '&#x1F91F;'
  },
  '🤘': {
    em: 'e402104',
    hex: '&#x1F918;'
  },
  '🤙': {
    em: 'e402110',
    hex: '&#x1F919;'
  },
  '👈': {
    em: 'e400378',
    hex: '&#x1F448;'
  },
  '👉': {
    em: 'e400384',
    hex: '&#x1F449;'
  },
  '👆': {
    em: 'e400366',
    hex: '&#x1F446;'
  },
  '🖕': {
    em: 'e401914',
    hex: '&#x1F595;'
  },
  '👍': {
    em: 'e400408',
    hex: '&#x1F44D;'
  },
  '👏': {
    em: 'e400420',
    hex: '&#x1F44F;'
  },
  '👀': {
    em: 'e400351',
    hex: '&#x1F440;'
  },
  '🐶': {
    em: 'e400342',
    hex: '&#x1F436;'
  },
  '🐱': {
    em: 'e400337',
    hex: '&#x1F431;'
  },
  '🐭': {
    em: 'e400333',
    hex: '&#x1F42D;'
  },
  '🐹': {
    em: 'e400345',
    hex: '&#x1F439;'
  },
  '🐰': {
    em: 'e400336',
    hex: '&#x1F430;'
  },
  '🦊': {
    em: 'e402346',
    hex: '&#x1F98A;'
  },
  '🐻': {
    em: 'e400347',
    hex: '&#x1F43B;'
  },
  '🐼': {
    em: 'e400348',
    hex: '&#x1F43C;'
  },
  '🐨': {
    em: 'e400328',
    hex: '&#x1F428;'
  },
  '🐯': {
    em: 'e400335',
    hex: '&#x1F42F;'
  },
  '🦁': {
    em: 'e401245',
    hex: '&#x1F981;'
  },
  '🐮': {
    em: 'e400334',
    hex: '&#x1F42E;'
  },
  '🐷': {
    em: 'e400343',
    hex: '&#x1F437;'
  },
  '🐽': {
    em: 'e400349',
    hex: '&#x1F43D;'
  },
  '🐸': {
    em: 'e400344',
    hex: '&#x1F438;'
  },
  '🐵': {
    em: 'e400341',
    hex: '&#x1F435;'
  },
  '🙈': {
    em: 'e400905',
    hex: '&#x1F648;'
  },
  '🙉': {
    em: 'e400906',
    hex: '&#x1F649;'
  },
  '🙊': {
    em: 'e400907',
    hex: '&#x1F64A;'
  },
  '🐒': {
    em: 'e400306',
    hex: '&#x1F412;'
  },
  '🐣': {
    em: 'e400323',
    hex: '&#x1F423;'
  },
  '🌹': {
    em: 'e400116',
    hex: '&#x1F339;'
  },
  '🌝': {
    em: 'e400104',
    hex: '&#x1F31D;'
  },
  '🌚': {
    em: 'e400101',
    hex: '&#x1F31A;'
  },
  '🌙': {
    em: 'e400100',
    hex: '&#x1F319;'
  },
  '⭐': {
    em: 'e401162',
    hex: '&#x2B50;'
  },
  '⭐️': {
    em: 'e401162',
    hex: '&#x2B50;&#xFE0F;'
  },
  '🌈': {
    em: 'e400083',
    hex: '&#x1F308;'
  },
  '☀️': {
    em: 'e401062',
    hex: '&#x2600;&#xFE0F;'
  },
  '☀': {
    em: 'e401062',
    hex: '&#x2600;'
  },
  '🌧': {
    em: 'e401335',
    hex: '&#x1F327;'
  },
  '💦': {
    em: 'e400640',
    hex: '&#x1F4A6;'
  },
  '☔': {
    em: 'e401066',
    hex: '&#x2614;'
  },
  '☔️': {
    em: 'e401066',
    hex: '&#x2614;&#xFE0F;'
  },
  '🍎': {
    em: 'e400137',
    hex: '&#x1F34E;'
  },
  '🍐': {
    em: 'e400139',
    hex: '&#x1F350;'
  },
  '🍊': {
    em: 'e400133',
    hex: '&#x1F34A;'
  },
  '🍋': {
    em: 'e400134',
    hex: '&#x1F34B;'
  },
  '🍌': {
    em: 'e400135',
    hex: '&#x1F34C;'
  },
  '🍉': {
    em: 'e400132',
    hex: '&#x1F349;'
  },
  '🍇': {
    em: 'e400130',
    hex: '&#x1F347;'
  },
  '🍓': {
    em: 'e400142',
    hex: '&#x1F353;'
  },
  '🍈': {
    em: 'e400131',
    hex: '&#x1F348;'
  },
  '🍒': {
    em: 'e400141',
    hex: '&#x1F352;'
  },
  '🍑': {
    em: 'e400140',
    hex: '&#x1F351;'
  },
  '🥭': {
    em: 'e402323',
    hex: '&#x1F96D;'
  },
  '🍍': {
    em: 'e400136',
    hex: '&#x1F34D;'
  },
  '🥥': {
    em: 'e402315',
    hex: '&#x1F965;'
  },
  '🥝': {
    em: 'e402307',
    hex: '&#x1F95D;'
  },
  '🍰': {
    em: 'e400171',
    hex: '&#x1F370;'
  },
  '🎂': {
    em: 'e400186',
    hex: '&#x1F382;'
  },
  '🍮': {
    em: 'e400169',
    hex: '&#x1F36E;'
  },
  '🍭': {
    em: 'e400168',
    hex: '&#x1F36D;'
  },
  '🍬': {
    em: 'e400167',
    hex: '&#x1F36C;'
  },
  '🍫': {
    em: 'e400166',
    hex: '&#x1F36B;'
  },
  '🍿': {
    em: 'e401261',
    hex: '&#x1F37F;'
  },
  '🍩': {
    em: 'e400164',
    hex: '&#x1F369;'
  },
  '🍪': {
    em: 'e400165',
    hex: '&#x1F36A;'
  },
  '🌰': {
    em: 'e400108',
    hex: '&#x1F330;'
  },
  '🥜': {
    em: 'e402306',
    hex: '&#x1F95C;'
  },
  '🍯': {
    em: 'e400170',
    hex: '&#x1F36F;'
  },
  '🥛': {
    em: 'e402305',
    hex: '&#x1F95B;'
  },
  '🍼': {
    em: 'e400183',
    hex: '&#x1F37C;'
  },
  '🥤': {
    em: 'e402314',
    hex: '&#x1F964;'
  },
  '🍧': {
    em: 'e400162',
    hex: '&#x1F367;'
  },
  '🍦': {
    em: 'e400161',
    hex: '&#x1F366;'
  },
  '❤️': {
    em: 'e401148',
    hex: '&#x2764;&#xFE0F;'
  },
  '❤': {
    em: 'e401148',
    hex: '&#x2764;'
  },
  '🧡': {
    em: 'e402548',
    hex: '&#x1F9E1;'
  },
  '💛': {
    em: 'e400629',
    hex: '&#x1F49B;'
  },
  '💚': {
    em: 'e400628',
    hex: '&#x1F49A;'
  },
  '💙': {
    em: 'e400627',
    hex: '&#x1F499;'
  },
  '💜': {
    em: 'e400630',
    hex: '&#x1F49C;'
  },
  '💔': {
    em: 'e400622',
    hex: '&#x1F494;'
  },
  '💓': {
    em: 'e400621',
    hex: '&#x1F493;'
  },
  '🧸': {
    em: 'e402571',
    hex: '&#x1F9F8;'
  },
  '🎁': {
    em: 'e400185',
    hex: '&#x1F381;'
  },
  '🎈': {
    em: 'e400197',
    hex: '&#x1F388;'
  },
  '🎀': {
    em: 'e400184',
    hex: '&#x1F380;'
  },
  '🎉': {
    em: 'e400198',
    hex: '&#x1F389;'
  },
  '💌': {
    em: 'e400614',
    hex: '&#x1F48C;'
  },
  '😃': {
    em: 'e400825',
    hex: '&#x1F603;'
  }
};
const emojiRex = new RegExp(Object.keys(emojiEm).join('|'), 'gi');

/* harmony default export */ const EmojiDialog_emojiEm = (emojiEm);
;// CONCATENATED MODULE: ./src/component/comment/component/EmojiDialog/index.tsx




const Index = props => {
  const {
    setRef,
    onClose,
    onEmojiInsert
  } = props;
  const emojiItems = EmojiDialog_emojiChar.map((emoji, i) => {
    const emCode = EmojiDialog_emojiEm[emoji];

    if (!emCode) {
      return null;
    }

    const handleClick = () => {
      onEmojiInsert(emoji);
    };

    return /*#__PURE__*/react.createElement("a", {
      key: i,
      onClick: handleClick
    });
  });
  return /*#__PURE__*/react.createElement("div", {
    ref: setRef,
    style: {
      position: 'absolute',
      width: '400px',
      top: '100%',
      right: '0',
      zIndex: 1
    },
    id: "js_face_dialog"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mod_popup_note popup_face c_popup__bg"
  }, /*#__PURE__*/react.createElement("h2", {
    className: "popup_face__title c_tx_normal c_b_normal"
  }, "\u5E38\u7528\u8868\u60C5", /*#__PURE__*/react.createElement("a", {
    className: "popup_face__close c_tx_thin",
    title: "\u5173\u95ED",
    onClick: onClose
  }, "\u5173\u95ED")), /*#__PURE__*/react.createElement("div", {
    className: "popup_face__content"
  }, /*#__PURE__*/react.createElement("div", {
    className: "mod_emoji"
  }, emojiItems), /*#__PURE__*/react.createElement("div", {
    className: "emoji_bg",
    style: {
      backgroundImage: 'url(//y.qq.com/mediastyle/global/emoji/emoji_page_2020@2x.png?max_age=2592000)'
    }
  }))));
};

/* harmony default export */ const EmojiDialog = (Index);
;// CONCATENATED MODULE: ./src/component/comment/component/CmtInput/utils.ts


const getEmojiSrc = char => {
  const emCode = EmojiDialog_emojiEm[char] && EmojiDialog_emojiEm[char].em;

  if (emCode) {
    return `//y.qq.com/mediastyle/global/emoji/img/${emCode}@2x.png?max_age=2592000`;
  }

  return char;
};

const formatHtmlCmt = html => {
  const text = html.replace(/<img.*?title="(.*?)".*?(?:>|\/>)/gi, '$1');
  return text.replace(/<br>|<\/div>/gi, '\n') // 用换行符取代div 兼容移动端显示 移动端通过读取换行符 替换成<br/>实现换行
  .trim().replace(/<div>/, '\n') // 第一个div需要换行
  .replace(/<div>/g, '');
};

const formatCmt2Html = text => {
  return text.replace(emojiRex, val => {
    const emCode = EmojiDialog_emojiEm[val] && EmojiDialog_emojiEm[val].em;

    if (emCode) {
      return `<img style="user-select: text;-webkit-user-select: text;" height="16px" title="${val}" src="${getEmojiSrc(val)}" />`;
    }

    return val;
  }).replace(/\n/gi, '<br>');
};


;// CONCATENATED MODULE: ./src/component/comment/component/CmtInput/index.tsx






const maxlength = 300;

const exceedLen = word => {
  let nameLength = utils/* default.getRealLen */.ZP.getRealLen(word.replace(/\n/g, ''));
  nameLength = Math.ceil(nameLength / 2);
  return maxlength - nameLength;
};

class CmtInput extends react.Component {
  constructor(...args) {
    super(...args);
    this.cmtTextRef = void 0;
    this.cmtDefRef = void 0;
    this.emojiDilaogRef = void 0;
    this.lastEditRange = void 0;
    this.state = {
      isFocus: false,
      isEmojiShow: false,
      inputText: ''
    };

    this.setCmtTextRef = ref => {
      this.cmtTextRef = ref;
    };

    this.setCmtDefRef = ref => {
      this.cmtDefRef = ref;
    };

    this.setEmojiDialogRef = ref => {
      this.emojiDilaogRef = ref;
    };

    this.setInputText = (target = this.cmtTextRef) => {
      const inputText = formatHtmlCmt(target.innerHTML);
      this.setState({
        inputText // inputHtml: e.currentTarget.innerHTML,

      }); // 获取选定对象

      const selection = window.getSelection(); // 设置最后光标对象

      if (selection.rangeCount > 0 && (this.cmtTextRef === selection.anchorNode || this.cmtTextRef.contains(selection.anchorNode))) {
        this.lastEditRange = selection.getRangeAt(0);
      }
    };

    this.hideEmojiDialog = e => {
      if (this.state.isEmojiShow && this.emojiDilaogRef && !this.emojiDilaogRef.contains(e.target)) {
        this.handleEmojiShow();
      }
    };

    this.hanldeFocus = () => {
      if (!login/* default.isLogin */.Z.isLogin()) {
        login/* default.loginMiniportal */.Z.loginMiniportal();
        return;
      }

      if (this.cmtTextRef && !this.state.isFocus) {
        this.setState({
          isFocus: true
        }, () => {
          this.cmtTextRef.focus();
        });
      }
    };

    this.handleBlur = () => {
      // 获取选定对象
      const selection = window.getSelection(); // 设置最后光标对象

      if (selection.rangeCount > 0 && (this.cmtTextRef === selection.anchorNode || this.cmtTextRef.contains(selection.anchorNode))) {
        this.lastEditRange = selection.getRangeAt(0);
      }

      this.setState({
        isFocus: false
      });
    };

    this.handleInput = e => {
      this.setInputText(e.currentTarget);
    };

    this.handleCmtSend = () => {
      const {
        onCmtSend
      } = this.props;
      const {
        inputText
      } = this.state;
      const lastLength = exceedLen(inputText);

      if (lastLength < 0) {
        popup/* default.show */.Z.show(0, '评论长度超出限制');
        return;
      }

      if (lastLength === maxlength) {
        popup/* default.show */.Z.show(0, '评论不能为空');
        return;
      }

      onCmtSend && onCmtSend(inputText).then(() => {
        this.setState({
          inputText: ''
        }, () => {
          if (this.cmtTextRef) {
            this.cmtTextRef.innerText = '';
          }
        });
      });
    };

    this.handlePaste = e => {
      e.preventDefault(); // 清除复制样式

      const {
        clipboardData
      } = e;

      if (clipboardData && clipboardData.items) {
        const pasteText = clipboardData.getData('text');
        const pasteContent = formatCmt2Html(pasteText);
        document.execCommand('insertHtml', false, pasteContent);
      }
    };

    this.handleEmojiInsert = emoji => {
      // this.cmtTextRef && this.cmtTextRef.focus();
      this.hanldeFocus();
      const textNode = document.createElement('img');
      textNode.title = emoji;
      textNode.src = getEmojiSrc(emoji);
      const selection = window.getSelection();
      let range = this.lastEditRange;

      if (!range) {
        range = document.createRange();
        this.cmtTextRef && this.cmtTextRef.appendChild(textNode);
        range.selectNode(textNode);
      } else {
        range.insertNode(textNode);
      }

      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      this.lastEditRange = range;
      this.setInputText();
    };

    this.handleEmojiShow = () => {
      if (!this.state.isEmojiShow) {
        document.addEventListener('click', this.hideEmojiDialog);
      } else {
        document.removeEventListener('click', this.hideEmojiDialog);
      }

      this.setState({
        isEmojiShow: !this.state.isEmojiShow
      });
    };

    this.handleTextClick = e => {
      const target = e.target;

      if (target.tagName.toLowerCase() === 'img') {
        // 获取选定对象
        const selection = window.getSelection(); // 设置最后光标对象

        let range = selection.rangeCount > 0 && selection.getRangeAt(0);

        if (!range) {
          range = this.lastEditRange || document.createRange();
        }

        range.selectNode(target);
        range.setStartAfter(target);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideEmojiDialog);
  }

  render() {
    const {
      type = 'default'
    } = this.props;
    const {
      isFocus,
      isEmojiShow,
      inputText
    } = this.state;
    const lastlen = exceedLen(inputText);
    return /*#__PURE__*/react.createElement("div", {
      className: "comment__input"
    }, /*#__PURE__*/react.createElement("div", {
      className: "comment__textarea c_bg_normal",
      onClick: this.hanldeFocus
    }, /*#__PURE__*/react.createElement("div", {
      className: "comment__textarea_inner"
    }, /*#__PURE__*/react.createElement("div", {
      className: "comment__textarea_default c_tx_thin comment__textarea_input--wrap",
      ref: this.setCmtDefRef,
      contentEditable: "true",
      suppressContentEditableWarning: true,
      style: {
        display: !isFocus && !inputText ? 'block' : 'none'
      }
    }, "\u671F\u5F85\u4F60\u7684\u795E\u8BC4\u8BBA"), /*#__PURE__*/react.createElement("div", {
      className: "comment__textarea_input c_tx_normal comment__textarea_input--wrap",
      ref: this.setCmtTextRef,
      contentEditable: "true",
      suppressContentEditableWarning: true,
      style: {
        display: isFocus || inputText ? 'block' : 'none'
      },
      onBlur: this.handleBlur,
      onInput: this.handleInput,
      onPaste: this.handlePaste,
      onClick: this.handleTextClick
    })), inputText && /*#__PURE__*/react.createElement("div", {
      className: `comment__tips ${lastlen > 0 ? 'c_tx_thin' : ''}`
    }, lastlen >= 0 ? '剩余' : '超过', /*#__PURE__*/react.createElement("span", {
      className: "c_tx_highlight"
    }, Math.abs(lastlen)), "\u5B57")), /*#__PURE__*/react.createElement("div", {
      className: "comment__actions"
    }, /*#__PURE__*/react.createElement("a", {
      className: "comment__face c_tx_thin",
      onClick: this.handleEmojiShow
    }), /*#__PURE__*/react.createElement("span", {
      className: "comment__actions_line c_tx_disabled"
    }, "|"), /*#__PURE__*/react.createElement("a", {
      className: "comment__btn",
      onClick: this.handleCmtSend
    }, type === 'reply' ? '回复' : '发布')), isEmojiShow && /*#__PURE__*/react.createElement(EmojiDialog, {
      setRef: this.setEmojiDialogRef,
      onEmojiInsert: this.handleEmojiInsert,
      onClose: this.handleEmojiShow
    }));
  }

}

/* harmony default export */ const component_CmtInput = (CmtInput);
;// CONCATENATED MODULE: ./src/component/comment/component/CmtItemView/CmtAvatar.tsx


// 默认头像图片
const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAADFBMVEXZ9OeZ4r6/7dal5sZSJjBmAAAAq0lEQVQoz63QwQ2DMAwFUAPiwIFjR+BQsURH4MCnPVQVIzACS/TeBTpO9iG2SPiRUqmV6tuTEn/bIn+sV6KFUYysDivJYTjQABM/BD09eV2iPBAzStUtqFLd8ypUY16tKsbXKuRlL680NP1Le9qcAy1LU8vTa/6wX7p7S3EWQQctafVfVNFZLIEun0z2tt33Yc4GTMYeez20uwvSlA5HrdYv1CyOtAjBX+prbXCeW1slzERMAAAAAElFTkSuQmCC';
const disableAvatar = '//y.qq.com/mediastyle/global/img/person_v9_150_black.png?max_age=2592000';

const Avatar = props => {
  const {
    data,
    isShow
  } = props;
  let avatar = defaultAvatar;

  if (data.avatar && data.avatar.length > 32) {
    avatar = utils/* default.fixUrl */.ZP.fixUrl(data.avatar);
  }

  const handleClick = () => {
    if (isShow && data.encryptUin) {// jumpProfile(data.encryptUin, cmtContext.type, 'avatar');
      // window.open(`${getPageUrl(PAGE_KEY.PROFILE)}?uin=${data.encryptUin}`, '__blank');
    }
  };

  return /*#__PURE__*/react.createElement("a", {
    className: "comment__avatar",
    onClick: handleClick
  }, /*#__PURE__*/react.createElement("img", {
    src: isShow ? avatar : disableAvatar,
    alt: data.nick,
    "data-qar-def": defaultAvatar
  }));
};

/* harmony default export */ const CmtAvatar = (Avatar);
// EXTERNAL MODULE: ./src/component/diy_menu/index.tsx
var diy_menu = __webpack_require__(90658);
;// CONCATENATED MODULE: ./src/component/comment/component/CmtItemView/index.tsx








const deletePermission = 1 << 9; // 当前登录用户的对这条评论的权限，每一位对应一个权限，权限位为：删除|拉黑|封号|禁言|置顶|选热评、取消热评|举报|点赞|回复|评论

/**
     * 转义
     * @method encodeHTML
     * @desc  对字符串进行HTML编码  即:把<>"'/\变成&#xx格式
     * @example
        var str='<"';
        str.encodeHTML();
        alert(str);
     */

const encodeHTML = str => {
  let rtstr = '';

  for (let i = 0; i < str.length; i++) {
    if (/\W/.test(str[i]) && str.charCodeAt(i) < 256) {
      rtstr += `&#${str.charCodeAt(i)};`;
    } else {
      rtstr += str[i];
    }
  }

  return rtstr;
};

const parseContent = content => {
  const html = encodeHTML(content).replace(/(&#10;&#13;)|(&#13;&#10;)|(&#13;&#92;n)|(&#92;n&#13;)|(&#92;n)|(&#10;)|(&#13;)/g, '<br>');
  return /*#__PURE__*/react.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: formatCmt2Html(html)
    }
  });
};

class CmtItemView extends react.PureComponent {
  constructor(...args) {
    super(...args);
    this.viewRef = void 0;
    this.state = {
      isHover: false
    };

    this.setViewRef = ref => {
      this.viewRef = ref;
    };

    this.handleMouseOver = e => {
      e.stopPropagation();
      this.setState({
        isHover: true
      });
    };

    this.handleMouseLeave = e => {
      e.stopPropagation();
      this.setState({
        isHover: false
      });
    };

    this.handleReplyCmtIdSet = () => {
      const {
        data,
        isReplying,
        onReplyCmtIdSet
      } = this.props;
      onReplyCmtIdSet && onReplyCmtIdSet(isReplying ? '' : data.cmId);
    };

    this.handleCmtPraise = () => {
      const {
        data,
        onCmtPraise
      } = this.props;
      onCmtPraise && onCmtPraise(data);
    };

    this.handleCmtDel = () => {
      const {
        data,
        onCmtDel
      } = this.props;
      onCmtDel && onCmtDel(data);
    };

    this.handleScrollIntoView = () => {
      if (this.viewRef) {
        // scrollIntoView兼容性不太好，不过目前pc和mac内都没有问题
        this.viewRef.scrollIntoView && this.viewRef.scrollIntoView(); // const rect = this.viewRef.getBoundingClientRect();
        // if (rect.top < 0 || rect.top > window.innerHeight) {
        //     // 不在视口内，则滚动到窗口内
        // 此方法不太适用这里，窗口没有滚动，只是layout_detail这个div内部滚动
        //     window.scrollTo(window.scrollX, window.scrollY + rect.top);
        // }
      }
    };

    this.handleCmtSend = content => {
      const {
        data,
        onCmtReply
      } = this.props;
      return onCmtReply(content, data);
    };

    this.handleReport = () => {// const { data } = this.props;
      // handleExpose(data.cmId);
    };

    this.handleNickClick = () => {
      const {
        data: {
          isShow,
          encryptUin
        }
      } = this.props;

      if (isShow && encryptUin) {// jumpProfile(encryptUin, this.context.type, 'nick');
      }
    };

    this.handleContextMenu = ev => {
      var _diyMenu$current2;

      const {
        data
      } = this.props;
      const {
        isShow
      } = data;

      if (!isShow) {
        return;
      }

      const {
        target
      } = ev;
      const selection = window.getSelection();
      let range = selection.rangeCount > 0 && selection.getRangeAt(0);

      if (!range) {
        var _diyMenu$current;

        range = document.createRange();
        range.selectNode(target);
        selection.addRange(range);
        selection.removeAllRanges();
        (_diyMenu$current = diy_menu/* default.current */.Z.current) === null || _diyMenu$current === void 0 ? void 0 : _diyMenu$current.hide();
      }

      (_diyMenu$current2 = diy_menu/* default.current */.Z.current) === null || _diyMenu$current2 === void 0 ? void 0 : _diyMenu$current2.showMenu(ev, [{
        text: '复制评论',
        iconClass: '',
        fn: () => {
          try {
            var _diyMenu$current3;

            document.execCommand('Copy');
            popup/* default.show */.Z.show(0, '复制成功！', '', 1000);
            (_diyMenu$current3 = diy_menu/* default.current */.Z.current) === null || _diyMenu$current3 === void 0 ? void 0 : _diyMenu$current3.hide();
          } catch (error) {
            console.warn('Copy to clipboard failed.', error);
            return false;
          }
        }
      }]);
    };
  }

  render() {
    const {
      data,
      isReplying,
      children,
      isSimple
    } = this.props;
    const {
      isShow
    } = data;

    if (isSimple) {
      return /*#__PURE__*/react.createElement("li", {
        className: "comment__sub_list_item",
        ref: this.setViewRef
      }, /*#__PURE__*/react.createElement("div", {
        className: "comment__text item"
      }, /*#__PURE__*/react.createElement("span", {
        className: "c_tx_current"
      }, /*#__PURE__*/react.createElement("a", {
        className: "c_tx_current",
        onClick: this.handleNickClick
      }, isShow ? data.nick : '就是爱音乐'), data.vipIcon && isShow && /*#__PURE__*/react.createElement("span", {
        className: "vip_icon"
      }, /*#__PURE__*/react.createElement("img", {
        src: utils/* default.fixUrl */.ZP.fixUrl(data.vipIcon),
        alt: "\u7EFF\u94BBICON"
      })), "\uFF1A"), /*#__PURE__*/react.createElement("span", {
        className: `${isShow ? '' : 'c_tx_thin'}`,
        onContextMenu: this.handleContextMenu
      }, isShow ? parseContent(data.content) : '- 该评论已删除 -')), data.repliedCmts && data.repliedCmts.map(item => {
        if (!item.cmId) {
          return null;
        }

        return /*#__PURE__*/react.createElement("p", {
          key: item.cmId,
          className: "comment__text comment__text--history",
          onContextMenu: this.handleContextMenu
        }, /*#__PURE__*/react.createElement("a", {
          className: "comment__origin_name c_tx_current"
        }, item.nick, ":"), "\xA0", parseContent(item.content));
      }), isShow && /*#__PURE__*/react.createElement("div", {
        className: "comment__sub_opt"
      }, /*#__PURE__*/react.createElement("a", {
        className: `comment__zan ${data.isPraised ? 'c_tx_current' : ''}`,
        onClick: this.handleCmtPraise
      }, /*#__PURE__*/react.createElement("i", {
        className: `icon_skin ${data.isPraised ? 'icon_comment_liked' : 'icon_comment_like'}`
      }), data.praiseNum > 0 ? data.praiseNum : '')));
    }

    return /*#__PURE__*/react.createElement("li", {
      className: "comment__list_item c_b_normal",
      ref: this.setViewRef
    }, /*#__PURE__*/react.createElement("div", {
      onMouseOver: this.handleMouseOver,
      onMouseLeave: this.handleMouseLeave
    }, /*#__PURE__*/react.createElement(CmtAvatar, {
      isShow: isShow,
      data: data
    }), /*#__PURE__*/react.createElement("h4", {
      className: "comment__title"
    }, /*#__PURE__*/react.createElement("a", {
      className: "c_tx_thin",
      onClick: this.handleNickClick
    }, isShow ? data.nick : '就是爱音乐'), data.vipIcon && isShow && /*#__PURE__*/react.createElement("span", {
      className: "vip_icon"
    }, /*#__PURE__*/react.createElement("img", {
      src: utils/* default.fixUrl */.ZP.fixUrl(data.vipIcon),
      alt: "\u7EFF\u94BBICON"
    }))), /*#__PURE__*/react.createElement("div", {
      className: "comment__date c_tx_thin"
    }, utils/* default.formatDate */.ZP.formatDate(data.pubTime)), /*#__PURE__*/react.createElement("p", {
      className: `comment__text ${isShow ? '' : 'c_tx_thin'}`,
      onContextMenu: this.handleContextMenu
    }, isShow ? parseContent(data.content) : '- 该评论已删除 -'), data.repliedCmts && data.repliedCmts.map(item => {
      if (!item.cmId) {
        return null;
      }

      const handleProfileJump = () => {
        if (isShow && item.encryptUin) {// jumpProfile(item.encryptUin, this.context.type, 'content_nick');
          // window.open(`${getPageUrl(PAGE_KEY.PROFILE)}?uin=${item.encryptUin}`, '__blank');
        }
      };

      return /*#__PURE__*/react.createElement("p", {
        key: item.cmId,
        className: "comment__text",
        onContextMenu: this.handleContextMenu
      }, /*#__PURE__*/react.createElement("a", {
        className: "comment__origin_name c_tx_current",
        onClick: handleProfileJump
      }, item.nick, ":"), "\xA0", parseContent(item.content));
    }), isShow && /*#__PURE__*/react.createElement("div", {
      className: "comment__opt"
    }, /*#__PURE__*/react.createElement("a", {
      className: `comment__zan ${data.isPraised ? 'c_tx_current' : ''}`,
      onClick: this.handleCmtPraise
    }, /*#__PURE__*/react.createElement("i", {
      className: "icon_skin icon_comment_like"
    }), data.praiseNum > 0 ? data.praiseNum : ''), /*#__PURE__*/react.createElement("a", {
      className: "comment__feedback c_tx_thin",
      onClick: this.handleReplyCmtIdSet
    }, isReplying ? '取消' : '回复'), data.permission >= deletePermission && /*#__PURE__*/react.createElement("a", {
      className: "comment__delete c_tx_thin",
      onClick: this.handleCmtDel
    }, "\u5220\u9664"), this.state.isHover && /*#__PURE__*/react.createElement("a", {
      className: "comment__report c_tx_thin",
      onClick: this.handleReport
    }, "\u4E3E\u62A5"))), isReplying && data.isShow && /*#__PURE__*/react.createElement("div", {
      className: "comment_repeat"
    }, /*#__PURE__*/react.createElement(component_CmtInput, {
      type: "reply",
      onCmtSend: this.handleCmtSend,
      onCancel: this.handleReplyCmtIdSet
    })), children && react.Children.map(children, child => {
      if (! /*#__PURE__*/(0,react.isValidElement)(child)) {
        return child;
      }

      const props = {
        onRankHide: this.handleScrollIntoView
      };
      return /*#__PURE__*/(0,react.cloneElement)(child, props);
    }));
  }

}

CmtItemView.contextType = context;
/* harmony default export */ const component_CmtItemView = (CmtItemView);
;// CONCATENATED MODULE: ./src/component/comment/component/SubCmtList/index.tsx




class SubCmtList extends react.Component {
  constructor(props) {
    super(props);

    this.hasMore = (needLoad = false) => {
      const {
        subCmtState,
        replyCnt,
        isReplyCmt
      } = this.props;
      const {
        rankType,
        curPage
      } = this.state;
      const {
        idListByRank = {},
        pageSize,
        total
      } = subCmtState || {};
      const pageNum = curPage[rankType] || 1; // 按已展示的长度进行计算，而不是已加载

      let len = pageNum * pageSize;

      if (needLoad) {
        // 按已加载的长度进行计算
        len = idListByRank[rankType] && idListByRank[rankType].length;
      }

      if (replyCnt || total) {
        return (replyCnt || total) > ~~len;
      }

      return total !== 0 && isReplyCmt;
    };

    this.loadReplyCmtList = async () => {
      // 这里根据数据情况判断是否还需要发起加载请求
      const {
        rootCmId,
        subCmtState,
        onReplyCmtLoad
      } = this.props;
      const {
        curPage,
        rankType
      } = this.state;
      const pageNum = curPage[rankType];
      const {
        isLoading,
        pageSize,
        idListByRank = {}
      } = subCmtState || {};

      if (isLoading) {
        return false;
      }

      const len = idListByRank[rankType] && idListByRank[rankType].length;

      if (pageNum * pageSize < len) {
        // 已加载的数据能满足展示页数
        return true;
      }

      if (!this.hasMore(true)) {
        // 已全部加载完毕
        return true;
      }

      return onReplyCmtLoad(rootCmId, rankType);
    };

    this.handleLoadMore = () => {
      const {
        onRankHide
      } = this.props;

      if (!this.hasMore()) {
        this.setState({
          isRankShow: false,
          curPage: {
            [CMT_RANK_TYPE.TIME]: 1,
            [CMT_RANK_TYPE.HOT]: 1
          }
        }, () => {
          onRankHide && onRankHide();
        });
        return;
      }

      this.loadReplyCmtList().then(isSuccess => {
        if (isSuccess) {
          this.setState(prevState => ({ ...prevState,
            curPage: { ...prevState.curPage,
              [prevState.rankType]: prevState.curPage[prevState.rankType] + 1
            }
          }));
        }
      });
    };

    this.handleCmtPraise = cmt => {
      const {
        rootCmId,
        onSubCmtPraise
      } = this.props;
      onSubCmtPraise && onSubCmtPraise(rootCmId, cmt);
    };

    this.handleCmtDel = cmt => {
      const {
        rootCmId,
        onSubCmtDel
      } = this.props;
      onSubCmtDel && onSubCmtDel(rootCmId, cmt);
    };

    this.handleRankShowChange = () => {
      const {
        subCmtState,
        onRankHide
      } = this.props;
      const {
        isRankShow
      } = this.state;

      if (!isRankShow) {
        this.loadReplyCmtList().then(isSuccess => {
          if (isSuccess) {
            this.setState(prevState => ({ ...prevState,
              isRankShow: true // curPage: {
              //     ...prevState.curPage,
              //     [prevState.rankType]: prevState.curPage[prevState.rankType] + 1,
              // },

            }));
          }
        });
      } else if (subCmtState && !subCmtState.isLoading) {
        this.setState({
          isRankShow: false,
          curPage: {
            [CMT_RANK_TYPE.TIME]: 1,
            [CMT_RANK_TYPE.HOT]: 1
          }
        }, () => {
          onRankHide && onRankHide();
        });
      }
    };

    this.handleHotRank = () => {
      const {
        subCmtState
      } = this.props;
      const {
        isRankShow,
        rankType
      } = this.state;

      if (isRankShow && rankType !== CMT_RANK_TYPE.HOT && !subCmtState.isLoading) {
        this.setState({
          rankType: CMT_RANK_TYPE.HOT
        }, () => {
          this.loadReplyCmtList();
        });
      }
    };

    this.handleTimeRank = () => {
      const {
        subCmtState
      } = this.props;
      const {
        isRankShow,
        rankType
      } = this.state;

      if (isRankShow && rankType !== CMT_RANK_TYPE.TIME && !subCmtState.isLoading) {
        this.setState({
          rankType: CMT_RANK_TYPE.TIME
        }, () => {
          this.loadReplyCmtList();
        });
      }
    };

    this.handleCmtReply = (content, cmt) => {
      const {
        rootCmId,
        onCmtReply
      } = this.props;
      return onCmtReply(content, cmt, rootCmId);
    };

    this.state = {
      isRankShow: false,
      rankType: CMT_RANK_TYPE.HOT,
      curPage: {
        [CMT_RANK_TYPE.TIME]: 1,
        [CMT_RANK_TYPE.HOT]: 1
      }
    };
  }

  render() {
    const {
      isReplyCmt,
      subCmtIdList,
      subCmtById,
      subCmtState,
      replyCnt,
      replyCmId,
      onReplyCmtIdSet
    } = this.props;

    if (!replyCnt && !isReplyCmt) {
      return null;
    }

    const {
      isRankShow,
      curPage,
      rankType
    } = this.state;
    let subList;

    if (isRankShow && subCmtState && subCmtState.idListByRank) {
      const {
        pageSize,
        idListByRank
      } = subCmtState;
      subList = idListByRank[rankType].slice(0, curPage[rankType] * pageSize).map(i => subCmtById[i]);
    }

    if (!subList || subList.length === 0) {
      subList = subCmtIdList.map(id => subCmtById[id]);
    }

    return /*#__PURE__*/react.createElement("div", {
      className: "comment__reply"
    }, /*#__PURE__*/react.createElement("div", {
      className: "comment__reply_hd"
    }, /*#__PURE__*/react.createElement("a", {
      className: `comment__show_all_reply c_tx_thin ${isRankShow ? 'show' : ''}`,
      onClick: this.handleRankShowChange
    }, isReplyCmt ? '查看回复' : `查看${replyCnt || 0}条回复`), isRankShow && /*#__PURE__*/react.createElement("div", {
      className: "comment__sort"
    }, /*#__PURE__*/react.createElement("a", {
      className: `comment__sort_item ${rankType === CMT_RANK_TYPE.HOT ? '' : 'c_tx_thin'}`,
      onClick: this.handleHotRank
    }, "\u70ED\u95E8"), /*#__PURE__*/react.createElement("div", {
      className: "comment__sort_line c_txt2"
    }), /*#__PURE__*/react.createElement("a", {
      className: `comment__sort_item ${rankType === CMT_RANK_TYPE.TIME ? '' : 'c_tx_thin'}`,
      onClick: this.handleTimeRank
    }, "\u65F6\u95F4"))), subList && subList.length > 0 && /*#__PURE__*/react.createElement("div", {
      className: "comment__reply_bd c_bg_normal"
    }, /*#__PURE__*/react.createElement("ul", {
      className: "comment__list"
    }, subList.map(item => {
      if (!item || !item.cmId) {
        return null;
      }

      const {
        cmId
      } = item;
      return /*#__PURE__*/react.createElement(component_CmtItemView, {
        key: cmId,
        data: item,
        isReplying: cmId === replyCmId,
        onReplyCmtIdSet: onReplyCmtIdSet,
        onCmtPraise: this.handleCmtPraise,
        onCmtDel: this.handleCmtDel,
        onCmtReply: this.handleCmtReply,
        isSimple: !isRankShow
      });
    })), isRankShow && /*#__PURE__*/react.createElement("a", {
      className: "comment__reply_more c_tx_thin",
      onClick: this.handleLoadMore
    }, this.hasMore() ? '显示更多回复' : '收起')));
  }

}

/* harmony default export */ const component_SubCmtList = (SubCmtList);
;// CONCATENATED MODULE: ./src/component/comment/component/CmtList/index.tsx




class CmtList extends react.Component {
  constructor(...args) {
    super(...args);

    this.handleRplyCmtIdSet = cmId => {
      const {
        modId,
        onReplyCmtIdSet
      } = this.props;
      onReplyCmtIdSet(modId, cmId);
    };

    this.handleCmtPraise = cmt => {
      const {
        onCmtPraise
      } = this.props;
      onCmtPraise && onCmtPraise(cmt);
    };

    this.handleMoreClick = () => {
      const {
        modId,
        onCmtListLoad
      } = this.props;
      onCmtListLoad && onCmtListLoad(modId);
    };
  }

  render() {
    const {
      className,
      title,
      moreTitle,
      modId,
      replyingConf,
      cmtById,
      subCmtById,
      subCmtStateById,
      modState,
      onReplyCmtLoad,
      onSubCmtPraise,
      onCmtDel,
      onSubCmtDel,
      onCmtReply
    } = this.props;

    if (!modState || !modState.idList || modState.idList.length === 0) {
      return null;
    }

    const isReplying = replyingConf.modId === modId;
    const isShowAll = modState.total > modState.curPage * modState.pageSize;
    return /*#__PURE__*/react.createElement("div", {
      className: className
    }, /*#__PURE__*/react.createElement("div", {
      className: "comment_type__title c_b_normal"
    }, /*#__PURE__*/react.createElement("h2", null, title)), /*#__PURE__*/react.createElement("ul", {
      className: "comment__list"
    }, modState.idList.slice(0, modState.curPage * modState.pageSize).map(id => {
      const cmtData = cmtById[id];

      if (!id || !cmtData || !cmtData.cmId) {
        return null;
      }

      const {
        cmId,
        subCmtIdList
      } = cmtData;
      const isReplyCmt = !!cmtData.repliedCmts && cmtData.repliedCmts.length > 0;
      let rootCmId = cmId;

      if (isReplyCmt) {
        rootCmId = cmtData.repliedCmts[cmtData.repliedCmts.length - 1].cmId;
      }

      const subCmtState = subCmtStateById[rootCmId];
      return /*#__PURE__*/react.createElement(component_CmtItemView, {
        key: cmId,
        data: cmtData,
        isReplying: isReplying && cmId === replyingConf.cmId,
        onReplyCmtIdSet: this.handleRplyCmtIdSet,
        onCmtPraise: this.handleCmtPraise,
        onCmtDel: onCmtDel,
        onCmtReply: onCmtReply
      }, (cmtData.replyCnt > 0 || isReplyCmt) && /*#__PURE__*/react.createElement(component_SubCmtList, {
        rootCmId: rootCmId,
        isReplyCmt: isReplyCmt,
        subCmtIdList: subCmtIdList,
        subCmtById: subCmtById,
        subCmtState: subCmtState,
        replyCmId: isReplying && replyingConf.cmId || '',
        replyCnt: cmtData.replyCnt || 0,
        onReplyCmtIdSet: this.handleRplyCmtIdSet,
        onReplyCmtLoad: onReplyCmtLoad,
        onSubCmtPraise: onSubCmtPraise,
        onSubCmtDel: onSubCmtDel,
        onCmtReply: onCmtReply
      }));
    })), moreTitle && modState.total > modState.pageSize && /*#__PURE__*/react.createElement("div", {
      className: `${isShowAll ? 'comment__show_all' : 'comment__show_all--on'}`
    }, /*#__PURE__*/react.createElement("a", {
      className: "comment__show_all_link c_tx_thin c_bg_normal",
      onClick: this.handleMoreClick
    }, isShowAll ? moreTitle : '收起')));
  }

}

/* harmony default export */ const component_CmtList = (CmtList);
;// CONCATENATED MODULE: ./src/component/comment/component/Comment/index.tsx







const CmtModConfList = [{
  key: CMT_MOD_KEY.AIR,
  className: 'mod_hot_comment',
  moreTitle: '全部明星空降',
  // eslint-disable-next-line react/display-name
  title: () => {
    return /*#__PURE__*/react.createElement(react.Fragment, null, "\u660E\u661F\u7A7A\u964D", /*#__PURE__*/react.createElement("div", {
      className: "comment_red_tag"
    }, /*#__PURE__*/react.createElement("div", {
      className: "comment_red_tag__dot"
    }), "\u7A7A\u964D\u4E2D"));
  }
}, {
  key: CMT_MOD_KEY.MUSICIAN,
  className: 'mod_hot_comment',
  title: '音乐人说',
  moreTitle: '全部音乐人说'
}, {
  key: CMT_MOD_KEY.NEW_HOT,
  className: 'mod_hot_comment',
  title: '近期热评'
}, {
  key: CMT_MOD_KEY.HOT,
  className: 'mod_hot_comment',
  title: '精彩评论',
  moreTitle: '更多精彩评论'
}, {
  key: CMT_MOD_KEY.NEW,
  className: 'mod_hot_comment',
  title: state => `全部评论(${state.total})`
}];

class Comment extends react.Component {
  constructor(...args) {
    super(...args);

    this.handleScroll = () => {
      const {
        onScrollLoad
      } = this.props;
      onScrollLoad && onScrollLoad();
    };

    this.handleReplyCmtIdSet = (modId, cmId) => {
      const {
        allowComment
      } = this.props;

      if (!allowComment) {
        popup/* default.show */.Z.show(0, '评论系统升级中');
        return;
      }

      if (!!cmId) {// reportPvg(this.context.type, 'input_show');
      }

      const {
        setNewState
      } = this.props;
      setNewState({
        replingConf: {
          modId,
          cmId
        }
      });
    };

    this.handleCmtPraise = cmt => {
      const {
        onCmtPraise
      } = this.props;
      onCmtPraise && onCmtPraise(cmt);
    };

    this.handleCmtListLoad = modId => {
      const {
        onCmtListLoad
      } = this.props;
      onCmtListLoad && onCmtListLoad(modId);
    };
  }

  render() {
    const {
      allowComment,
      cmtById,
      subCmtById,
      subCmtStateById,
      replingConf,
      onReplyCmtLoad,
      onSubCmtPraise,
      onCmtDel,
      onSubCmtDel,
      onCmtSend,
      onCmtReply
    } = this.props;
    return /*#__PURE__*/react.createElement(scroll_view, {
      boxClass: "layout_detail",
      onChangeScroll: this.handleScroll
    }, /*#__PURE__*/react.createElement("div", {
      className: "layout_cont"
    }, /*#__PURE__*/react.createElement("div", {
      className: "mod_comment"
    }, allowComment && /*#__PURE__*/react.createElement(component_CmtInput, {
      onCmtSend: onCmtSend
    }), CmtModConfList.map(conf => {
      const modState = this.props[conf.key];

      if (!modState || modState.total === 0) {
        if (conf.key === CMT_MOD_KEY.NEW) {
          return /*#__PURE__*/react.createElement("div", {
            key: conf.key,
            className: "mod_comment_none"
          }, allowComment ? '还没有人评论，快来抢沙发吧~' : '评论系统升级中');
        }

        return null;
      }

      const title = typeof conf.title === 'function' ? conf.title(modState) : conf.title;
      return /*#__PURE__*/react.createElement(component_CmtList, {
        key: conf.key,
        modId: conf.key,
        className: conf.className,
        title: title,
        moreTitle: conf.moreTitle,
        replyingConf: replingConf,
        modState: modState,
        cmtById: cmtById,
        subCmtById: subCmtById,
        subCmtStateById: subCmtStateById,
        onReplyCmtIdSet: this.handleReplyCmtIdSet,
        onCmtPraise: this.handleCmtPraise,
        onSubCmtPraise: onSubCmtPraise,
        onCmtDel: onCmtDel,
        onSubCmtDel: onSubCmtDel,
        onCmtListLoad: this.handleCmtListLoad,
        onReplyCmtLoad: onReplyCmtLoad,
        onCmtReply: onCmtReply
      });
    }))));
  }

}

Comment.contextType = context;
/* harmony default export */ const component_Comment = (Comment);
// EXTERNAL MODULE: ./src/lib/common/dialog.tsx
var dialog = __webpack_require__(7273);
// EXTERNAL MODULE: ./src/tool/qmfeUnityReport/index.ts
var qmfeUnityReport = __webpack_require__(42643);
;// CONCATENATED MODULE: ./src/component/comment/index.tsx













class CmtContainer extends react.Component {
  constructor(props) {
    super(props);

    this.initCmtData = () => {
      const {
        type,
        id
      } = this.props; // reportPvg(this.state.contextValue.type, 'load');

      const pageSize = 25;
      getNewCmtList({
        type,
        id,
        pageSize,
        withHot: 1
      }).then(data => {
        let cmtById = {};
        let subCmtById = {};
        const newState = {
          allowComment: !!data.AllowComment,
          isAuthor: !!data.IsAuthor,
          canMusicianSay: !!data.CanMusicianSay
        };

        if (data.CommentList) {
          const {
            cmtById: byId,
            total,
            idList,
            subCmtById: subById,
            hasMore
          } = formatCmtList(data.CommentList);
          newState[CMT_MOD_KEY.NEW] = {
            curPage: 1,
            pageSize,
            total,
            idList,
            hasMore
          };
          cmtById = { ...cmtById,
            ...byId
          };
          subCmtById = { ...subCmtById,
            ...subById
          };
        }

        if (data.CommentList2 && data.CommentList2.Comments) {
          const {
            cmtById: byId,
            total,
            idList,
            subCmtById: subById,
            hasMore
          } = formatCmtList(data.CommentList2);
          newState[CMT_MOD_KEY.HOT] = {
            hotType: CMT_HOT_TYPE.TOP,
            total,
            hasMore,
            curPage: 1,
            pageSize: 15,
            idList
          };
          cmtById = { ...cmtById,
            ...byId
          };
          subCmtById = { ...subCmtById,
            ...subById
          };
        }

        if (data.CommentList3 && data.CommentList3.Comments) {
          const {
            cmtById: byId,
            total,
            idList,
            subCmtById: subById,
            hasMore
          } = formatCmtList(data.CommentList3);
          newState[CMT_MOD_KEY.NEW_HOT] = {
            curPage: 1,
            hasMore,
            pageSize: total,
            idList,
            total
          };
          cmtById = { ...cmtById,
            ...byId
          };
          subCmtById = { ...subCmtById,
            ...subById
          };
        }

        this.setState(prevState => ({ ...prevState,
          ...newState,
          isLoading: false,
          cmtById: { ...prevState.cmtById,
            ...cmtById
          },
          subCmtById: { ...prevState.subCmtById,
            ...subCmtById
          }
        }));
      }).catch(() => {
        popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
      });
      const musicianPageSize = 15;
      getHotCmtList({
        type,
        id,
        pageSize: musicianPageSize,
        hotType: CMT_HOT_TYPE.MUSICIAN,
        withAirborne: 1
      }).then(data => {
        let cmtById = {};
        let subCmtById = {};
        const newState = {
          allowComment: !!data.AllowComment,
          isAuthor: !!data.IsAuthor,
          canMusicianSay: !!data.CanMusicianSay
        };

        if (data.CommentList && data.CommentList.Comments) {
          const {
            cmtById: byId,
            total,
            idList,
            subCmtById: subById,
            hasMore
          } = formatCmtList(data.CommentList);
          newState[CMT_MOD_KEY.MUSICIAN] = {
            hotType: CMT_HOT_TYPE.MUSICIAN,
            curPage: 1,
            pageSize: musicianPageSize,
            total,
            idList,
            hasMore
          };
          cmtById = { ...cmtById,
            ...byId
          };
          subCmtById = { ...subCmtById,
            ...subById
          };
        }

        if (data.CommentList2 && data.CommentList2.Comments) {
          const {
            cmtById: byId,
            total,
            idList,
            subCmtById: subById,
            hasMore
          } = formatCmtList(data.CommentList2);
          newState[CMT_MOD_KEY.AIR] = {
            hotType: CMT_HOT_TYPE.AIRBORNE,
            curPage: 1,
            pageSize: musicianPageSize,
            total,
            idList,
            hasMore
          };
          cmtById = { ...cmtById,
            ...byId
          };
          subCmtById = { ...subCmtById,
            ...subById
          }; // 设置刷新按钮
          // if (this.props.setReload && typeof this.props.setReload === 'function') {
          //     this.props.setReload();
          // }
        }

        this.setState(prevState => ({ ...prevState,
          ...newState,
          cmtById: { ...prevState.cmtById,
            ...cmtById
          },
          subCmtById: { ...prevState.subCmtById,
            ...subCmtById
          }
        }));
      }).catch(() => {
        popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
      });
    };

    this.handleCmtPraise = cmt => {
      if (!login/* default.isLogin */.Z.isLogin()) {
        login/* default.loginMiniportal */.Z.loginMiniportal();
        return;
      }

      const {
        cmId,
        isPraised,
        praiseNum
      } = cmt; // 乐观更新

      this.setState(prevState => ({ ...prevState,
        cmtById: { ...prevState.cmtById,
          [cmId]: { ...cmt,
            praiseNum: praiseNum + (isPraised ? -1 : 1),
            isPraised: !isPraised
          }
        }
      })); // reportPvg(this.state.contextValue.type, 'praise');

      updateHotCmt({
        id: cmId,
        type: isPraised ? CMT_UPDATE_TYPE.CANCEL_PRAISE : CMT_UPDATE_TYPE.PRAISE
      }).then(data => {
        if (data.code === 0 && data.subcode === 0) {
          return;
        }

        return Promise.reject(data);
      }).catch(() => {
        popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
        this.setState(prevState => ({ ...prevState,
          cmtById: { ...prevState.cmtById,
            [cmId]: { ...cmt,
              praiseNum,
              isPraised
            }
          }
        }));
      });
    };

    this.setNewState = obj => {
      this.setState(prevState => ({ ...prevState,
        ...obj
      }));
    };

    this.handleCmtListLoad = modId => {
      const modState = this.state[modId];

      if (!modState || !modState.hotType || modState.isLoading) {
        // 没有该模块的state，或者没有hotType（非空降/热评等），或者已经在加载中，则无需执行
        // 全部评论的加载由滚动加载逻辑管理，此处不涉及
        return;
      }

      if (modState.curPage * modState.pageSize >= modState.total) {
        // 已显示完所有评论，再点击则收起评论
        this.setNewState({
          [modId]: { ...modState,
            curPage: 1
          }
        });
        return;
      }

      if (modState.total <= modState.idList.length) {
        // 评论已加载完毕，只是收起了，每次点击露出一页
        this.setNewState({
          [modId]: { ...modState,
            curPage: modState.curPage + 1
          }
        });
        return;
      }

      if (!modState.hasMore) {
        return;
      } // 其他情况，需要加载下一页评论
      // reportPvg(this.state.contextValue.type, 'more_hot');


      this.setNewState({
        [modId]: { ...modState,
          isLoading: true
        }
      });
      const {
        type,
        id
      } = this.props;
      const {
        cmtById
      } = this.state;
      const lastCmt = cmtById[modState.idList[modState.idList.length - 1]];
      getHotCmtList({
        type,
        id,
        pageNum: modState.curPage,
        pageSize: modState.pageSize,
        hotType: modState.hotType,
        lastCommentSeqNo: lastCmt.seqNo
      }).then(data => {
        let newCmtById = {};
        let subCmtById = {};
        const newState = {
          allowComment: !!data.AllowComment,
          isAuthor: !!data.IsAuthor,
          canMusicianSay: !!data.CanMusicianSay
        };

        if (data.CommentList && data.CommentList.Comments) {
          const {
            cmtById: byId,
            total,
            idList,
            subCmtById: subById,
            hasMore
          } = formatCmtList(data.CommentList);
          newState[modId] = { ...modState,
            hotType: modState.hotType,
            curPage: modState.curPage + 1,
            pageSize: modState.pageSize,
            total,
            hasMore,
            idList: [...modState.idList, ...idList],
            isLoading: false
          };
          newCmtById = { ...newCmtById,
            ...byId
          };
          subCmtById = { ...subCmtById,
            ...subById
          };
        }

        this.setState(prevState => ({ ...prevState,
          ...newState,
          cmtById: { ...prevState.cmtById,
            ...newCmtById
          },
          subCmtById: { ...prevState.subCmtById,
            ...subCmtById
          }
        }));
      }).catch(() => {
        popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
      });
    };

    this.handleScrollLoad = () => {
      const modId = CMT_MOD_KEY.NEW;
      const modState = this.state[modId];

      if (!modState || modState.isLoading) {
        // 没有该模块的state，或者已经在加载中，则无需执行
        return;
      }

      if (modState.total <= modState.idList.length) {
        // 评论已加载完毕，只是收起了，每次点击露出一页
        this.setNewState({
          [modId]: { ...modState,
            curPage: modState.curPage + 1
          }
        });
        return;
      }

      if (!modState.hasMore) {
        return;
      } // 其他情况，需要加载下一页评论
      // reportPvg(this.state.contextValue.type, 'load');


      this.setNewState({
        [modId]: { ...modState,
          isLoading: true
        }
      });
      const {
        type,
        id
      } = this.props;
      const {
        cmtById
      } = this.state;
      const lastCmt = cmtById[modState.idList[modState.idList.length - 1]];
      getNewCmtList({
        type,
        id,
        pageNum: modState.curPage,
        pageSize: modState.pageSize,
        lastCommentSeqNo: lastCmt.seqNo
      }).then(data => {
        let newCmtById = {};
        let subCmtById = {};
        const newState = {
          allowComment: !!data.AllowComment,
          isAuthor: !!data.IsAuthor,
          canMusicianSay: !!data.CanMusicianSay
        };

        if (data.CommentList && data.CommentList.Comments) {
          const {
            cmtById: byId,
            total,
            idList,
            subCmtById: subById,
            hasMore
          } = formatCmtList(data.CommentList);
          newState[modId] = { ...modState,
            hotType: modState.hotType,
            curPage: modState.curPage + 1,
            pageSize: modState.pageSize,
            total,
            hasMore,
            idList: [...modState.idList, ...idList],
            isLoading: false
          };
          newCmtById = { ...newCmtById,
            ...byId
          };
          subCmtById = { ...subCmtById,
            ...subById
          };
        }

        this.setState(prevState => ({ ...prevState,
          ...newState,
          cmtById: { ...prevState.cmtById,
            ...newCmtById
          },
          subCmtById: { ...prevState.subCmtById,
            ...subCmtById
          }
        }));
      }).catch(() => {
        popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
      });
    };

    this.handleReplyCmtLoad = async (rootCmId, rankType) => {
      const {
        subCmtById,
        subCmtStateById
      } = this.state;
      let subCmtState = subCmtStateById[rootCmId];

      if (!subCmtState) {
        subCmtState = {
          total: 0,
          isLoading: true,
          hasMore: true,
          pageSize: 10,
          idListByRank: {
            [CMT_RANK_TYPE.TIME]: [],
            [CMT_RANK_TYPE.HOT]: []
          }
        };
        this.setState({
          subCmtStateById: { ...subCmtStateById,
            [rootCmId]: subCmtState
          }
        });
      } else {
        this.setState({
          subCmtStateById: { ...subCmtStateById,
            [rootCmId]: { ...subCmtState,
              isLoading: true
            }
          }
        });
      }

      const idList = subCmtState.idListByRank[rankType] || [];
      const lastId = idList[idList.length - 1];
      const lastSubCmt = subCmtById[lastId] || {
        rankScore: '',
        seqNo: ''
      };
      const success = await getReplyCmtList({
        rootCmId,
        rankType,
        pageSize: subCmtState.pageSize,
        lastRankScore: lastSubCmt.rankScore,
        lastCommentSeqNo: lastSubCmt.seqNo
      }).then(data => {
        let newSubCmtById = {};
        const newState = {
          allowComment: !!data.AllowComment,
          isAuthor: !!data.IsAuthor,
          canMusicianSay: !!data.CanMusicianSay
        };

        if (data.CommentList && data.CommentList.Comments) {
          const {
            cmtById: byId,
            total,
            idList: newIdList,
            hasMore
          } = formatCmtList(data.CommentList);
          subCmtState = { ...subCmtState,
            isLoading: false,
            total,
            hasMore,
            idListByRank: { ...subCmtState.idListByRank,
              [rankType]: [...subCmtState.idListByRank[rankType], ...newIdList]
            }
          };
          newSubCmtById = { ...newSubCmtById,
            ...byId
          };
        }

        this.setState(prevState => ({ ...prevState,
          ...newState,
          subCmtById: { ...prevState.subCmtById,
            ...newSubCmtById
          },
          subCmtStateById: { ...prevState.subCmtStateById,
            [rootCmId]: subCmtState
          }
        }));
        return true;
      }).catch(() => {
        popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
        return false;
      });
      return success;
    };

    this.handleSubCmtPraise = (_, subCmt) => {
      if (!login/* default.isLogin */.Z.isLogin()) {
        login/* default.loginMiniportal */.Z.loginMiniportal();
        return;
      }

      const {
        cmId,
        isPraised,
        praiseNum
      } = subCmt; // 乐观更新

      this.setState(prevState => ({ ...prevState,
        subCmtById: { ...prevState.subCmtById,
          [cmId]: { ...subCmt,
            praiseNum: praiseNum + (isPraised ? -1 : 1),
            isPraised: !isPraised
          }
        }
      })); // reportPvg(this.state.contextValue.type, 'praise');

      updateHotCmt({
        id: cmId,
        type: isPraised ? CMT_UPDATE_TYPE.CANCEL_PRAISE : CMT_UPDATE_TYPE.PRAISE
      }).then(data => {
        if (data.code === 0 && data.subcode === 0) {
          return;
        }

        return Promise.reject(data);
      }).catch(err => {
        if (err && err.code === 1000) {
          login/* default.loginMiniportal */.Z.loginMiniportal();
        } else {
          popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
        }

        this.setState(prevState => ({ ...prevState,
          subCmtById: { ...prevState.subCmtById,
            [cmId]: { ...subCmt,
              praiseNum,
              isPraised
            }
          }
        }));
      });
    };

    this.delCmt = cmt => {
      const {
        cmId
      } = cmt; // 乐观更新

      this.setState(prevState => ({ ...prevState,
        cmtById: { ...prevState.cmtById,
          [cmId]: { ...cmt,
            isShow: false
          }
        }
      }));
      deleteCmt({
        id: cmId
      }).then(data => {
        if (data.Subcode === 0) {
          return;
        }

        return Promise.reject(data);
      }).catch(err => {
        if (err && err.code === 1000) {
          login/* default.loginMiniportal */.Z.loginMiniportal();
        } else {
          popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
        }

        this.setState(prevState => ({ ...prevState,
          cmtById: { ...prevState.cmtById,
            [cmId]: { ...cmt,
              isShow: true
            }
          }
        }));
      });
    };

    this.handleCmtDel = cmt => {
      if (!login/* default.isLogin */.Z.isLogin()) {
        login/* default.loginMiniportal */.Z.loginMiniportal();
        return;
      }

      dialog/* default.show */.ZP.show({
        mode: 'common',
        title: '删除评论',
        sub_title: `确定删除评论？`,
        button_info1: {
          highlight: 1,
          title: '删除',
          fn: () => {
            //     reportPvg(this.state.contextValue.type, 'remove_comment');
            dialog/* default.hide */.ZP.hide();
            this.delCmt(cmt);
          }
        }
      });
    };

    this.delSubCmt = (_, subCmt) => {
      const {
        cmId
      } = subCmt; // 乐观更新

      this.setState(prevState => ({ ...prevState,
        subCmtById: { ...prevState.subCmtById,
          [cmId]: { ...subCmt,
            isShow: false
          }
        }
      }));
      deleteCmt({
        id: cmId
      }).then(data => {
        if (data.Subcode === 0) {
          return;
        }

        return Promise.reject(data);
      }).catch(err => {
        if (err && err.code === 1000) {
          login/* default.loginMiniportal */.Z.loginMiniportal();
        } else {
          popup/* default.show */.Z.show(0, '网络繁忙，请稍后再试。');
        }

        this.setState(prevState => ({ ...prevState,
          subCmtById: { ...prevState.subCmtById,
            [cmId]: { ...subCmt,
              isShow: true
            }
          }
        }));
      });
    };

    this.handleSubCmtDel = (rootCmId, subCmt) => {
      if (!login/* default.isLogin */.Z.isLogin()) {
        login/* default.loginMiniportal */.Z.loginMiniportal();
        return;
      }

      dialog/* default.show */.ZP.show({
        mode: 'common',
        title: '删除评论',
        sub_title: `确定删除评论？`,
        button_info1: {
          highlight: 1,
          title: '删除',
          fn: () => {
            //     reportPvg(this.state.contextValue.type, 'remove_comment');
            this.delSubCmt(rootCmId, subCmt);
          }
        }
      });
    };

    this.handleCmtSend = text => {
      if (!login/* default.isLogin */.Z.isLogin()) {
        login/* default.loginMiniportal */.Z.loginMiniportal();
        return Promise.reject();
      }

      const {
        allowComment
      } = this.state;

      if (!allowComment) {
        popup/* default.show */.Z.show(0, '评论系统升级中');
        return Promise.reject();
      }

      const {
        type,
        id
      } = this.props; // reportPvg(this.state.contextValue.type, 'send_comment');

      return addCmt({
        type,
        id,
        content: text
      }).then(data => {
        if (data.SubCode !== 0) {
          return Promise.reject(data);
        }

        const newCmt = formatAddCmt(data, text);
        this.setState(prevState => {
          const modState = prevState[CMT_MOD_KEY.NEW] || {
            total: 0,
            hasMore: true,
            idList: [],
            curPage: 1,
            pageSize: 25
          };
          return { ...prevState,
            replingConf: {
              modId: CMT_MOD_KEY.NEW,
              cmId: ''
            },
            cmtById: { ...prevState.cmtById,
              [newCmt.cmId]: newCmt
            },
            [CMT_MOD_KEY.NEW]: { ...modState,
              total: modState.total + 1,
              idList: [newCmt.cmId, ...modState.idList]
            }
          };
        });
        popup/* default.show */.Z.show(1, '评论发布成功');
      }).catch(err => {
        if (err && err.code === 1000) {
          login/* default.loginMiniportal */.Z.loginMiniportal();
        } else {
          popup/* default.show */.Z.show(1, '网络繁忙，请稍后再试。');
        }

        return Promise.reject();
      });
    };

    this.handleCmtReply = (content, cmt, rootCmId) => {
      if (this.state.isSending) {
        popup/* default.show */.Z.show(1, '评论正在发送中，请稍后再试');
        return Promise.reject();
      }

      if (!login/* default.isLogin */.Z.isLogin()) {
        login/* default.loginMiniportal */.Z.loginMiniportal();
        return;
      }

      const {
        allowComment
      } = this.state;

      if (!allowComment) {
        popup/* default.show */.Z.show(1, '评论系统升级中');
        return Promise.reject();
      }

      this.setState({
        isSending: true
      });
      const {
        type,
        id
      } = this.props; // reportPvg(this.state.contextValue.type, 'reply_comment');

      return addCmt({
        type,
        id,
        content,
        replyCmId: cmt.cmId
      }).then(data => {
        if (data.SubCode !== 0) {
          return Promise.reject(data);
        }

        const newCmt = formatAddCmt(data, content);

        if (rootCmId) {
          newCmt.repliedCmts = [{
            cmId: cmt.cmId,
            nick: cmt.nick,
            encryptUin: cmt.encryptUin,
            content: cmt.content,
            replyCnt: cmt.replyCnt,
            isAuthorPraise: cmt.isAuthorPraise
          }];
        }

        const rCmId = rootCmId || cmt.cmId;
        this.setState(prevState => {
          const subCmtState = prevState.subCmtStateById[rCmId] || {
            total: 0,
            isLoading: false,
            pageSize: 10,
            hasMore: true,
            idListByRank: {
              [CMT_RANK_TYPE.TIME]: [],
              [CMT_RANK_TYPE.HOT]: []
            }
          };
          return { ...prevState,
            isSending: false,
            replingConf: {
              modId: CMT_MOD_KEY.NEW,
              cmId: ''
            },
            subCmtById: { ...prevState.subCmtById,
              [newCmt.cmId]: newCmt
            },
            cmtById: { ...prevState.cmtById,
              [rCmId]: { ...prevState.cmtById[rCmId],
                replyCnt: prevState.cmtById[rCmId].replyCnt + 1,
                subCmtIdList: [newCmt.cmId, ...prevState.cmtById[rCmId].subCmtIdList]
              }
            },
            subCmtStateById: { ...prevState.subCmtStateById,
              [rCmId]: { ...subCmtState,
                total: subCmtState.total + 1,
                idListByRank: {
                  [CMT_RANK_TYPE.HOT]: [newCmt.cmId, ...subCmtState.idListByRank[CMT_RANK_TYPE.HOT]],
                  [CMT_RANK_TYPE.TIME]: [newCmt.cmId, ...subCmtState.idListByRank[CMT_RANK_TYPE.TIME]]
                }
              }
            }
          };
        });
        popup/* default.show */.Z.show(0, '评论发布成功', '', 1000);
      }).catch(err => {
        if (err && err.code === 1000) {
          login/* default.loginMiniportal */.Z.loginMiniportal();
        } else {
          popup/* default.show */.Z.show(1, err && (err.msg || err.data && err.data.Msg || err.Msg) || '网络繁忙，请稍后再试');
        }

        this.setState({
          isSending: false
        });
        return Promise.reject();
      });
    };

    this.state = {
      isLoading: true,
      isSending: false,
      allowComment: true,
      cmtById: {},
      subCmtById: {},
      subCmtStateById: {},
      replingConf: {
        modId: CMT_MOD_KEY.NEW,
        cmId: ''
      },
      contextValue: {
        type: props.type
      }
    };
  }

  componentDidMount() {
    this.initCmtData();
    qmfeUnityReport/* default.reportExposurePage */.ZP.reportExposurePage(qmfeUnityReport/* PAGE_HASH.ELECTRON_COMMENT_PAGE */.qt.ELECTRON_COMMENT_PAGE);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({
        isLoading: true,
        isSending: false,
        allowComment: true,
        cmtById: {},
        subCmtById: {},
        subCmtStateById: {},
        replingConf: {
          modId: CMT_MOD_KEY.NEW,
          cmId: ''
        },
        contextValue: {
          type: this.props.type
        },
        [CMT_MOD_KEY.AIR]: null,
        [CMT_MOD_KEY.HOT]: null,
        [CMT_MOD_KEY.MUSICIAN]: null,
        [CMT_MOD_KEY.NEW]: null,
        [CMT_MOD_KEY.NEW_HOT]: null
      }, () => {
        this.initCmtData();
      });
    }
  }

  render() {
    const {
      isLoading
    } = this.state;
    return /*#__PURE__*/react.createElement(context.Provider, {
      value: this.state.contextValue
    }, isLoading ? /*#__PURE__*/react.createElement(CommentLoading, {
      number: 6
    }) : /*#__PURE__*/react.createElement(component_Comment, extends_default()({}, this.state, {
      setNewState: this.setNewState,
      onCmtPraise: this.handleCmtPraise,
      onSubCmtPraise: this.handleSubCmtPraise,
      onCmtDel: this.handleCmtDel,
      onSubCmtDel: this.handleSubCmtDel,
      onCmtListLoad: this.handleCmtListLoad,
      onScrollLoad: this.handleScrollLoad,
      onReplyCmtLoad: this.handleReplyCmtLoad,
      onCmtSend: this.handleCmtSend,
      onCmtReply: this.handleCmtReply
    })));
  }

}

/* harmony default export */ const component_comment = (CmtContainer);
// EXTERNAL MODULE: ./src/component/play_list_detail/index.less
var play_list_detail = __webpack_require__(92254);
;// CONCATENATED MODULE: ./src/component/none/index.tsx

/**
 * none 为空
 *
 * @param
 * tit 标题
 * desc 描述
 * type 类型
 * btn 跳转
 * @extends {Component}
 */

class None extends react.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      content
    } = this.props;
    let typeClass = 'status_none__icon c_bg_skin ';
    let title;
    let desc;
    let btn;
    const type = (content === null || content === void 0 ? void 0 : content.type) || 'message'; // 类型

    switch (type) {
      case 'message':
        typeClass += 'status_none__icon_message';
        break;

      case 'singer':
        typeClass += 'status_none__icon_singer';
        break;

      case 'open':
        typeClass += 'status_none__icon_open';
        break;

      default:
        typeClass += 'status_none__icon_song';
        break;
    } // 标题


    if (content.title) {
      title = /*#__PURE__*/react.createElement("h1", {
        className: "status_none__tit"
      }, content.title);
    } // 描述


    if (content.desc) {
      desc = /*#__PURE__*/react.createElement("div", {
        className: "status_none__desc c_tx_thin"
      }, content.desc);
    } // 跳转


    if (content.btn) {
      btn = /*#__PURE__*/react.createElement("a", {
        href: content.btn.link,
        className: "mod_btn c_btn mod_btn_icon"
      }, content.btn.txt);
    }

    return /*#__PURE__*/react.createElement("section", {
      className: "mod_status_none"
    }, /*#__PURE__*/react.createElement("div", {
      className: "status_none__cont"
    }, /*#__PURE__*/react.createElement("div", {
      className: typeClass
    }), title, desc, btn));
  }

}
// EXTERNAL MODULE: ./src/pages/favorite/loading/NoFav.tsx
var NoFav = __webpack_require__(93921);
;// CONCATENATED MODULE: ./src/component/loading/detail_loading.tsx


// 详情
const DetailLoading = ({
  className = ''
}) => {
  return /*#__PURE__*/react.createElement("div", {
    className: `mod_detail ${className}`
  }, /*#__PURE__*/react.createElement("div", {
    className: "detail__inner"
  }, /*#__PURE__*/react.createElement("div", {
    className: "detail__cover"
  }, /*#__PURE__*/react.createElement("div", {
    className: "detail__cover_pic c_bg_bone"
  })), /*#__PURE__*/react.createElement("div", {
    className: "detail__info"
  }, /*#__PURE__*/react.createElement("h1", {
    className: "detail__title c_bg_bone loading__w3"
  }), /*#__PURE__*/react.createElement("div", {
    className: "mod_detail_about"
  }, /*#__PURE__*/react.createElement("div", {
    className: "detail__para c_bg_bone loading__w2"
  }), /*#__PURE__*/react.createElement("div", {
    className: "detail__para c_bg_bone loading__w2"
  })), /*#__PURE__*/react.createElement("div", {
    className: "mod_detail_operation c_bg_bone loading__w3"
  }))));
};

/* harmony default export */ const detail_loading = (DetailLoading);
;// CONCATENATED MODULE: ./src/component/loading/tab_loading.tsx


// 详情
const TabLoading = ({
  className = '',
  number
}) => {
  const itemList = [];

  for (let index = 0; index < number; index++) {
    itemList.push( /*#__PURE__*/react.createElement("div", {
      key: `TabLoading${index}`,
      className: "tab__item c_tx_normal loading__w4 loading__h1 c_bg_bone"
    }));
  }

  return /*#__PURE__*/react.createElement("nav", {
    className: `mod_tab mod_top_nav ${className}`
  }, itemList);
};

/* harmony default export */ const tab_loading = (TabLoading);
;// CONCATENATED MODULE: ./src/component/loading/songlist_loading.tsx

class SonglistLoading extends react.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      className = '',
      config,
      number
    } = this.props;
    let songlistHeader;

    if (config.header) {
      songlistHeader = /*#__PURE__*/react.createElement("div", {
        className: "songlist_cont"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist__item songlist_loading__item"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist__item_box"
      }, config.songname ? /*#__PURE__*/react.createElement("div", {
        className: "songlist__songname songlist_loading__grid"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist_loading__header c_bg_bone loading__w4"
      })) : '', config.singer ? /*#__PURE__*/react.createElement("div", {
        className: "songlist__author songlist_loading__grid"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist_loading__header c_bg_bone loading__w4"
      })) : '', config.album ? /*#__PURE__*/react.createElement("div", {
        className: "songlist__album songlist_loading__grid"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist_loading__header c_bg_bone loading__w4"
      })) : '', config.time ? /*#__PURE__*/react.createElement("div", {
        className: "songlist__time songlist_loading__grid"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist_loading__header c_bg_bone loading__w4"
      })) : '', config.cloud ? /*#__PURE__*/react.createElement("div", {
        className: "songlist__cloud songlist_loading__grid"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist_loading__header c_bg_bone loading__w4"
      })) : '')));
    }

    const contentItem = /*#__PURE__*/react.createElement("div", {
      className: "songlist__item_box"
    }, config.songname ? /*#__PURE__*/react.createElement("div", {
      className: "songlist__songname songlist_loading__grid"
    }, /*#__PURE__*/react.createElement("div", {
      className: "songlist_loading__single c_bg_bone"
    })) : '', config.singer ? /*#__PURE__*/react.createElement("div", {
      className: "songlist__author songlist_loading__grid"
    }, /*#__PURE__*/react.createElement("div", {
      className: "songlist_loading__single c_bg_bone"
    })) : '', config.album ? /*#__PURE__*/react.createElement("div", {
      className: "songlist__album songlist_loading__grid"
    }, /*#__PURE__*/react.createElement("div", {
      className: "songlist_loading__single c_bg_bone"
    })) : '', config.time ? /*#__PURE__*/react.createElement("div", {
      className: "songlist__time songlist_loading__grid"
    }, /*#__PURE__*/react.createElement("div", {
      className: "songlist_loading__single c_bg_bone"
    })) : '', config.cloud ? /*#__PURE__*/react.createElement("div", {
      className: "songlist__cloud songlist_loading__grid"
    }, /*#__PURE__*/react.createElement("div", {
      className: "songlist_loading__single c_bg_bone"
    })) : '');
    const itemList = [];

    for (let index = 0; index < number; index++) {
      itemList.push( /*#__PURE__*/react.createElement("div", {
        key: `SonglistLoading${index}`,
        className: "songlist__item songlist_loading__item"
      }, contentItem));
    }

    return /*#__PURE__*/react.createElement("nav", {
      className: `mod_songlist mod_songlist_loading ${className}`
    }, songlistHeader, /*#__PURE__*/react.createElement("div", {
      className: "songlist_cont"
    }, itemList));
  }

}
;// CONCATENATED MODULE: ./src/component/play_list_detail/loading.tsx





const PlayListDetailLoading = () => {
  return /*#__PURE__*/react.createElement("div", {
    className: "loading_page"
  }, /*#__PURE__*/react.createElement("div", {
    className: "layout_cont"
  }, /*#__PURE__*/react.createElement(detail_loading, null), /*#__PURE__*/react.createElement(tab_loading, {
    number: 3
  }), /*#__PURE__*/react.createElement(SonglistLoading, {
    number: 20,
    config: {
      header: true,
      songname: true,
      singer: true,
      album: true,
      time: true,
      cloud: true
    }
  })));
};

/* harmony default export */ const loading = (PlayListDetailLoading);
// EXTERNAL MODULE: ./src/component/scroll_button/index.tsx
var scroll_button = __webpack_require__(32659);
// EXTERNAL MODULE: ./src/hooks/playing_info.ts
var playing_info = __webpack_require__(84376);
// EXTERNAL MODULE: ./src/hooks/playlist.ts + 1 modules
var playlist = __webpack_require__(27076);
// EXTERNAL MODULE: ./src/client/index.tsx
var client = __webpack_require__(21209);
// EXTERNAL MODULE: ./src/component/animation/index.tsx + 1 modules
var animation = __webpack_require__(23899);
;// CONCATENATED MODULE: ./src/component/play_list_detail/index.tsx
















const PlayListDetail = props => {
  const wrapperRef = /*#__PURE__*/react.createRef();
  const songListRef = (0,react.useRef)();
  const search = props.location.search || '';
  const isSelfCreate = utils/* default.getParam */.ZP.getParam('create', search) === '1' || false;
  const isCollect = utils/* default.getParam */.ZP.getParam('collect', search) === '1' || false;

  // 综合提取真实歌单 dissId：优先 match.params，其次从 pathname 正则提取，再次从 search 提取
  let extractedDissId = (props.match && props.match.params && (props.match.params.tid || props.match.params.dissId)) || '';
  if (!extractedDissId || extractedDissId === 'recent') {
    const p = (props.location && props.location.pathname) || (props.match && props.match.url) || '';
    const m = p.match(/\/playlist_detail\/([^\/\?]+)/);
    if (m && m[1]) {
      extractedDissId = m[1];
    }
  }
  if (!extractedDissId || extractedDissId === 'recent') {
    const sId = utils/* default.getParam */.ZP.getParam('id', search);
    if (sId) {
      extractedDissId = sId;
    } else {
      const sUrl = utils/* default.getParam */.ZP.getParam('url', search);
      if (sUrl) {
        try {
          const decodedUrl = decodeURIComponent(sUrl);
          const mUrl = decodedUrl.match(/[\?&]id=([^&#]+)/);
          if (mUrl && mUrl[1]) extractedDissId = mUrl[1];
        } catch (_) {}
      }
    }
  }

  // 严格限定何时才属于“最近播放”页面：仅当明确请求 recent 且未解析出任何具体歌单ID时生效
  const isExplicitRecent = (props.match && props.match.url && props.match.url.includes('recent')) || (props.location && props.location.pathname === '/playlist_detail/recent');
  const targetDissId = (extractedDissId && extractedDissId !== 'recent') ? extractedDissId : (isExplicitRecent ? 'recent' : (extractedDissId || 'recent'));

  const [isLoading, playListDetail, {
    updatePlayListDetail,
    switchPlayListLikeSongs,
    switchCollectState
  }] = (0,playlist/* usePlayListInfo */.I)({
    dissId: targetDissId,
    isSelfCreate,
    isCollect
  });
  const [needToShowFocusBtn, needToShowToTopBtn, focusOnCurrentSong, scrollToTop, handleRowRenderer] = (0,playing_info/* useSongIsInView */.b)(playListDetail.songlist, songListRef);

  const renderNav = () => {
    const {
      url
    } = props.match;
    const isRecent = targetDissId === 'recent';
    return /*#__PURE__*/react.createElement("nav", {
      className: "mod_tab mod_normal_nav"
    }, /*#__PURE__*/react.createElement("div", {
      className: "layout_cont"
    }, /*#__PURE__*/react.createElement(react_router_dom.NavLink, {
      to: url,
      exact: true,
      activeClassName: "c_tx_current",
      className: "tab__item c_tx_normal"
    }, /*#__PURE__*/react.createElement("span", {
      className: "tab__label"
    }, "\u6B4C\u66F2 ", playListDetail && playListDetail.detailContent && playListDetail.detailContent.total_song_num)), !isRecent && /*#__PURE__*/react.createElement(react_router_dom.NavLink, {
      to: `${url}/comment`,
      exact: true,
      activeClassName: "c_tx_current",
      className: "tab__item c_tx_normal"
    }, /*#__PURE__*/react.createElement("span", {
      className: "tab__label"
    }, "\u8BC4\u8BBA"))));
  };

  const handleCollect = val => {
    switchCollectState(val);
  };

  const handlePlayAll = () => {
    client/* default.playSong */.Z.playSong({
      songList: playListDetail.songlist,
      playIndex: 0
    });
  };

  const handleDeleteSong = () => {
    updatePlayListDetail();
  };

  const {
    match,
    location
  } = props;
  const isNotOnSongPage = location.pathname.split('/').some(item => item === 'comment');
  return (0,react.useMemo)(() => {
    if (isLoading) {
      return /*#__PURE__*/react.createElement(loading, null);
    } else {
      var _playListDetail$detai, _playListDetail$detai2;

      return /*#__PURE__*/react.createElement(animation/* EaseInWrapper */.W, {
        className: 'column_flex playlist_detail'
      }, /*#__PURE__*/react.createElement("div", {
        className: "layout_detail column_flex"
      }, (playListDetail === null || playListDetail === void 0 ? void 0 : playListDetail.detailContent) && /*#__PURE__*/react.createElement(Detail, {
        isCollect: playListDetail === null || playListDetail === void 0 ? void 0 : (_playListDetail$detai = playListDetail.detailContent) === null || _playListDetail$detai === void 0 ? void 0 : _playListDetail$detai.isCollect,
        isSelfCreate: playListDetail === null || playListDetail === void 0 ? void 0 : (_playListDetail$detai2 = playListDetail.detailContent) === null || _playListDetail$detai2 === void 0 ? void 0 : _playListDetail$detai2.isSelfCreate,
        isRecent: targetDissId === 'recent' || ((playListDetail === null || playListDetail === void 0 ? void 0 : playListDetail.detailContent) && playListDetail.detailContent.dissid === 'recent'),
        onClearRecent: () => {
          updatePlayListDetail('recent');
        },
        onCollect: handleCollect,
        onPlayAll: handlePlayAll,
        detailContent: playListDetail.detailContent
      }), renderNav(), /*#__PURE__*/react.createElement("div", {
        className: `main_cont ${isNotOnSongPage ? '' : 'song'}`,
        ref: wrapperRef
      }, /*#__PURE__*/react.createElement(react_router/* Switch */.rs, null, /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
        path: match.url,
        exact: true,
        render: () => {
          var _playListDetail$songl;

          if (playListDetail.songlist.length === 0) {
            return /*#__PURE__*/react.createElement(NoFav/* default */.Z, {
              title: '歌单里没有歌曲'
            });
          }

          return (playListDetail === null || playListDetail === void 0 ? void 0 : playListDetail.songlist) && /*#__PURE__*/react.createElement("div", {
            className: "layout_cont__mod"
          }, (playListDetail === null || playListDetail === void 0 ? void 0 : (_playListDetail$songl = playListDetail.songlist) === null || _playListDetail$songl === void 0 ? void 0 : _playListDetail$songl.length) === 0 && (playListDetail === null || playListDetail === void 0 ? void 0 : playListDetail.detailContent.disstype) === 2 ? /*#__PURE__*/react.createElement(None, {
            content: {
              title: '我们明天会推荐更适合的歌曲'
            }
          }) : /*#__PURE__*/react.createElement(song_list/* SongList */.J, {
            ref: songListRef,
            config: {
              isPlayAll: true,
              isVirtualize: true,
              drag: true,
              contextMenuDelete: true
            },
            wrapper: wrapperRef,
            songList: playListDetail.songlist,
            onSwitchCollectState: switchPlayListLikeSongs,
            onRowRenderer: handleRowRenderer,
            playListDetail: playListDetail === null || playListDetail === void 0 ? void 0 : playListDetail.detailContent,
            onDeleteSong: handleDeleteSong
          }));
        }
      }), /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
        path: `${match.url}/comment`,
        exact: true,
        render: () => {
          var _match$params;

          return ((_match$params = match.params) === null || _match$params === void 0 ? void 0 : _match$params.tid) && /*#__PURE__*/react.createElement(component_comment, {
            id: match.params.tid,
            type: 3
          });
        }
      })), /*#__PURE__*/react.createElement(scroll_button/* default */.Z, {
        config: {
          show: true,
          reload: false
        },
        scrollToTopBtnVisible: needToShowToTopBtn,
        focusBtnVisible: needToShowFocusBtn,
        scrollToSong: focusOnCurrentSong,
        scrollToTopFunc: scrollToTop
      }))));
    }
  }, [isLoading, isSelfCreate, isCollect, playListDetail.songlist, needToShowToTopBtn, needToShowFocusBtn]);
};

/* harmony default export */ const component_play_list_detail = (PlayListDetail);

//# sourceURL=webpack://qqmusic/./src/component/play_list_detail/index.tsx_+_24_modules?