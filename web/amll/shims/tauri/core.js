import { tolerant } from './tolerant.js';

// 浏览器里没有 Tauri 后端：invoke 返回可容忍对象（属性/调用都安全，await 得到自身），
// 这样调用方读 .status/.code 之类的字段不会直接抛错。
export const invoke = async () => tolerant();
export const convertFileSrc = (filePath) => filePath;
export class Channel {
  onmessage = null;
  toJSON() {
    return '';
  }
}
