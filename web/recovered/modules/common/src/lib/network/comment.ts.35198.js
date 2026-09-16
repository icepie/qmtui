/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rb": () => (/* binding */ getHotCommentList),
/* harmony export */   "VN": () => (/* binding */ getNewCommentList),
/* harmony export */   "rx": () => (/* binding */ updateHotComment),
/* harmony export */   "Lh": () => (/* binding */ getReplyCommentList),
/* harmony export */   "YF": () => (/* binding */ deleteComment),
/* harmony export */   "Ir": () => (/* binding */ addComment)
/* harmony export */ });
/** 评论相关的接口 **/
const getHotCommentList = param => ({
  module: 'music.globalComment.CommentReadServer',
  method: 'GetHotCommentList',
  param
});
const getNewCommentList = param => ({
  module: 'music.globalComment.CommentReadServer',
  method: 'GetNewCommentList',
  param
});
const updateHotComment = param => ({
  module: 'GlobalComment.GlobalCommentWriteServer',
  method: 'UpdateHotComment',
  param
});
const getReplyCommentList = param => ({
  module: 'music.globalComment.CommentReadServer',
  method: 'GetReplyCommentList',
  param
});
const deleteComment = param => ({
  module: 'music.globalComment.CommentWriteServer',
  method: 'DelComment',
  param
});
const addComment = param => ({
  module: 'music.globalComment.CommentWriteServer',
  method: 'AddComment',
  param
});

//# sourceURL=webpack://qqmusic/./src/lib/network/comment.ts?