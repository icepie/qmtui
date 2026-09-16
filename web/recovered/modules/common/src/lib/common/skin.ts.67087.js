/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "p": () => (/* binding */ changeSkin)
/* harmony export */ });
/* harmony import */ var _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4095);
/* harmony import */ var _src_pages_setting_utils_sync_setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(96546);


const DeepSkinCss = '::-webkit-input-placeholder{color:rgba(255,255,255,.5)}.c_tx_link,.c_tx_normal,a,body{color:rgba(255,255,255,1)}.c_tx_disabled{color:rgba(255,255,255,.3)}.c_tx_thin{color:rgba(255,255,255,.5)}.c_b_normal{border-color:rgba(255,255,255,.1)}.c_b_thin{border-color:rgba(255,255,255,.04)}.c_bg_normal{background-color:rgba(255,255,255,.03)}.c_bg_floor{background-color:#1e1f23}.c_bg_mask{background-color:#16171d}.c_bg_linear{background:-webkit-linear-gradient(-45deg,rgba(22,23,29,0) 0,#16171d 100%);color:rgba(22,23,29,1)}.c_popup__bg{background:#1e1f23}.c_btn{background:rgba(255,255,255,.08)}.c_btn:hover{background:rgba(255,255,255,.13)}.c_btn:active{background:rgba(255,255,255,.16)}.c_btn.disable{color:rgba(255,255,255,.35);background:rgba(255,255,255,.1)}.c_btn_line{border:1px solid rgba(255,255,255,.1)}.c_btn_line:hover{background-color:rgba(255,255,255,.06);color:currentColor}.c_btn_line:active{background-color:rgba(255,255,255,.1)}.c_btn_line.disable{color:rgba(255,255,255,.3);background-color:transparent}.c_icon{color:rgba(255,255,255,.5)}.c_icon_hover:hover{color:rgba(255,255,255,1)}::-webkit-scrollbar-thumb{background-color:rgba(255,255,255,.2)}::-webkit-scrollbar-thumb:hover{background-color:rgba(255,255,255,.3)}::-webkit-scrollbar-thumb:active{background-color:rgba(255,255,255,.24)}.c_btn_skin{position:relative;background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%);color:rgba(255,255,255,1)}.c_btn_skin:hover{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%)}.c_btn_skin:hover .btn__cover{background:rgba(0,0,0,.05)}.c_btn_skin:active{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%)}.c_btn_skin:active .btn__cover{background:rgba(0,0,0,.08)}.c_btn_skin.disable{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,.3) 0,rgba(30,204,148,.3) 100%);color:rgba(255,255,255,1)}.c_bg_skin{background-color:rgba(30,204,148,1)}.c_bg_skin_linear{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%)}.c_tx_current,.c_tx_link:hover,a:hover{color:rgba(30,204,148,1)}.c_b_skin::before{border-color:rgba(30,204,148,1)}' + `/*文字*/
.c_txt1{color:rgba(255,255,255,1);}/*主标题*/
.c_txt2{color:rgba(255,255,255,.5);}/*副标题*/
.c_txt3{color:rgba(39,253,185,1);}/*高亮色*/
/*背景*/
.c_bg1{background-color:#111;}/*页面底色*/
.c_bg2{background-color:rgba(255,255,255,.08);}/*内容区域／蒙层*/
.c_bg3{background-color:#0E1225;}/*底板／遮挡层*/
.c_bg4{background-color: rgb(53, 54, 57); box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}

/*按钮*/
.c_btn1{color:rgba(255,255,255,1);border-color:rgba(255,255,255,.2);}/*线框按钮*/
.c_btn1::after{border-color:rgba(255,255,255,.2);}
.c_btn2{color:#0E1225;background-color:rgba(39,253,185,1);}/*实心按钮*/
/* Google M3 Dark Surface */
body, #app, .mode_main__wrapper, .main_cont, .main.c_bg1, .top_cont, .top_cont_left, .top_cont_right, .route_cont.c_bg2, .route_wrap, .center_cont { background-color: #1e2028 !important; }
.main.c_bg1 { border-right: none !important; }
body { color: #f3f4f6 !important; }
.nav_item { border-radius: 20px !important; margin: 4px 14px !important; padding: 0 16px !important; height: 38px !important; line-height: 38px !important; border: none !important; color: #d1d5db !important; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; display: flex !important; align-items: center !important; font-size: 13.5px !important; box-sizing: border-box !important; }
.nav_item:hover:not(.c_btn_skin):not(.active) { background-color: rgba(255, 255, 255, 0.08) !important; color: #ffffff !important; }
.nav_item_hover__bg { display: none !important; }
.nav_item.c_btn_skin, .nav_item.active, .c_btn_skin.txt_white { background: rgba(30, 204, 148, 0.20) !important; color: #1ecc94 !important; font-weight: 600 !important; box-shadow: none !important; }
.nav_item.c_btn_skin svg, .nav_item.c_btn_skin .tab_item_img, .nav_item.c_btn_skin .tab_item_cont, .nav_item.c_btn_skin .nav_item__icon { fill: #1ecc94 !important; color: #1ecc94 !important; }
.top_cont { background-color: #1e2028 !important; }
.player_cont { background-color: transparent !important; border-top: none !important; }
.cover_player, .cover_player .player_cont, .cover_layout .player_cont { background-color: transparent !important; border-top: none !important; }
.cover_player .svg_icon_btn.voice, .cover_layout .svg_icon_btn.voice { color: rgba(255, 255, 255, 0.85) !important; }
.cover_player .svg_icon_btn.voice:hover, .cover_layout .svg_icon_btn.voice:hover { color: #1ecc94 !important; }
.player_cont_state_tool_love--loved, .player_cont_state_tool_love--loved.c_txt2, .action_button.player_cont_state_tool_love--loved { color: #ff4757 !important; background-color: #ff4757 !important; opacity: 1 !important; }
.player_cont_state_tool_love--loved:hover, .action_button.player_cont_state_tool_love--loved:hover { color: #ff6b81 !important; background-color: #ff6b81 !important; opacity: 0.85 !important; }
.player_process { height: 12px !important; }
.player_process .player_process_cont { position: relative !important; height: 4px !important; border-radius: 2px !important; background-color: rgba(255, 255, 255, 0.18) !important; margin: 4px auto 0 auto !important; bottom: 0 !important; }
.player_process:hover .player_process_cont { height: 5px !important; }
.player_process_buffer, .player_process_cent { position: absolute !important; top: 0 !important; bottom: 0 !important; left: 0 !important; height: 100% !important; border-radius: 2px !important; }
.player_process_cent { background-color: #1ecc94 !important; }
.player_process_buffer { background-color: rgba(255, 255, 255, 0.08) !important; }
.player_process_dot { width: 10px !important; height: 10px !important; border-radius: 5px !important; top: -3px !important; background-color: #1ecc94 !important; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4) !important; transition: transform 0.15s ease !important; }
.player_process:hover .player_process_dot { transform: scale(1.3) !important; top: -3px !important; }
.cover_player .player_process .player_process_cont, .player_process_cont--fix { background-color: rgba(255, 255, 255, 0.25) !important; }
.top_oper_search { background: rgba(255, 255, 255, 0.06) !important; border: 1px solid rgba(255, 255, 255, 0.06) !important; border-radius: 22px !important; transition: all 0.2s ease !important; }
.top_oper_search:focus-within { background: rgba(255, 255, 255, 0.1) !important; border-color: rgba(30, 204, 148, 0.5) !important; box-shadow: 0 0 10px rgba(30, 204, 148, 0.15) !important; }
.c_txt1 { color: #ffffff !important; }
.c_txt2 { color: #d1d5db !important; }
.c_txt_thin { color: #9ca3af !important; }
h1, h2, h3, h4, .title, .tit { color: #ffffff !important; }
.player_process_time_row { color: #d1d5db !important; }
::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
::-webkit-scrollbar-thumb { border-radius: 8px !important; background-color: rgba(255, 255, 255, 0.16) !important; }
::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.26) !important; }
::-webkit-scrollbar-track { background: transparent !important; }
html, body, input, button, select, textarea, .nav_item, .c_txt1, .c_txt2, .c_txt_thin, .songlist__item, .player_cont { font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Noto Sans", "Noto Sans CJK SC", "Source Han Sans SC", "Noto Sans CJK JP", "Source Han Sans JP", "Noto Sans CJK KR", "Noto Sans SC", system-ui, sans-serif, "Noto Color Emoji" !important; -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; text-rendering: optimizeLegibility !important; }
.player_process_time_row, .player_time, .songlist__time { font-variant-numeric: tabular-nums !important; }
.main, .main.c_bg1, .main_cont, aside, [class*="side_nav"] { scrollbar-width: none !important; -ms-overflow-style: none !important; }
.main::-webkit-scrollbar, .main.c_bg1::-webkit-scrollbar, .main_cont::-webkit-scrollbar, aside::-webkit-scrollbar, [class*="side_nav"]::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
.operate_menu__icon_copy::before { content: "" !important; position: absolute !important; top: 5px !important; left: 13px !important; width: 20px !important; height: 20px !important; background-color: currentColor !important; opacity: .6 !important; -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M6 3a2 2 0 0 0-2 2v11a1 1 0 0 0 2 0V5h10a1 1 0 0 0 0-2H6zm3 4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H9zm0 2h10v10H9V9z' style='fill-rule:evenodd'/></svg>") no-repeat center !important; -webkit-mask-size: 16px 16px !important; }
.operate_menu_item.c_tx_disabled, .operate_menu__link.c_tx_disabled { opacity: 0.35 !important; cursor: not-allowed !important; pointer-events: none !important; }`;
const LightSkinCss = '::-webkit-input-placeholder{color:rgba(0,0,0,.5)}.c_tx_link,.c_tx_normal,a,body{color:rgba(0,0,0,1)}.c_tx_disabled{color:rgba(0,0,0,.3)}.c_tx_thin{color:rgba(0,0,0,.5)}.c_b_normal{border-color:rgba(0,0,0,.1)}.c_b_thin{border-color:rgba(0,0,0,.04)}.c_bg_normal{background-color:rgba(0,0,0,.03)}.c_bg_floor{background-color:#fff}.c_bg_mask{background-color:#fafafa}.c_bg_linear{background:-webkit-linear-gradient(-45deg,rgba(22,23,29,0) 0,#16171d 100%);color:rgba(250,250,250,1)}.c_popup__bg{background:#fff}.c_btn{background:rgba(0,0,0,.08)}.c_btn:hover{background:rgba(0,0,0,.11)}.c_btn:active{background:rgba(0,0,0,.14)}.c_btn.disable{color:rgba(0,0,0,.35);background:rgba(0,0,0,.1)}.c_btn_line{border:1px solid rgba(0,0,0,.1)}.c_btn_line:hover{background-color:rgba(0,0,0,.02)}.c_btn_line:active{background-color:rgba(0,0,0,.05)}.c_btn_line.disable{color:rgba(255,255,255,.35)}.c_icon{color:rgba(0,0,0,.5)}.c_icon_hover:hover{color:rgba(0,0,0,1)}::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.14)}::-webkit-scrollbar-thumb:hover{background-color:rgba(0,0,0,.2)}::-webkit-scrollbar-thumb:active{background-color:rgba(0,0,0,.16)}.c_btn_skin{position:relative;background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%);color:rgba(255,255,255,1)}.c_btn_skin:hover{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%)}.c_btn_skin:hover .btn__cover{background:rgba(0,0,0,.05)}.c_btn_skin:active{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%)}.c_btn_skin:active .btn__cover{background:rgba(0,0,0,.08)}.c_btn_skin.disable{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,.3) 0,rgba(30,204,148,.3) 100%);color:rgba(255,255,255,1)}.c_bg_skin{background-color:rgba(30,204,148,1)}.c_bg_skin_linear{background:-webkit-linear-gradient(-45deg,rgba(32,214,192,1) 0,rgba(30,204,148,1) 100%)}.c_tx_current,.c_tx_link:hover,a:hover{color:rgba(30,204,148,1)}.c_b_skin::before{border-color:rgba(30,204,148,1)}' + `/*文字*/
.c_txt1{color:rgba(26,26,26,1);}/*主标题*/
.c_txt2{color:rgba(26,26,26,.5);}/*副标题*/
.c_txt3{color:rgba(34,213,156,1);}/*高亮色*/
/*背景*/
.c_bg1{background-color:#FAFAFA;}/*页面底色*/
.c_bg2{background-color:#fff;}/*内容区域／蒙层*/
.c_bg3{background-color:#fafafa;}/*底板／遮挡层*/
.c_bg4{background-color:#fff;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}
/*按钮*/
.c_btn1{color:rgba(26,26,26,1);border-color:rgba(26,26,26,.2);}/*线框按钮*/
.c_btn1::after{border-color:rgba(26,26,26,.2);}
.c_btn2{color:#fff;background-color:rgba(34,213,156,1);}/*实心按钮*/
/* Google M3 Light Surface */
body, #app, .mode_main__wrapper, .main_cont, .main.c_bg1, .top_cont, .top_cont_left, .top_cont_right, .route_cont.c_bg2, .route_wrap, .center_cont { background-color: #f8f9fc !important; }
.main.c_bg1 { border-right: none !important; }
body { color: #1f2937 !important; }
.nav_item { border-radius: 20px !important; margin: 4px 14px !important; padding: 0 16px !important; height: 38px !important; line-height: 38px !important; border: none !important; color: #4b5563 !important; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; display: flex !important; align-items: center !important; font-size: 13.5px !important; box-sizing: border-box !important; }
.nav_item:hover:not(.c_btn_skin):not(.active) { background-color: rgba(0, 0, 0, 0.05) !important; color: #111827 !important; }
.nav_item_hover__bg { display: none !important; }
.nav_item.c_btn_skin, .nav_item.active, .c_btn_skin.txt_white { background: rgba(30, 204, 148, 0.16) !important; color: #047857 !important; font-weight: 600 !important; box-shadow: none !important; }
.nav_item.c_btn_skin svg, .nav_item.c_btn_skin .tab_item_img, .nav_item.c_btn_skin .tab_item_cont, .nav_item.c_btn_skin .nav_item__icon { fill: #047857 !important; color: #047857 !important; }
.top_cont { background-color: #f8f9fc !important; }
.player_cont { background-color: transparent !important; border-top: none !important; }
.cover_player, .cover_player .player_cont, .cover_layout .player_cont { background-color: transparent !important; border-top: none !important; }
.cover_player .svg_icon_btn.voice, .cover_layout .svg_icon_btn.voice { color: rgba(255, 255, 255, 0.85) !important; }
.cover_player .svg_icon_btn.voice:hover, .cover_layout .svg_icon_btn.voice:hover { color: #1ecc94 !important; }
.player_cont_state_tool_love--loved, .player_cont_state_tool_love--loved.c_txt2, .action_button.player_cont_state_tool_love--loved { color: #ff4757 !important; background-color: #ff4757 !important; opacity: 1 !important; }
.player_cont_state_tool_love--loved:hover, .action_button.player_cont_state_tool_love--loved:hover { color: #ff6b81 !important; background-color: #ff6b81 !important; opacity: 0.85 !important; }
.player_process { height: 12px !important; }
.player_process .player_process_cont { position: relative !important; height: 4px !important; border-radius: 2px !important; background-color: rgba(0, 0, 0, 0.12) !important; margin: 4px auto 0 auto !important; bottom: 0 !important; }
.player_process:hover .player_process_cont { height: 5px !important; }
.player_process_buffer, .player_process_cent { position: absolute !important; top: 0 !important; bottom: 0 !important; left: 0 !important; height: 100% !important; border-radius: 2px !important; }
.player_process_cent { background-color: #1ecc94 !important; }
.player_process_buffer { background-color: rgba(0, 0, 0, 0.06) !important; }
.player_process_dot { width: 10px !important; height: 10px !important; border-radius: 5px !important; top: -3px !important; background-color: #1ecc94 !important; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25) !important; transition: transform 0.15s ease !important; }
.player_process:hover .player_process_dot { transform: scale(1.3) !important; top: -3px !important; }
.cover_player .player_process .player_process_cont, .player_process_cont--fix { background-color: rgba(255, 255, 255, 0.25) !important; }
.top_oper_search { background: rgba(0, 0, 0, 0.05) !important; border: 1px solid rgba(0, 0, 0, 0.05) !important; border-radius: 22px !important; transition: all 0.2s ease !important; }
.top_oper_search:focus-within { background: #ffffff !important; border-color: rgba(16, 185, 129, 0.5) !important; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06) !important; }
.c_txt1 { color: #111827 !important; }
.c_txt2 { color: #4b5563 !important; }
.c_txt_thin { color: #9ca3af !important; }
::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
::-webkit-scrollbar-thumb { border-radius: 8px !important; background-color: rgba(0, 0, 0, 0.14) !important; }
::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.24) !important; }
::-webkit-scrollbar-track { background: transparent !important; }
html, body, input, button, select, textarea, .nav_item, .c_txt1, .c_txt2, .c_txt_thin, .songlist__item, .player_cont { font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Noto Sans", "Noto Sans CJK SC", "Source Han Sans SC", "Noto Sans CJK JP", "Source Han Sans JP", "Noto Sans CJK KR", "Noto Sans SC", system-ui, sans-serif, "Noto Color Emoji" !important; -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; text-rendering: optimizeLegibility !important; }
.player_process_time_row, .player_time, .songlist__time { font-variant-numeric: tabular-nums !important; }
.main, .main.c_bg1, .main_cont, aside, [class*="side_nav"] { scrollbar-width: none !important; -ms-overflow-style: none !important; }
.main::-webkit-scrollbar, .main.c_bg1::-webkit-scrollbar, .main_cont::-webkit-scrollbar, aside::-webkit-scrollbar, [class*="side_nav"]::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
.operate_menu__icon_copy::before { content: "" !important; position: absolute !important; top: 5px !important; left: 13px !important; width: 20px !important; height: 20px !important; background-color: currentColor !important; opacity: .6 !important; -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M6 3a2 2 0 0 0-2 2v11a1 1 0 0 0 2 0V5h10a1 1 0 0 0 0-2H6zm3 4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H9zm0 2h10v10H9V9z' style='fill-rule:evenodd'/></svg>") no-repeat center !important; -webkit-mask-size: 16px 16px !important; }
.operate_menu_item.c_tx_disabled, .operate_menu__link.c_tx_disabled { opacity: 0.35 !important; cursor: not-allowed !important; pointer-events: none !important; }`;
const LightConfig = {
  color: '#1ECC94',
  isLight: '1',
  subId: '10001',
  tabId: '144'
};
const DarkConfig = {
  color: '#1ECC94',
  isLight: '0',
  subId: '10209',
  tabId: '144'
};

const changeSkin = type => {
  const head = document.querySelector('head');
  const skin = type === 'dark' ? DeepSkinCss : LightSkinCss;
  const webviewSkinConfig = type === 'dark' ? DarkConfig : LightConfig;
  let link = document.querySelector('#js_skin_style');

  if (!link) {
    link = document.createElement('style');
    link.id = 'js_skin_style';
    head.appendChild(link);
  }

  link.innerHTML = skin;
  _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_0__/* .default.getInstance */ .Z.getInstance().dispatchEvent('changeSkin', JSON.stringify({
    code: 0,
    data: webviewSkinConfig
  }));
  (0,_src_pages_setting_utils_sync_setting__WEBPACK_IMPORTED_MODULE_1__/* .syncSetting */ .E5)({
    key: 'theme',
    value: type
  });
};



//# sourceURL=webpack://qqmusic/./src/lib/common/skin.ts?