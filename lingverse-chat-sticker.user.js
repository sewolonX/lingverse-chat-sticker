// ==UserScript==
// @name         LingVerse 聊天表情
// @namespace    local.lingverse.sticker
// @version      1.0.2
// @description  灵界聊天自定义贴纸：点贴纸按钮发送，装了脚本的玩家互相可见图片
// @match        https://ling.muge.info/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL  https://sewolon.oss-cn-shanghai.aliyuncs.com/lingverse/lingverse-chat-sticker.user.js
// @updateURL    https://sewolon.oss-cn-shanghai.aliyuncs.com/lingverse/lingverse-chat-sticker.user.js
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    if (window.__lvStickerLoaded) return;
    window.__lvStickerLoaded = true;

    // ===================== 注入样式 =====================
    (function injectStyle() {
        var s = document.createElement('style');
        s.setAttribute('data-lv-sticker', 'style');
        s.textContent = [
            ':root{',
            '--stk-bg:#18181b;',
            '--stk-border:#333;',
            '--stk-text:#e0e0e0;',
            '--stk-input-bg:#27272a;',
            '--stk-input-border:#333;',
            '--stk-label:#888;',
            '--stk-btn-bg:rgba(255,255,255,.06);',
            '--stk-btn-border:rgba(255,255,255,.1);',
            '--stk-btn-text:#999;',
            '--stk-btn-hover-bg:rgba(255,255,255,.12);',
            '--stk-btn-hover-text:#fff;',
            '--stk-accent:#277AF7;',
            '--stk-accent-hover:#1a6fef;',
            '--stk-accent-text:#fff;',
            '--stk-active:#22c55e;',
            '--stk-danger:#dc2626;',
            '--stk-danger-hover:#ef4444;',
            '--stk-danger-text:#fff;',
            '--stk-item-bg:rgba(0,0,0,.22);',
            '--stk-item-border:rgba(255,255,255,.08);',
            '--stk-font:system-ui,"Microsoft YaHei",sans-serif;',
            'color-scheme:dark;',
            '}',
            '@media (prefers-color-scheme:light){',
            ':root{',
            '--stk-bg:#ffffff;',
            '--stk-border:#e5e7eb;',
            '--stk-text:#1f2937;',
            '--stk-input-bg:#f9fafb;',
            '--stk-input-border:#d1d5db;',
            '--stk-label:#6b7280;',
            '--stk-btn-bg:rgba(0,0,0,.05);',
            '--stk-btn-border:rgba(0,0,0,.1);',
            '--stk-btn-text:#6b7280;',
            '--stk-btn-hover-bg:rgba(0,0,0,.1);',
            '--stk-btn-hover-text:#1f2937;',
            '--stk-accent:#3482FF;',
            '--stk-accent-hover:#277AF7;',
            '--stk-accent-text:#fff;',
            '--stk-active:#07C160;',
            '--stk-danger:#dc2626;',
            '--stk-danger-hover:#ef4444;',
            '--stk-danger-text:#fff;',
            '--stk-item-bg:rgba(0,0,0,.04);',
            '--stk-item-border:rgba(0,0,0,.08);',
            'color-scheme:light;',
            '}',
            '}',
            '#lvStickerPicker{',
            'position:fixed;z-index:2147483647;',
            'background:var(--stk-bg);',
            'border:1px solid var(--stk-border);',
            'border-radius:12px;',
            'width:272px;max-height:400px;',
            'box-shadow:0 0 6px rgba(0,0,0,.15);',
            'font-size:13px;font-family:var(--stk-font);color:var(--stk-text);',
            'display:none;flex-direction:column;',
            'user-select:none;-webkit-tap-highlight-color:transparent;',
            '}',
            '#lvStickerScroll::-webkit-scrollbar{width:5px;}',
            '#lvStickerScroll::-webkit-scrollbar-thumb{background:var(--stk-btn-border);border-radius:3px;}',
            '#lvStickerScroll::-webkit-scrollbar-track{background:transparent;}',
            '/* 输入框允许选中文字 */',
            '#lvStickerPicker input[type="text"]{user-select:text;}',
            '.lv-sticker-item{',
            'display:flex;flex-direction:column;align-items:center;position:relative;',
            'padding:5px 2px;border-radius:8px;cursor:pointer;text-align:center;',
            'transition:background .2s;',
            '}',
            '.lv-sticker-item:hover{background:var(--stk-btn-hover-bg);}',
            '.lv-sticker-img{width:50px;height:50px;object-fit:contain;border-radius:8px;}',
            '.lv-sticker-text{',
            'display:flex;align-items:center;justify-content:center;',
            'width:50px;height:50px;',
            'font-size:14px;overflow:hidden;',
            'line-height:1.2;text-align:center;',
            '}',
            '.lv-sticker-name{font-size:10px;color:var(--stk-label);max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:3px;}',
            '/* 管理区 */',
            '.lv-mgmt-divider{border-top:1px solid var(--stk-btn-border);}',
            '.lv-mgmt-toggle{',
            'display:flex;align-items:center;justify-content:center;',
            'width:100%;height:34px;',
            'background:var(--stk-btn-bg);border:0;',
            'color:var(--stk-label);font-size:11px;font-weight:600;font-family:var(--stk-font);',
            'cursor:pointer;transition:background .2s,color .2s;letter-spacing:.5px;',
            '}',
            '.lv-mgmt-toggle:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '.lv-mgmt-panel{padding:12px 10px 10px;}',
            '.lv-mgmt-row{margin-bottom:10px;}',
            '.lv-mgmt-row label{display:block;font-size:11px;font-weight:600;font-family:var(--stk-font);color:var(--stk-label);margin-bottom:4px;letter-spacing:.3px;}',
            '.lv-mgmt-row input[type="text"]{',
            'width:100%;height:30px;',
            'background:var(--stk-input-bg);',
            'border:1px solid var(--stk-input-border);',
            'border-radius:6px;color:var(--stk-text);',
            'padding:0 8px;font-size:12px;font-family:var(--stk-font);',
            'outline:none;box-sizing:border-box;',
            'transition:border-color .2s;',
            '}',
            '.lv-mgmt-row input[type="text"]:focus{border-color:var(--stk-accent);}',
            '.lv-mgmt-row input[type="text"]::placeholder{color:var(--stk-label);}',
            '.lv-mgmt-row-actions{display:flex;gap:6px;align-items:center;margin-bottom:10px;}',
            '.lv-btn{',
            'display:inline-flex;align-items:center;justify-content:center;',
            'height:30px;padding:0 14px;',
            'background:var(--stk-btn-bg);',
            'border:1px solid var(--stk-btn-border);',
            'border-radius:6px;',
            'color:var(--stk-btn-text);',
            'font-size:12px;font-weight:600;font-family:var(--stk-font);',
            'cursor:pointer;transition:background .2s,color .2s;white-space:nowrap;',
            '}',
            '.lv-btn:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '.lv-btn-add{background:var(--stk-accent);color:var(--stk-accent-text);border-color:var(--stk-accent);}',
            '.lv-btn-add:hover{background:var(--stk-accent-hover);}',
            '.lv-btn-outline{',
            'display:inline-flex;align-items:center;justify-content:center;',
            'height:26px;padding:0 10px;font-size:11px;',
            'background:transparent;',
            'border:1px solid var(--stk-btn-border);',
            'border-radius:6px;color:var(--stk-btn-text);font-family:var(--stk-font);',
            'cursor:pointer;transition:background .2s,color .2s;',
            '}',
            '.lv-btn-outline:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '/* 贴纸大小滑块 */',
            'input.lv-size-slider{',
            'width:100%;height:6px;',
            '-webkit-appearance:none !important;appearance:none !important;',
            'background:var(--stk-btn-bg) !important;',
            'border-radius:3px;outline:none;border:0;',
            'cursor:pointer;margin:0;padding:0;',
            '}',
            'input.lv-size-slider::-webkit-slider-runnable-track{',
            'height:6px;',
            'background:var(--stk-btn-bg);',
            'border-radius:3px;border:0;',
            '}',
            'input.lv-size-slider::-webkit-slider-thumb{',
            '-webkit-appearance:none !important;appearance:none !important;',
            'width:14px;height:14px;',
            'border-radius:50%;border:0;',
            'background:var(--stk-accent);',
            'cursor:pointer;margin-top:-4px;',
            'transition:background .2s;',
            '}',
            'input.lv-size-slider::-webkit-slider-thumb:hover{',
            'background:var(--stk-accent-hover);',
            '}',
            'input.lv-size-slider::-moz-range-thumb{',
            'width:14px;height:14px;',
            'border-radius:50%;',
            'background:var(--stk-accent);',
            'border:0;cursor:pointer;',
            '}',
            'input.lv-size-slider::-moz-range-track{',
            'height:6px;',
            'background:var(--stk-btn-bg);',
            'border-radius:3px;border:0;',
            '}',
            '.lv-size-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}',
            '.lv-size-label span:first-child{font-size:11px;font-weight:600;font-family:var(--stk-font);color:var(--stk-label);letter-spacing:.3px;}',
            '.lv-size-label span:last-child{font-size:11px;font-weight:600;font-family:var(--stk-font);color:var(--stk-accent);}',
            '.lv-mgmt-item{',
            'position:relative;min-width:0;',
            'background:var(--stk-item-bg);',
            'border:1px solid var(--stk-item-border);',
            'border-radius:8px;padding:4px;text-align:center;',
            '}',
            '.lv-mgmt-thumb{width:100%;height:38px;object-fit:contain;border-radius:4px;}',
            '.lv-mgmt-text{',
            'display:flex;align-items:center;justify-content:center;',
            'width:100%;height:38px;',
            'font-size:11px;overflow:hidden;',
            'line-height:1.2;text-align:center;',
            '}',
            '.lv-mgmt-name{font-size:9px;color:var(--stk-label);word-break:break-all;margin-top:2px;}',
            '.lv-mgmt-del{',
            'position:absolute;top:3px;right:3px;',
            'display:flex;align-items:center;justify-content:center;',
            'width:16px;height:16px;padding:0;',
            'background:var(--stk-danger);color:var(--stk-danger-text);',
            'border:0;border-radius:50%;',
            'font-size:10px;cursor:pointer;',
            'font-family:var(--stk-font);',
            'transition:background .2s;',
            '}',
            '.lv-mgmt-del:hover{background:var(--stk-danger-hover);}',
            '/* 聊天按钮 */',
            '#lvStickerChatBtn{',
            'width:36px;min-width:36px;height:36px;padding:4px;',
            'flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;',
            'cursor:pointer;',
            'background:var(--stk-btn-bg);',
            'border:1px solid var(--stk-btn-border);',
            'border-radius:6px;color:var(--stk-btn-text);',
            'transition:background .2s,color .2s;',
            '}',
            '#lvStickerChatBtn:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '#lvStickerChatBtn{user-select:none;-webkit-tap-highlight-color:transparent;}',
            '/* 聊天内贴纸 */',
            '.lv-chat-sticker{width:var(--stk-sticker-size,50%);height:auto;object-fit:contain;vertical-align:middle;border-radius:6px;margin:0 1px;}',
            '.lv-chat-sticker-video-btn{',
            'display:inline-flex;align-items:center;justify-content:center;',
            'padding:6px 14px;',
            'background:var(--stk-accent);color:var(--stk-accent-text);',
            'border-radius:6px;font-size:12px;font-family:var(--stk-font);',
            'cursor:pointer;margin:0 2px;',
            'transition:background .2s;',
            '}',
            '.lv-chat-sticker-video-btn:hover{background:var(--stk-accent-hover);}',
            '.lv-chat-sticker-audio-btn{',
            'display:inline-flex;align-items:center;justify-content:center;',
            'padding:6px 14px;',
            'background:var(--stk-btn-bg);color:var(--stk-btn-text);',
            'border:1px solid var(--stk-btn-border);',
            'border-radius:6px;font-size:12px;font-family:var(--stk-font);',
            'cursor:pointer;margin:0 2px;',
            'transition:background .2s,color .2s;',
            '}',
            '.lv-chat-sticker-audio-btn:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '.lv-detail-video{max-width:100%;max-height:50vh;border-radius:8px;display:block;outline:none;}',
            '/* 选择面板视频缩略图 */',
            '.lv-sticker-video{',
            'width:50px;height:50px;object-fit:cover;border-radius:8px;',
            'background:var(--stk-btn-bg);',
            '}',
            '.lv-sticker-video-icon{',
            'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
            'width:0;height:0;border-style:solid;',
            'border-width:8px 0 8px 14px;',
            'border-color:transparent transparent transparent rgba(255,255,255,.8);',
            'pointer-events:none;',
            '}',
            '/* 音频 */',
            '.lv-chat-sticker-audio{display:inline-block;vertical-align:middle;margin:0 1px;max-width:100%;min-width:200px;height:40px;outline:none;}',
            '.lv-detail-audio{max-width:100%;display:block;outline:none;margin:12px 0;}',
            '.lv-sticker-audio-icon{',
            'display:flex;align-items:center;justify-content:center;',
            'width:50px;height:50px;font-size:28px;',
            '}',
            '/* 贴纸详情弹窗 */',
            '.lv-detail-overlay{',
            'position:fixed;inset:0;z-index:2147483647;',
            'background:rgba(0,0,0,.55);',
            'display:flex;align-items:center;justify-content:center;',
            'touch-action:none;',
            '}',
            '.lv-detail-card{',
            'background:var(--stk-bg);',
            'border:1px solid var(--stk-border);',
            'border-radius:14px;',
            'width:360px;max-width:94vw;max-height:90vh;overflow-y:auto;',
            'box-shadow:0 8px 32px rgba(0,0,0,.35);',
            'padding:16px;',
            'user-select:none;-webkit-tap-highlight-color:transparent;',
            '}',
            '.lv-detail-card::-webkit-scrollbar{width:5px;}',
            '.lv-detail-card::-webkit-scrollbar-thumb{background:var(--stk-btn-border);border-radius:3px;}',
            '.lv-detail-card::-webkit-scrollbar-track{background:transparent;}',
            '.lv-detail-header{',
            'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;',
            '}',
            '.lv-detail-header span{',
            'font-size:14px;font-weight:700;font-family:var(--stk-font);color:var(--stk-text);',
            '}',
            '.lv-detail-close{',
            'display:flex;align-items:center;justify-content:center;',
            'width:28px;height:28px;padding:0;',
            'background:var(--stk-btn-bg);border:1px solid var(--stk-btn-border);',
            'border-radius:50%;color:var(--stk-btn-text);',
            'font-size:16px;cursor:pointer;',
            'font-family:var(--stk-font);transition:background .2s,color .2s;',
            '}',
            '.lv-detail-close:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '.lv-detail-img-wrap{',
            'margin-bottom:10px;overflow:hidden;cursor:grab;',
            'border-radius:8px;min-height:60px;max-height:50vh;',
            'display:flex;align-items:center;justify-content:center;',
            '}',
            '.lv-detail-img-wrap.grabbing{cursor:grabbing;}',
            '.lv-detail-img{',
            'max-width:100%;',
            'object-fit:contain;',
            'display:block;',
            'transition:none;',
            'user-select:none;',
            '}',
            '.lv-detail-zoom{',
            'display:flex;align-items:center;gap:8px;margin-bottom:12px;',
            '}',
            '.lv-detail-zoom .lv-size-slider{flex:1;}',
            '.lv-detail-zoom .lv-zoom-btn{',
            'display:flex;align-items:center;justify-content:center;',
            'width:26px;height:26px;padding:0;',
            'background:var(--stk-btn-bg);border:1px solid var(--stk-btn-border);',
            'border-radius:6px;color:var(--stk-btn-text);',
            'font-size:15px;cursor:pointer;',
            'font-family:var(--stk-font);transition:background .2s,color .2s;',
            'flex:0 0 auto;',
            '}',
            '.lv-detail-zoom .lv-zoom-btn:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '.lv-detail-info{',
            'margin-bottom:12px;',
            '}',
            '.lv-detail-info-row{',
            'display:flex;margin-bottom:6px;font-size:11px;font-family:var(--stk-font);',
            '}',
            '.lv-detail-info-row .lv-detail-label{',
            'color:var(--stk-label);width:36px;flex-shrink:0;font-weight:600;',
            '}',
            '.lv-detail-info-row .lv-detail-value{',
            'color:var(--stk-text);word-break:break-all;',
            'user-select:text;',
            '}',
            '.lv-detail-actions{',
            'display:flex;gap:8px;',
            '}',
            '.lv-detail-actions .lv-btn{flex:1;}',
            '/* Toast */',
            '.lv-toast{',
            'background:var(--stk-bg);color:var(--stk-text);',
            'padding:9px 18px;border-radius:8px;',
            'font-size:12px;font-family:var(--stk-font);pointer-events:none;',
            'border:1px solid var(--stk-border);',
            'box-shadow:0 4px 16px rgba(0,0,0,.3);',
            'transition:opacity .3s;',
            'white-space:nowrap;',
            'user-select:none;-webkit-tap-highlight-color:transparent;',
            'opacity:0.9;',
            '}'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);
    })();

    // ===================== 亮暗模式跟随系统 =====================
    (function enforceColorScheme() {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        function apply() {
            document.documentElement.style.setProperty('color-scheme', mq.matches ? 'dark' : 'light');
        }
        apply();
        mq.addEventListener('change', apply);
    })();

    // ===================== 工具函数 =====================
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ---- 图片加载：直连失败时走 GM_xmlhttpRequest 绕过 PNA 限制 ----
    var _blobCache = {}; // url → blobUrl

    // 页面卸载时释放所有缓存的 blob URL，防止内存泄漏
    window.addEventListener('beforeunload', function () {
        for (var key in _blobCache) {
            try { URL.revokeObjectURL(_blobCache[key]); } catch (e) {}
        }
        _blobCache = {};
    });

    function loadStickerImage(img, url, fallbackName) {
        // 已有缓存直接用
        if (_blobCache[url]) {
            img.src = _blobCache[url];
            return;
        }
        // 构建失败占位元素（可点击查看详情）
        var _fallbackEl = null;
        function _makeFallback() {
            if (_fallbackEl) return;
            if (!img.parentNode) return;
            // 根据上下文选择样式：选择面板格子 / 管理列表 / 聊天消息
            var inMgmt = img.parentNode.closest('#lvStickerManageList');
            var inPicker = !inMgmt && img.parentNode.closest('#lvStickerPicker');
            _fallbackEl = document.createElement('span');
            if (inMgmt) {
                // 管理列表：填满宽度，匹配 38px 缩略图高度
                _fallbackEl.style.cssText = 'display:flex;align-items:center;justify-content:center;' +
                    'width:100%;height:38px;font-size:18px;color:var(--stk-label);';
                _fallbackEl.textContent = '图片失效';
            } else if (inPicker) {
                // 选择面板：50×50 居中图标
                _fallbackEl.style.cssText = 'display:flex;align-items:center;justify-content:center;' +
                    'width:50px;height:50px;font-size:22px;';
                _fallbackEl.textContent = '图片失效';
            } else {
                // 聊天消息：按钮样式
                _fallbackEl.className = 'lv-chat-sticker-audio-btn';
                _fallbackEl.textContent = '图片失效 ' + (fallbackName || '贴纸');
            }
            _fallbackEl.title = fallbackName || '';
            _fallbackEl.setAttribute('data-lv-url', url);
            _fallbackEl.setAttribute('data-lv-name', fallbackName || '');
            img.parentNode.replaceChild(_fallbackEl, img);
        }
        function _restoreImage(blobUrl) {
            if (!_fallbackEl || !_fallbackEl.parentNode) return;
            var newImg = document.createElement('img');
            newImg.className = img.className;
            newImg.alt = img.alt;
            newImg.title = img.title;
            for (var a = 0; a < img.attributes.length; a++) {
                var attr = img.attributes[a];
                if (attr.name !== 'src' && attr.name !== 'class') {
                    newImg.setAttribute(attr.name, attr.value);
                }
            }
            newImg.src = blobUrl;
            _fallbackEl.parentNode.replaceChild(newImg, _fallbackEl);
        }
        // 先尝试直连
        img.src = url;
        img.addEventListener('error', function () {
            // 直连失败，先显示占位
            _makeFallback();
            // 后台尝试 GM 代理
            if (typeof GM_xmlhttpRequest !== 'function') return;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                timeout: 15000,
                onload: function (resp) {
                    if (resp.response && resp.response.type && resp.response.type.indexOf('image') === 0) {
                        var blobUrl = URL.createObjectURL(resp.response);
                        _blobCache[url] = blobUrl;
                        _restoreImage(blobUrl);
                    }
                },
                onerror: function () {},
                ontimeout: function () {}
            });
        });
        // 直连成功的话 error 不会触发，完美
    }

    // ===================== 贴纸数据（localStorage） =====================
    var STICKER_KEY = 'lvStickerList';
    var STICKER_SIZE_KEY = 'lvStickerSize';

    function getStickerList() {
        try { return JSON.parse(localStorage.getItem(STICKER_KEY)) || []; } catch (e) { return []; }
    }

    function saveStickerList(list) {
        try { localStorage.setItem(STICKER_KEY, JSON.stringify(list)); } catch (e) {}
    }

    function addSticker(name, url) {
        var list = getStickerList();
        var maxId = 0;
        for (var i = 0; i < list.length; i++) { if (list[i].id > maxId) maxId = list[i].id; }
        list.push({ id: maxId + 1, name: name, url: url });
        saveStickerList(list);
        return list;
    }

    function removeSticker(id) {
        var list = getStickerList().filter(function (e) { return e.id !== id; });
        saveStickerList(list);
        return list;
    }

    function exportStickerList() {
        var list = getStickerList();
        if (!list.length) { showToastMsg('贴纸列表为空，无法导出'); return ''; }
        var text = JSON.stringify(list, null, 2);
        var blob = new Blob([text], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        var now = new Date();
        var ds = now.toISOString().slice(0, 10);
        var ts = ('0' + now.getHours()).slice(-2) + ('0' + now.getMinutes()).slice(-2) + ('0' + now.getSeconds()).slice(-2);
        a.download = 'lingverse-stickers-' + ds + '-' + ts + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToastMsg('贴纸列表已导出');
        return text;
    }

    function importStickerList(jsonStr) {
        try {
            // 去掉可能的 markdown 代码块标记
            var cleaned = jsonStr
                .replace(/^```(?:json)?\s*\n?/i, '')
                .replace(/\n?\s*```\s*$/, '')
                .trim();
            var incoming = JSON.parse(cleaned);

            // 数组格式: [{id, name, url}, ...]
            if (Array.isArray(incoming)) {
                var list = getStickerList();
                var idMap = {};
                for (var i = 0; i < list.length; i++) { idMap[list[i].id] = true; }
                var added = 0;
                for (var j = 0; j < incoming.length; j++) {
                    var item = incoming[j];
                    if (!item || !item.name || !item.url) continue;
                    if (item.id && idMap[item.id]) continue;
                    var maxId = 0;
                    for (var k = 0; k < list.length; k++) { if (list[k].id > maxId) maxId = list[k].id; }
                    list.push({ id: maxId + 1, name: item.name, url: item.url });
                    idMap[list[list.length - 1].id] = true;
                    added++;
                }
                saveStickerList(list);
                showToastMsg('导入了 ' + added + ' 个贴纸');
                return list;
            }

            // owo 格式: {"分类名": {"type": "emoticon|emoji|image", "container": [...]}}
            if (typeof incoming === 'object') {
                return importOwoFormat(incoming);
            }

            throw new Error('格式错误');
        } catch (e) {
            showToastMsg('导入失败：' + (e.message || '格式不正确'));
            console.error('[lvSticker] import error:', e);
            return null;
        }
    }

    function importOwoFormat(data) {
        var list = getStickerList();
        // 构建已有 URL 去重集合
        var seenUrls = {};
        for (var i = 0; i < list.length; i++) { seenUrls[list[i].url] = true; }
        var added = 0;
        var categories = Object.keys(data);

        for (var c = 0; c < categories.length; c++) {
            var cat = data[categories[c]];
            if (!cat || !cat.container || !Array.isArray(cat.container)) continue;
            var type = cat.type || 'image';

            for (var j = 0; j < cat.container.length; j++) {
                var item = cat.container[j];
                if (!item || item.icon === undefined) continue;
                var name = item.text || '';
                var url = '';

                if (type === 'image') {
                    // 从 <img src="..."> 提取 URL
                    var m = item.icon.match(/src=['"]([^'"]+)['"]/);
                    url = m ? m[1] : '';
                } else {
                    // emoticon / emoji：直接存文本
                    url = item.icon;
                }

                if (!url) continue;
                // 去重
                if (seenUrls[url]) continue;
                seenUrls[url] = true;

                var maxId = 0;
                for (var k = 0; k < list.length; k++) { if (list[k].id > maxId) maxId = list[k].id; }
                list.push({ id: maxId + 1, name: name, url: url });
                added++;
            }
        }

        saveStickerList(list);
        showToastMsg('导入了 ' + added + ' 个贴纸');
        return list;
    }

    // 判断是否为文本类贴纸（非 http URL）
    // 判断是否纯 emoji（1-4 个 emoji 字符，含变体选择器和 ZWJ）
    function isEmojiOnly(str) {
        if (!str) return false;
        var chars = Array.from(str).filter(function (c) { return !/\s/.test(c); });
        if (chars.length > 4) return false;
        return chars.every(function (c) { return /\p{Emoji}/u.test(c); });
    }

    function isTextSticker(url) {
        if (!url) return true;
        // 远程/本地链接 → 不是文字贴纸
        if (/^(https?|file|ftp):\/\//i.test(url)) return false;
        if (/^[A-Za-z]:[\\/]/.test(url)) return false;
        if (/^\\\\/.test(url)) return false;
        if (/^\/[^\/]/.test(url)) return false;
        return true;
    }

    // 判断是否为视频 URL
    function isVideoUrl(url) {
        if (/\.(mp4|webm|ogv|mov|mkv|m4v|3gp|avi|m3u8|ts)(\?|#|$)/i.test(url)) return true;
        if (/\/video\//i.test(url)) return true;
        if (/[?&](video_id|vid|video|play)=/i.test(url)) return true; // 抖音等CDN
        return false;
    }

    // 判断是否为音频 URL
    function isAudioUrl(url) {
        if (/\.(mp3|wav|flac|aac|m4a|oga|opus|weba|wma|ogg)(\?|#|$)/i.test(url)) return true;
        if (/\/audio\//i.test(url) || /\/music\//i.test(url)) return true;
        if (/[?&](audio_id|music_id|song_id|track_id)=/i.test(url)) return true;
        return false;
    }

    // 判断是否为浏览器可渲染的图片 URL（非视频/音频/其他文件）
    function isImageUrl(url) {
        if (!url) return false;
        if (isVideoUrl(url)) return false;
        if (isAudioUrl(url)) return false;
        // 有明确非图片扩展名 → 不是图片
        if (/\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz|exe|apk|dmg|iso|txt|csv|json|xml|html?|css|js|py|java|cpp?|h|php|go|rs|ts|jsx|tsx|vue|svelte)(\?|#|$)/i.test(url)) return false;
        // 远程 URL（http/https/ftp/file）→ 只要不是明确非图片就算图片
        if (/^(https?|file|ftp):\/\//i.test(url)) return true;
        if (/\.(png|jpe?g|gif|webp|svg|bmp|ico|avif|tiff?)(\?|#|$)/i.test(url)) return true;
        return false;
    }

    // 视频/音频：直连加载
    function loadStickerMedia(el, url, name) {
        el.src = url;
    }

    function getStickerSize() {
        try { var v = parseInt(localStorage.getItem(STICKER_SIZE_KEY), 10); if (v >= 5 && v <= 100) return v; } catch (e) {}
        return 55; // 默认 55%
    }

    function setStickerSize(pct) {
        try { localStorage.setItem(STICKER_SIZE_KEY, String(pct)); } catch (e) {}
    }

    function applyStickerSize() {
        var pct = getStickerSize();
        // 测量可见聊天消息容器的实际宽度，以此为基准计算像素值
        var containerIds = ['inlineChatMessages', 'chatMessages', 'friendChatMessages', 'dungeonChatMessages'];
        var containerWidth = 0;
        for (var i = 0; i < containerIds.length; i++) {
            var c = document.getElementById(containerIds[i]);
            if (c && c.offsetParent !== null && c.clientWidth > 0) {
                containerWidth = c.clientWidth;
                break;
            }
        }
        if (containerWidth > 0) {
            var px = Math.round(containerWidth * pct / 100);
            document.documentElement.style.setProperty('--stk-sticker-size', px + 'px');
        } else {
            // 回退：估算值（大多数聊天框约 350px 宽）
            document.documentElement.style.setProperty('--stk-sticker-size', Math.round(pct * 3.5) + 'px');
        }
    }

    var _toastContainer = null;
    function showToastMsg(msg) {
        if (!_toastContainer) {
            _toastContainer = document.createElement('div');
            _toastContainer.id = 'lvToastContainer';
            _toastContainer.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;';
            document.body.appendChild(_toastContainer);
        }
        var toast = document.createElement('div');
        toast.className = 'lv-toast';
        toast.textContent = msg;
        _toastContainer.appendChild(toast);
        setTimeout(function () { toast.style.opacity = '0'; toast.style.transform = 'translateY(-8px)'; }, 1600);
        setTimeout(function () { toast.remove(); }, 2100);
    }

    // ===================== 贴纸选择面板 =====================
    var pickerVisible = false;
    var pickerEl = null;
    var manageVisible = false;

    function buildPicker() {
        if (pickerEl) return;
        pickerEl = document.getElementById('lvStickerPicker');
        if (!pickerEl) {
            pickerEl = document.createElement('div');
            pickerEl.id = 'lvStickerPicker';
            pickerEl.setAttribute('data-lv-sticker', 'picker');
            document.body.appendChild(pickerEl);
        }
    }

    function renderPicker() {
        if (!pickerEl) buildPicker();
        var list = getStickerList();

        // --- 贴纸网格 ---
        var html = '<div id="lvStickerScroll" style="padding:10px 8px 4px;flex:1;overflow-y:auto;min-height:0;">';
        if (!list.length) {
            html += '<div style="text-align:center;color:var(--stk-label);padding:24px 8px;font-size:12px;font-family:var(--stk-font);">还没有贴纸<br><span style="font-size:10px;">点击下方「管理」添加</span></div>';
        } else {
            html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;" id="lvStickerGrid">';
            for (var i = 0; i < list.length; i++) {
                var e = list[i];
                if (isTextSticker(e.url)) {
                    var textSize = isEmojiOnly(e.url) ? 'font-size:22px;' : 'font-size:14px;';
                    html += '<div data-sticker-id="' + e.id + '" class="lv-sticker-item">' +
                        '<span class="lv-sticker-text" style="' + textSize + '">' + escapeHtml(e.url) + '</span>' +
                        '<span class="lv-sticker-name">' + escapeHtml(e.name || e.url) + '</span>' +
                        '</div>';
                } else if (isVideoUrl(e.url)) {
                    html += '<div data-sticker-id="' + e.id + '" class="lv-sticker-item">' +
                        '<span class="lv-sticker-video-slot" data-eurl="' + escapeHtml(e.url) + '" data-ename="' + escapeHtml(e.name) + '"></span>' +
                        '<span class="lv-sticker-video-icon"></span>' +
                        '<span class="lv-sticker-name">' + escapeHtml(e.name) + '</span>' +
                        '</div>';
                } else if (isAudioUrl(e.url)) {
                    html += '<div data-sticker-id="' + e.id + '" class="lv-sticker-item">' +
                        '<span class="lv-sticker-audio-icon">🔊</span>' +
                        '<span class="lv-sticker-name">' + escapeHtml(e.name) + '</span>' +
                        '</div>';
                } else if (isImageUrl(e.url)) {
                    html += '<div data-sticker-id="' + e.id + '" class="lv-sticker-item">' +
                        '<span class="lv-sticker-img-slot" data-eurl="' + escapeHtml(e.url) + '" data-ename="' + escapeHtml(e.name) + '"></span>' +
                        '<span class="lv-sticker-name">' + escapeHtml(e.name) + '</span>' +
                        '</div>';
                } else {
                    html += '<div data-sticker-id="' + e.id + '" class="lv-sticker-item">' +
                        '<span class="lv-sticker-text">📄</span>' +
                        '<span class="lv-sticker-name">' + escapeHtml(e.name) + '</span>' +
                        '</div>';
                }
            }
            html += '</div>';
        }
        html += '</div>';

        // --- 管理区 ---
        html += '<div id="lvStickerManagePanel" class="lv-mgmt-panel" style="display:none;flex:1;overflow-y:auto;min-height:0;">' +
            '<div class="lv-mgmt-row">' +
            '<label>名称</label>' +
            '<input id="lvStickerName" type="text" placeholder="输入贴纸名称">' +
            '</div>' +
            '<div class="lv-mgmt-row">' +
            '<label>URL</label>' +
            '<input id="lvStickerUrl" type="text" placeholder="图片/视频/音频链接, 文本/emoji">' +
            '</div>' +
            '<div class="lv-mgmt-row-actions">' +
            '<button id="lvStickerAddBtn" class="lv-btn lv-btn-add" style="flex:1;">添加</button>' +
            '</div>' +
            '<div class="lv-mgmt-row-actions">' +
            '<button id="lvStickerExportBtn" class="lv-btn-outline">导出</button>' +
            '<button id="lvStickerImportBtn" class="lv-btn-outline">导入</button>' +
            '<input id="lvStickerImportInput" type="text" placeholder="粘贴 JSON" style="flex:1;height:26px;font-size:11px;display:none;background:var(--stk-input-bg);border:1px solid var(--stk-input-border);border-radius:6px;color:var(--stk-text);padding:0 8px;font-family:var(--stk-font);outline:none;">' +
            '</div>' +
            '<div class="lv-mgmt-row">' +
            '<div class="lv-size-label"><span>贴纸大小</span><span id="lvStickerSizeVal">' + getStickerSize() + '%</span></div>' +
            '<input id="lvStickerSizeSlider" class="lv-size-slider" type="range" min="5" max="100" value="' + getStickerSize() + '">' +
            '</div>' +
            '<div id="lvStickerManageList" style="flex:1;"></div>' +
            '<div style="margin-top:8px;font-size:10px;text-align:center;font-family:var(--stk-font);color:var(--stk-label);">' +
            '>///< : <a href="https://github.com/sewolonX/lingverse-chat-sticker" target="_blank" style="color:var(--stk-accent);text-decoration:none;">lingverse-chat-sticker</a>' +
            '</div>' +
            '</div>' +
            '<div class="lv-mgmt-divider">' +
            '<button id="lvStickerToggleManage" class="lv-mgmt-toggle">管理</button>' +
            '</div>';

        pickerEl.innerHTML = html;

        // --- DOM API 创建图片，走 GM 回退 ---
        var slots = pickerEl.querySelectorAll('.lv-sticker-img-slot');
        for (var s = 0; s < slots.length; s++) {
            (function (slot) {
                var url = slot.getAttribute('data-eurl');
                var name = slot.getAttribute('data-ename') || '贴纸';
                var img = document.createElement('img');
                img.className = 'lv-sticker-img';
                img.alt = name;
                loadStickerImage(img, url, name);
                slot.parentNode.replaceChild(img, slot);
            })(slots[s]);
        }

        // --- DOM API 创建视频缩略图 ---
        var videoSlots = pickerEl.querySelectorAll('.lv-sticker-video-slot');
        for (var vs = 0; vs < videoSlots.length; vs++) {
            (function (slot) {
                var url = slot.getAttribute('data-eurl');
                var name = slot.getAttribute('data-ename') || '贴纸';
                var vid = document.createElement('video');
                vid.className = 'lv-sticker-video';
                vid.src = url;
                vid.muted = true;
                vid.playsInline = true;
                vid.preload = 'metadata';
                // 加载完成后跳到0.1秒显示缩略图
                slot.parentNode.replaceChild(vid, slot);
            })(videoSlots[vs]);
        }

        // --- 点击事件：直接发送 ---
        var items = pickerEl.querySelectorAll('.lv-sticker-item');
        for (var j = 0; j < items.length; j++) {
            (function (item) {
                item.addEventListener('click', function () {
                    var stickerId = parseInt(item.getAttribute('data-sticker-id'), 10);
                    sendSticker(stickerId);
                });
            })(items[j]);
        }

        // Toggle management
        var toggleBtn = document.getElementById('lvStickerToggleManage');
        var managePanel = document.getElementById('lvStickerManagePanel');
        var scrollArea = document.getElementById('lvStickerScroll');
        if (toggleBtn && managePanel) {
            toggleBtn.onclick = function (e) {
                e.stopPropagation();
                manageVisible = !manageVisible;
                managePanel.style.display = manageVisible ? '' : 'none';
                if (scrollArea) scrollArea.style.display = manageVisible ? 'none' : '';
                toggleBtn.textContent = manageVisible ? '退出管理' : '管理';
                if (manageVisible) renderManageList();
            };
        }

        // Add button
        var addBtn = document.getElementById('lvStickerAddBtn');
        var nameInput = document.getElementById('lvStickerName');
        var urlInput = document.getElementById('lvStickerUrl');
        if (addBtn && nameInput && urlInput) {
            addBtn.onclick = function (e) {
                e.stopPropagation();
                var name = nameInput.value.trim();
                var url = urlInput.value.trim();
                if (!name) { showToastMsg('请输入贴纸名'); return; }
                if (/[:\[\]]/.test(name)) { showToastMsg('名称不能包含 : [ ] 字符'); return; }
                if (!url) { showToastMsg('请输入图片URL'); return; }
                addSticker(name, url);
                nameInput.value = '';
                urlInput.value = '';
                showToastMsg('已添加: ' + name);
                renderPicker(); // Refresh entire panel
            };
        }

        // Export
        var exportBtn = document.getElementById('lvStickerExportBtn');
        if (exportBtn) {
            exportBtn.onclick = function (e) {
                e.stopPropagation();
                exportStickerList();
            };
        }

        // Import
        var importBtn = document.getElementById('lvStickerImportBtn');
        var importInput = document.getElementById('lvStickerImportInput');
        if (importBtn && importInput) {
            function doImport() {
                var val = importInput.value.trim();
                if (!val) { showToastMsg('请粘贴贴纸JSON'); return; }
                var result = importStickerList(val);
                if (result) { importInput.value = ''; importInput.style.display = 'none'; importBtn.textContent = '导入'; renderPicker(); }
            }
            importBtn.onclick = function (e) {
                e.stopPropagation();
                if (importInput.style.display === 'none') {
                    importInput.style.display = '';
                    importInput.focus();
                    importBtn.textContent = '确认导入';
                } else {
                    doImport();
                }
            };
            // Enter 键触发导入
            importInput.onkeydown = function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    doImport();
                }
            };
        }

        // Render management list
        renderManageList();

        // --- 贴纸大小滑块事件 ---
        var sizeSlider = document.getElementById('lvStickerSizeSlider');
        var sizeVal = document.getElementById('lvStickerSizeVal');
        if (sizeSlider && sizeVal) {
            sizeSlider.oninput = function () {
                var pct = parseInt(sizeSlider.value, 10);
                sizeVal.textContent = pct + '%';
                setStickerSize(pct);
                applyStickerSize();
            };
        }

        // 保持管理面板展开状态（因 renderPicker 会重建 DOM）
        if (manageVisible) {
            var mp = document.getElementById('lvStickerManagePanel');
            var tb = document.getElementById('lvStickerToggleManage');
            var sa = document.getElementById('lvStickerScroll');
            if (mp) mp.style.display = '';
            if (sa) sa.style.display = 'none';
            if (tb) tb.textContent = '退出管理';
        }
    }

    function renderManageList() {
        var listEl = document.getElementById('lvStickerManageList');
        if (!listEl) return;
        var list = getStickerList();
        if (!list.length) {
            listEl.innerHTML = '<div style="font-size:10px;color:var(--stk-label);text-align:center;padding:16px;font-family:var(--stk-font);">暂无</div>';
            return;
        }
        var html = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:5px;">';
        for (var i = 0; i < list.length; i++) {
            var e = list[i];
            if (isTextSticker(e.url)) {
                var mtSize = isEmojiOnly(e.url) ? 'font-size:16px;' : 'font-size:11px;';
                html += '<div class="lv-mgmt-item">' +
                    '<span class="lv-mgmt-text" style="' + mtSize + '">' + escapeHtml(e.url) + '</span>' +
                    '<div class="lv-mgmt-name">' + escapeHtml(e.name || e.url) + '</div>' +
                    '<button data-del="' + e.id + '" class="lv-mgmt-del" title="删除">×</button>' +
                    '</div>';
            } else if (isVideoUrl(e.url)) {
                html += '<div class="lv-mgmt-item">' +
                    '<span class="lv-mgmt-video-slot" data-eurl="' + escapeHtml(e.url) + '" data-ename="' + escapeHtml(e.name) + '"></span>' +
                    '<div class="lv-mgmt-name">' + escapeHtml(e.name) + '</div>' +
                    '<button data-del="' + e.id + '" class="lv-mgmt-del" title="删除">×</button>' +
                    '</div>';
            } else if (isAudioUrl(e.url)) {
                html += '<div class="lv-mgmt-item">' +
                    '<span class="lv-mgmt-audio-slot" style="display:flex;align-items:center;justify-content:center;width:100%;height:38px;font-size:24px;">🔊</span>' +
                    '<div class="lv-mgmt-name">' + escapeHtml(e.name) + '</div>' +
                    '<button data-del="' + e.id + '" class="lv-mgmt-del" title="删除">×</button>' +
                    '</div>';
            } else if (isImageUrl(e.url)) {
                html += '<div class="lv-mgmt-item">' +
                    '<span class="lv-mgmt-img-slot" data-eurl="' + escapeHtml(e.url) + '" data-ename="' + escapeHtml(e.name) + '"></span>' +
                    '<div class="lv-mgmt-name">' + escapeHtml(e.name) + '</div>' +
                    '<button data-del="' + e.id + '" class="lv-mgmt-del" title="删除">×</button>' +
                    '</div>';
            } else {
                html += '<div class="lv-mgmt-item">' +
                    '<span class="lv-mgmt-text">📄</span>' +
                    '<div class="lv-mgmt-name">' + escapeHtml(e.name) + '</div>' +
                    '<button data-del="' + e.id + '" class="lv-mgmt-del" title="删除">×</button>' +
                    '</div>';
            }
        }
        html += '</div>';
        listEl.innerHTML = html;

        // DOM API 创建缩略图
        var slots = listEl.querySelectorAll('.lv-mgmt-img-slot');
        for (var s = 0; s < slots.length; s++) {
            (function (slot) {
                var url = slot.getAttribute('data-eurl');
                var name = slot.getAttribute('data-ename') || '贴纸';
                var img = document.createElement('img');
                img.className = 'lv-mgmt-thumb';
                img.alt = name;
                loadStickerImage(img, url, name);
                slot.parentNode.replaceChild(img, slot);
            })(slots[s]);
        }

        // DOM API 创建视频缩略图
        var videoSlots = listEl.querySelectorAll('.lv-mgmt-video-slot');
        for (var vs = 0; vs < videoSlots.length; vs++) {
            (function (slot) {
                var url = slot.getAttribute('data-eurl');
                var vid = document.createElement('video');
                vid.className = 'lv-mgmt-thumb';
                vid.src = url;
                vid.muted = true;
                vid.playsInline = true;
                vid.preload = 'metadata';
                slot.parentNode.replaceChild(vid, slot);
            })(videoSlots[vs]);
        }

        // 点击管理项 → 打开详情面板
        var mgmtItems = listEl.querySelectorAll('.lv-mgmt-item');
        for (var m = 0; m < mgmtItems.length; m++) {
            (function (item) {
                item.addEventListener('click', function (e) {
                    if (e.target.classList && e.target.classList.contains('lv-mgmt-del')) return;
                    var delBtn = item.querySelector('[data-del]');
                    if (!delBtn) return;
                    var id = parseInt(delBtn.getAttribute('data-del'), 10);
                    var list = getStickerList();
                    var sticker = null;
                    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { sticker = list[i]; break; } }
                    if (sticker) showStickerDetail({ id: sticker.id, url: sticker.url, name: sticker.name });
                });
            })(mgmtItems[m]);
        }

        var delBtns = listEl.querySelectorAll('[data-del]');
        for (var d = 0; d < delBtns.length; d++) {
            (function (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var id = parseInt(btn.getAttribute('data-del'), 10);
                    removeSticker(id);
                    renderPicker();
                });
            })(delBtns[d]);
        }
    }

    // ---- base64 编解码（让 URL 安全嵌入聊天文本）----
    function b64Encode(str) {
        try {
            var bytes = new TextEncoder().encode(str);
            var bin = '';
            for (var i = 0; i < bytes.length; i++) {
                bin += String.fromCharCode(bytes[i]);
            }
            return btoa(bin);
        } catch (e) { return ''; }
    }
    function b64Decode(b64) {
        // 直链/路径：直接返回，不尝试 base64 解码
        if (/^(https?|file|ftp):\/\//i.test(b64)) return b64;
        if (/^[A-Za-z]:[\\/]/.test(b64)) return b64;
        if (/^\\\\/.test(b64)) return b64;
        if (/^\//.test(b64)) return b64;
        // IP / 域名 / 有扩展名或含 . 的路径
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}([/?#]|$)/.test(b64)) return b64;
        if (/\./.test(b64)) return b64;
        try {
            var cleaned = b64.replace(/[^A-Za-z0-9+/=]/g, ''); // 剔除 base64 非法字符
            if (!cleaned) return '';
            var bin = atob(cleaned);
            var bytes = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) {
                bytes[i] = bin.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        } catch (e) {
            // base64 解码失败，当作直链/路径返回
            if (b64 && /[\/\\:.]/.test(b64)) return b64;
            return '';
        }
    }

    // 选择最优编码：优先 base64（安全），超 200 字限制时降级为原始 URL
    function bestPayload(url, name) {
        var b64 = b64Encode(url);
        if (!b64) return '';
        var b64Msg = '[E:' + b64 + ':' + name + ']';
        if (b64Msg.length <= 200) return b64;           // base64 能放下，优先用
        if (/^https?:\/\//i.test(url)) {
            var rawMsg = '[E:' + url + ':' + name + ']';
            if (rawMsg.length <= 200) {                  // 原始 URL 能放下，降级
                showToastMsg('URL 过长，base64 编码后 ' + b64Msg.length + ' 字超限，已改用原始链接（' + rawMsg.length + ' 字）');
                return url;
            }
        }
        showToastMsg('URL 过长，base64 编码后 ' + b64Msg.length + ' 字，原始链接也无法放入 200 字限制');
        return b64; // 都放不下，还是用 base64（至少安全性好）
    }

    // 找到当前可见的聊天输入框并填入文字
    // opts.append: true 时追加到现有内容末尾，false 时覆盖
    // opts.send:    true 时自动发送，false 时只填入不发送
    function sendToChatInput(text, opts) {
        opts = opts || {};
        var append = opts.append !== false;  // 默认追加
        var send = opts.send !== false;      // 默认发送
        var sideInput = document.getElementById('chatInput');
        var inlineInput = document.getElementById('inlineChatInput');
        var input = null;
        if (inlineInput && inlineInput.offsetParent !== null) {
            input = inlineInput;
        } else if (sideInput && sideInput.offsetParent !== null) {
            input = sideInput;
        } else {
            input = inlineInput || sideInput;
        }
        if (!input) return false;
        var combined;
        if (append && input.value) {
            combined = input.value + ' ' + text;
        } else {
            combined = text;
        }
        if (combined.length > 200) {
            showToastMsg('内容超过200字限制（已输入' + input.value.length + '字 + 贴纸' + text.length + '字），请缩短后再插入');
            return false;
        }
        input.value = combined;
        if (send && typeof window.sendChat === 'function') {
            try { window.sendChat(); } catch (e) {}
        }
        return true;
    }

    function sendSticker(id) {
        var list = getStickerList();
        var sticker = null;
        for (var i = 0; i < list.length; i++) { if (list[i].id === id) { sticker = list[i]; break; } }
        if (!sticker) return;

        // 文本类贴纸：追加到输入框末尾，不自动发送（用户可继续编辑）
        if (isTextSticker(sticker.url)) {
            if (sendToChatInput(sticker.url, { append: true, send: false })) {
                showToastMsg('已插入文字「' + (sticker.name || sticker.url) + '」（可继续编辑）');
            }
            return;
        }

        // 视频类贴纸
        if (isVideoUrl(sticker.url)) {
            var payloadV = bestPayload(sticker.url, sticker.name);
            if (!payloadV) return;
            if (sendToChatInput('[E:' + payloadV + ':' + sticker.name + ']', { append: true, send: true })) {
                showToastMsg('已插入视频「' + sticker.name + '」到聊天框');
            }
            return;
        }

        // 音频类贴纸
        if (isAudioUrl(sticker.url)) {
            var payloadA = bestPayload(sticker.url, sticker.name);
            if (!payloadA) return;
            if (sendToChatInput('[E:' + payloadA + ':' + sticker.name + ']', { append: true, send: true })) {
                showToastMsg('已插入音频「' + sticker.name + '」到聊天框');
            }
            return;
        }

        // 图片 / 其他媒体贴纸：追加到已有内容后面一起发出
        var payload = bestPayload(sticker.url, sticker.name);
        if (!payload) return;
        if (sendToChatInput('[E:' + payload + ':' + sticker.name + ']', { append: true, send: true })) {
            showToastMsg('已插入贴纸「' + sticker.name + '」到聊天框');
        }
    }

    function showPicker(anchorEl) {
        buildPicker();
        renderPicker();
        var rect = anchorEl.getBoundingClientRect();
        // 始终在上方弹出：计算上方可用空间，空间不足时压缩面板高度
        var gap = 10; // 面板与按钮间距
        var topMargin = 10; // 距视口顶部最小距离
        var spaceAbove = rect.top - topMargin - gap; // 面板在上方可用的最大高度
        var panelMaxHeight = Math.min(400, Math.max(120, spaceAbove)); // 压缩到可用空间，最少120px
        var top = rect.top - gap - panelMaxHeight;
        if (top < topMargin) top = topMargin;
        pickerEl.style.maxHeight = panelMaxHeight + 'px';
        pickerEl.style.top = top + 'px';
        var left = rect.left;
        if (left + 280 > window.innerWidth) left = window.innerWidth - 280;
        if (left < 8) left = 8;
        pickerEl.style.left = left + 'px';
        pickerEl.style.display = 'flex';
        pickerVisible = true;
        setTimeout(function () {
            document.addEventListener('click', hidePickerOnOutside, true);
        }, 50);
    }

    function hidePicker() {
        if (pickerEl) pickerEl.style.display = 'none';
        pickerVisible = false;
        manageVisible = false;
        document.removeEventListener('click', hidePickerOnOutside, true);
    }

    function hidePickerOnOutside(e) {
        if (!pickerVisible) return;
        // 点在面板内部或详情弹窗上 → 不处理
        if (pickerEl && pickerEl.contains(e.target)) return;
        if (detailOverlay && detailOverlay.style.display !== 'none' && detailOverlay.contains(e.target)) return;
        // 管理面板展开时阻止关闭，提示用户先收起
        if (manageVisible) {
            showToastMsg('请先点击「退出管理」再关闭面板');
            return;
        }
        // 检查是否点在了贴纸按钮上
        var clickedOnBtn = false;
        var el = e.target;
        while (el) {
            if (el.id === 'lvStickerChatBtn') { clickedOnBtn = true; break; }
            el = el.parentElement;
        }
        if (!clickedOnBtn) hidePicker();
    }

    // ===================== 聊天贴纸按钮 =====================
    var SVG_ICON = '<svg viewBox="0 0 1287.6 1287.6" fill="none" aria-hidden="true" style="width:20px;height:20px;vertical-align:middle;pointer-events:none;"><path d="M1068.3 202.8 Q1128.3 231.8 1157.3 291.8 Q1173.3 321.8 1176.8 363.3 Q1180.3 404.8 1180.3 497.8 V789.8 Q1180.3 883.8 1176.8 925.3 Q1173.3 966.8 1157.3 995.8 Q1128.3 1055.8 1068.3 1084.8 Q1038.3 1100.8 997.3 1104.3 Q956.3 1107.8 862.3 1107.8 H425.3 Q332.3 1107.8 290.8 1104.3 Q249.3 1100.8 219.3 1084.8 Q159.3 1055.8 130.3 995.8 Q114.3 966.8 110.8 925.3 Q107.3 883.8 107.3 789.8 V497.8 Q107.3 404.8 110.8 363.3 Q114.3 321.8 130.3 291.8 Q159.3 231.8 219.3 202.8 Q249.3 186.8 290.8 183.3 Q332.3 179.8 425.3 179.8 H862.3 Q956.3 179.8 997.3 183.3 Q1038.3 186.8 1068.3 202.8 Z M374.3 300.8 Q330.3 300.8 311.3 302.3 Q292.3 303.8 279.3 310.8 Q257.3 321.8 245.3 340.8 L399.3 510.8 Q404.3 515.8 409.3 516.3 Q414.3 516.8 420.3 510.8 L465.3 463.8 L476.3 451.8 Q496.3 430.8 507.3 421.3 Q518.3 411.8 530.3 408.8 Q557.3 401.8 584.3 408.8 Q597.3 412.8 610.3 424.3 Q623.3 435.8 649.3 463.8 L830.3 654.8 Q835.3 660.8 841.3 660.8 Q847.3 660.8 852.3 655.8 L1062.3 424.8 Q1061.3 396.8 1059.3 380.8 Q1057.3 364.8 1051.3 353.8 Q1036.3 325.8 1009.3 310.8 Q995.3 303.8 973.8 302.3 Q952.3 300.8 899.3 300.8 H388.3 Z M237.3 934.8 Q244.3 947.8 254.8 958.8 Q265.3 969.8 278.3 976.8 Q293.3 984.8 314.8 986.3 Q336.3 987.8 388.3 987.8 H899.3 Q952.3 987.8 973.8 986.3 Q995.3 984.8 1009.3 976.8 Q1036.3 962.8 1051.3 933.8 Q1059.3 919.8 1060.8 898.8 Q1062.3 877.8 1062.3 824.8 V585.8 L934.3 726.8 Q905.3 757.8 893.8 768.3 Q882.3 778.8 869.3 782.8 Q842.3 791.8 815.3 782.8 Q804.3 779.8 794.3 771.8 Q784.3 763.8 760.3 739.8 L749.3 728.8 L566.3 535.8 Q562.3 531.8 556.8 531.8 Q551.3 531.8 547.3 535.8 L502.3 583.8 Q475.3 612.8 462.3 624.3 Q449.3 635.8 436.3 638.8 Q409.3 647.8 382.3 638.8 Q369.3 634.8 357.8 624.3 Q346.3 613.8 317.3 582.8 L226.3 480.8 V824.8 Q226.3 877.8 227.8 899.3 Q229.3 920.8 237.3 934.8 Z M493.3 828.8 Q493.3 866.8 466.3 893.8 Q439.3 920.8 401.3 920.8 Q363.3 920.8 335.8 893.8 Q308.3 866.8 308.3 828.8 Q308.3 790.8 335.8 763.3 Q363.3 735.8 401.3 735.8 Q439.3 735.8 466.3 763.3 Q493.3 790.8 493.3 828.8 Z" transform="matrix(1 0 0 -1 0 1287.6)" fill="currentColor" fill-rule="nonzero" clip-rule="nonzero"></path></svg>';

    function injectStickerButtons() {
        var targets = [
            { inputId: 'inlineChatInput', barSelector: '.chat-input-bar' },
            { inputId: 'chatInput', barSelector: '.chat-input-bar' }
        ];

        for (var t = 0; t < targets.length; t++) {
            var input = document.getElementById(targets[t].inputId);
            if (!input) continue;
            // 找到 input 所在的 chat-input-bar
            var bar = input.closest(targets[t].barSelector);
            if (!bar) continue;
            if (bar.querySelector('#lvStickerChatBtn')) continue;

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'lvStickerChatBtn';
            btn.title = '贴纸';
            btn.setAttribute('data-lv-sticker', 'chat-btn');
            btn.innerHTML = SVG_ICON;

            // eslint-disable-next-line no-loop-func
            (function (button) {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (pickerVisible) {
                        hidePicker();
                    } else {
                        showPicker(button);
                    }
                });
            })(btn);

            // 插到 input 前面（发送按钮之前）
            bar.insertBefore(btn, input);
        }
    }

    // ===================== 消息渲染器 =====================
    var STICKER_RE = /\[E:([\s\S]+?):([^:\]]*)\]/g;

    function renderMsgText(el) {
        if (!el) return;
        // 已处理过且内容未变的跳过
        var text = el.textContent || '';
        if (el._lvStickerLastText === text) return;
        el._lvStickerLastText = text;
        if (text.indexOf('[E:') === -1) return;
        el._lvStickerRawText = text; // 保存原始数据，供详情弹窗展示

        // 用 DOM API 构建替换结果，避免字符串拼接 HTML 的坑
        var frag = document.createDocumentFragment();
        var lastIdx = 0;
        STICKER_RE.lastIndex = 0;
        var m;
        while ((m = STICKER_RE.exec(text)) !== null) {
            // 匹配前的纯文本
            if (m.index > lastIdx) {
                frag.appendChild(document.createTextNode(text.slice(lastIdx, m.index)));
            }
            lastIdx = STICKER_RE.lastIndex;

            var url = b64Decode(m[1]);
            var name = m[2] || '贴纸';
            if (url) {
                if (isVideoUrl(url)) {
                    var vidBtn = document.createElement('span');
                    vidBtn.className = 'lv-chat-sticker-video-btn';
                    vidBtn.title = name;
                    vidBtn.textContent = '▶ ' + (name || '视频');
                    vidBtn.setAttribute('data-lv-url', url);
                    vidBtn.setAttribute('data-lv-name', name);
                    frag.appendChild(vidBtn);
                } else if (isAudioUrl(url)) {
                    var audBtn = document.createElement('span');
                    audBtn.className = 'lv-chat-sticker-audio-btn';
                    audBtn.title = name;
                    audBtn.textContent = '🔊 ' + (name || '音频');
                    audBtn.setAttribute('data-lv-url', url);
                    audBtn.setAttribute('data-lv-name', name);
                    frag.appendChild(audBtn);
                } else if (isImageUrl(url)) {
                    var img = document.createElement('img');
                    img.className = 'lv-chat-sticker';
                    img.alt = '[贴纸:' + name + ']';
                    img.title = name;
                    img.setAttribute('data-lv-sticker-img', '1');
                    img.setAttribute('data-lv-url', url);
                    img.setAttribute('data-lv-name', name);
                    loadStickerImage(img, url, name);
                    frag.appendChild(img);
                } else {
                    var fileBtn = document.createElement('span');
                    fileBtn.className = 'lv-chat-sticker-audio-btn';
                    fileBtn.title = name;
                    fileBtn.textContent = '📄 ' + (name || '文件');
                    fileBtn.setAttribute('data-lv-url', url);
                    fileBtn.setAttribute('data-lv-name', name);
                    frag.appendChild(fileBtn);
                }
            } else {
                // 解码失败，保留原文
                frag.appendChild(document.createTextNode(m[0]));
            }
        }
        // 尾巴文本
        if (lastIdx < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIdx)));
        }

        // 有替换才更新 DOM
        // 检查是否有非文本子节点（宿主页面可能绑定了事件），有则跳过以免破坏交互
        if (frag.childNodes.length > 0) {
            var hasElementChild = false;
            for (var child = el.firstChild; child; child = child.nextSibling) {
                if (child.nodeType === 1) { hasElementChild = true; break; }
            }
            if (!hasElementChild) {
                el.textContent = '';
                el.appendChild(frag);
            }
        }
    }

    function scanMessages() {
        var ids = ['inlineChatMessages', 'chatMessages', 'friendChatMessages', 'dungeonChatMessages'];
        for (var c = 0; c < ids.length; c++) {
            var container = document.getElementById(ids[c]);
            if (!container) continue;
            var texts = container.querySelectorAll('.chat-msg-text');
            for (var t = 0; t < texts.length; t++) {
                renderMsgText(texts[t]);
            }
        }
    }

    // ===================== 贴纸详情弹窗 =====================
    var detailOverlay = null;
    var detailImg = null, detailImgWrap = null, detailZoomSlider = null; // DOM 引用（跨函数共享）
    var detailZoomPct = 100; // 弹窗内默认原始大小
    var detailPanX = 0, detailPanY = 0;
    var detailDragging = false, detailDragStartX = 0, detailDragStartY = 0, detailDragPanX = 0, detailDragPanY = 0;
    var detailJustDragged = false; // 拖拽后阻止误关面板
    var detailBaseW = 0, detailBaseH = 0; // 100% 时的基准显示尺寸
    // 触屏状态
    var detailTouches = {}, detailPinchStartDist = 0, detailPinchStartScale = 1;

    function buildDetailOverlay() {
        if (detailOverlay) return;
        detailOverlay = document.createElement('div');
        detailOverlay.className = 'lv-detail-overlay';
        detailOverlay.setAttribute('data-lv-sticker', 'detail');
        detailOverlay.style.display = 'none';
        detailOverlay.addEventListener('click', function (e) {
            if (detailJustDragged) { detailJustDragged = false; return; }
            if (e.target === detailOverlay) hideStickerDetail();
        });
        document.body.appendChild(detailOverlay);
    }

    function showStickerDetail(opts) {
        var url = opts.url;
        var name = opts.name || '贴纸';
        var rawText = opts.rawText || '';
        var stickerId = opts.id; // 有 id = 用户自己的贴纸
        var isImage = url && url.indexOf('http') === 0;

        buildDetailOverlay();
        detailZoomPct = 100;

        // 预览区：图片 / 视频 / 音频 / 文件 / 文字
        var isVideo = isImage && isVideoUrl(url);
        var isAudio = isImage && isAudioUrl(url);
        var isImg = isImageUrl(url);
        var previewHtml;
        if (isVideo) {
            previewHtml = '<div style="text-align:center;padding:30px 0;">' +
                '<div style="font-size:64px;margin-bottom:12px;">▶</div>' +
                '<div style="font-size:13px;font-family:var(--stk-font);color:var(--stk-text);">' + escapeHtml(name) + '</div>' +
                '</div>';
        } else if (isAudio) {
            previewHtml = '<div style="text-align:center;padding:30px 0;">' +
                '<div style="font-size:64px;margin-bottom:12px;">🎵</div>' +
                '<div style="font-size:13px;font-family:var(--stk-font);color:var(--stk-text);">' + escapeHtml(name) + '</div>' +
                '</div>';
        } else if (isImg) {
            previewHtml = '<img class="lv-detail-img" src="" alt="' + escapeHtml(name) + '">';
        } else if (isImage) {
            previewHtml = '<div style="text-align:center;padding:30px 0;">' +
                '<div style="font-size:64px;margin-bottom:12px;">📄</div>' +
                '<div style="font-size:13px;font-family:var(--stk-font);color:var(--stk-text);">' + escapeHtml(name) + '</div>' +
                '</div>';
        } else {
            previewHtml = '<div class="lv-detail-text-preview" style="font-size:48px;line-height:1.3;word-break:break-all;">' + escapeHtml(url) + '</div>';
        }

        // 缩放区（仅图片有缩放，视频没有）
        var zoomHtml = isImg ? (
            '<div class="lv-detail-zoom">' +
            '<button class="lv-zoom-btn lv-zoom-out" title="缩小">−</button>' +
            '<input class="lv-size-slider lv-detail-zoom-slider" type="range" min="20" max="500" value="' + detailZoomPct + '">' +
            '<span id="lvDetailZoomVal" style="font-size:11px;font-family:var(--stk-font);color:var(--stk-label);min-width:36px;text-align:center;">' + detailZoomPct + '%</span>' +
            '<button class="lv-zoom-btn lv-zoom-in" title="放大">+</button>' +
            '</div>'
        ) : '';

        // 操作按钮
        var actionsHtml = '<div class="lv-detail-actions">';
        // 发送按钮（始终显示）
        actionsHtml += '<button class="lv-btn lv-btn-add" id="lvDetailSendBtn">插入到聊天框</button>';
        // 删除按钮（仅自己的贴纸）
        if (stickerId) {
            actionsHtml += '<button class="lv-btn" id="lvDetailDelBtn" style="color:var(--stk-danger);border-color:var(--stk-danger);">删除</button>';
        }
        // 在新标签页打开（远程链接），本地文件则复制路径
        if (/^(https?|ftp):\/\//i.test(url)) {
            actionsHtml += '<a class="lv-btn" href="' + url.replace(/"/g, '&quot;') + '" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;text-decoration:none;">在新标签页打开</a>';
        } else if (/^file:\/\//i.test(url)) {
            actionsHtml += '<button class="lv-btn" id="lvDetailCopyPathBtn" style="display:inline-flex;align-items:center;">复制本地路径</button>';
        }
        actionsHtml += '</div>';
        // 添加到我的贴纸（非自己的图片贴纸）
        if (!stickerId) {
            actionsHtml += '<div class="lv-detail-actions" style="margin-top:6px;">' +
                '<button class="lv-btn lv-btn-add" id="lvDetailAddBtn" style="flex:1;">添加到我的贴纸</button>' +
                '</div>';
        }

        var html = '<div class="lv-detail-card">' +
            '<div class="lv-detail-header">' +
            '<span>贴纸详情</span>' +
            '<button class="lv-detail-close" title="关闭">×</button>' +
            '</div>' +
            '<div class="lv-detail-img-wrap">' + previewHtml + '</div>' +
            zoomHtml +
            '<div class="lv-detail-info">' +
            '<div class="lv-detail-info-row"><span class="lv-detail-label">名称</span><span class="lv-detail-value">' + escapeHtml(name) + '</span></div>' +
            '<div class="lv-detail-info-row"><span class="lv-detail-label">URL</span><span class="lv-detail-value">' + escapeHtml(url) + '</span></div>' +
            (rawText ? '<div class="lv-detail-info-row"><span class="lv-detail-label">原始</span><span class="lv-detail-value" style="max-height:120px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;font-size:11px;">' + escapeHtml(rawText) + '</span></div>' : '') +
            '</div>' +
            actionsHtml +
            '</div>';

        detailOverlay.innerHTML = html;
        detailOverlay.style.display = '';

        // 加载图片 (使用模块级 detailImg/zoomSlider/imgWrap，避免 var 遮蔽)
        detailImg = detailOverlay.querySelector('.lv-detail-img');
        detailZoomSlider = detailOverlay.querySelector('.lv-detail-zoom-slider');
        detailImgWrap = detailOverlay.querySelector('.lv-detail-img-wrap');
        if (detailImg) {
            detailBaseW = 0; detailBaseH = 0;
            function captureBaseSize() {
                // 延迟一帧确保布局完成
                setTimeout(function () {
                    detailBaseW = detailImg.clientWidth || detailImg.naturalWidth || 300;
                    detailBaseH = detailImg.clientHeight || detailImg.naturalHeight || 200;
                    applyTransform();
                }, 50);
            }
            detailImg.addEventListener('load', captureBaseSize);
            // 如果图片已缓存，src 设置后立即触发
            if (detailImg.complete && detailImg.naturalWidth > 0) {
                captureBaseSize();
            }
            loadStickerImage(detailImg, url, name);
            // 兜底：500ms 后再读一次
            setTimeout(function () {
                if (detailBaseW === 0 && detailImg.naturalWidth > 0) {
                    captureBaseSize();
                }
            }, 500);
        }

        // 关闭按钮
        var closeBtn = detailOverlay.querySelector('.lv-detail-close');
        if (closeBtn) {
            closeBtn.onclick = function (e) {
                e.stopPropagation();
                hideStickerDetail();
            };
        }

        // ===== 图片缩放 / 拖拽 / 触屏 =====

        function applyTransform() {
            if (!detailImg) return;
            // 首次调用自动捕获基准尺寸
            if (detailBaseW === 0) {
                detailBaseW = detailImg.clientWidth || detailImg.naturalWidth || 200;
            }
            if (detailBaseH === 0) {
                detailBaseH = detailImg.clientHeight || detailImg.naturalHeight || 200;
            }
            var scale = detailZoomPct / 100;
            var w = Math.round(detailBaseW * scale);
            var h = Math.round(detailBaseH * scale);
            detailImg.style.width = w + 'px';
            detailImg.style.height = h + 'px';
            detailImg.style.minWidth = w + 'px';
            detailImg.style.minHeight = h + 'px';
            detailImg.style.maxWidth = 'none';
            detailImg.style.maxHeight = 'none';
            detailImg.style.flexShrink = '0';
            detailImg.style.objectFit = 'fill';
            detailImg.style.transform = 'translate(' + detailPanX + 'px,' + detailPanY + 'px)';
            if (detailZoomSlider) detailZoomSlider.value = detailZoomPct;
            var zoomValEl = document.getElementById('lvDetailZoomVal');
            if (zoomValEl) zoomValEl.textContent = detailZoomPct + '%';
            if (detailImgWrap) {
                if (detailZoomPct > 100) {
                    detailImgWrap.style.cursor = 'grab';
                } else {
                    detailImgWrap.style.cursor = 'default';
                    detailPanX = 0; detailPanY = 0;
                    detailImg.style.transform = '';
                }
            }
        }

        function resetPan() {
            detailPanX = 0; detailPanY = 0;
            applyTransform();
        }

        // 滑块
        if (detailZoomSlider && detailImg) {
            detailZoomSlider.oninput = function () {
                detailZoomPct = parseInt(detailZoomSlider.value, 10);
                resetPan();
            };
        }

        // 缩小/放大 按钮
        function stepZoom(delta) {
            detailZoomPct = Math.max(20, Math.min(500, detailZoomPct + delta));
            resetPan();
        }
        var zoomOut = detailOverlay.querySelector('.lv-zoom-out');
        var zoomIn = detailOverlay.querySelector('.lv-zoom-in');
        if (zoomOut) zoomOut.onclick = function (e) { e.stopPropagation(); stepZoom(-20); };
        if (zoomIn) zoomIn.onclick = function (e) { e.stopPropagation(); stepZoom(20); };

        // 鼠标滚轮缩放
        if (detailImgWrap && detailImg) {
            detailImgWrap.addEventListener('wheel', function (e) {
                e.preventDefault();
                var delta = e.deltaY > 0 ? -10 : 10;
                detailZoomPct = Math.max(20, Math.min(500, detailZoomPct + delta));
                if (detailZoomPct <= 100) resetPan();
                applyTransform();
            }, { passive: false });

            // 鼠标拖拽
            detailImgWrap.addEventListener('mousedown', function (e) {
                if (detailZoomPct <= 100) return;
                e.preventDefault();
                detailDragging = true;
                detailDragStartX = e.clientX;
                detailDragStartY = e.clientY;
                detailDragPanX = detailPanX;
                detailDragPanY = detailPanY;
                detailImgWrap.classList.add('grabbing');
            });
        }

        _detailMouseMoveFn = function (e) {
            if (!detailDragging) return;
            detailPanX = detailDragPanX + (e.clientX - detailDragStartX);
            detailPanY = detailDragPanY + (e.clientY - detailDragStartY);
            applyTransform();
        };
        document.addEventListener('mousemove', _detailMouseMoveFn);

        _detailMouseUpFn = function () {
            if (detailDragging) {
                detailDragging = false;
                detailJustDragged = true;
                if (detailImgWrap) detailImgWrap.classList.remove('grabbing');
            }
        };
        document.addEventListener('mouseup', _detailMouseUpFn);

        // 触屏：双指缩放 + 单指拖拽
        if (detailImgWrap && detailImg) {
            detailImgWrap.addEventListener('touchstart', function (e) {
                e.preventDefault();
                detailTouches = {};
                for (var t = 0; t < e.touches.length; t++) {
                    detailTouches[e.touches[t].identifier] = { x: e.touches[t].clientX, y: e.touches[t].clientY };
                }
                var keys = Object.keys(detailTouches);
                if (keys.length === 2) {
                    // 双指：记录初始距离
                    var t1 = detailTouches[keys[0]], t2 = detailTouches[keys[1]];
                    detailPinchStartDist = Math.sqrt(Math.pow(t2.x - t1.x, 2) + Math.pow(t2.y - t1.y, 2));
                    detailPinchStartScale = detailZoomPct;
                } else if (keys.length === 1 && detailZoomPct > 100) {
                    // 单指拖拽
                    detailDragging = true;
                    detailDragStartX = detailTouches[keys[0]].x;
                    detailDragStartY = detailTouches[keys[0]].y;
                    detailDragPanX = detailPanX;
                    detailDragPanY = detailPanY;
                }
            }, { passive: false });

            detailImgWrap.addEventListener('touchmove', function (e) {
                e.preventDefault();
                var keys = Object.keys(detailTouches);
                if (keys.length === 2) {
                    // 更新双指位置
                    for (var t = 0; t < e.touches.length; t++) {
                        if (detailTouches[e.touches[t].identifier] !== undefined) {
                            detailTouches[e.touches[t].identifier] = { x: e.touches[t].clientX, y: e.touches[t].clientY };
                        }
                    }
                    var k = Object.keys(detailTouches);
                    if (k.length === 2) {
                        var t1 = detailTouches[k[0]], t2 = detailTouches[k[1]];
                        var dist = Math.sqrt(Math.pow(t2.x - t1.x, 2) + Math.pow(t2.y - t1.y, 2));
                        if (detailPinchStartDist > 0) {
                            var newScale = detailPinchStartScale * (dist / detailPinchStartDist);
                            detailZoomPct = Math.max(20, Math.min(500, Math.round(newScale)));
                            if (detailZoomPct <= 100) resetPan();
                            applyTransform();
                        }
                    }
                } else if (keys.length === 1 && detailDragging) {
                    // 更新单指位置
                    var k0 = keys[0];
                    if (e.touches.length === 1 && detailTouches[k0]) {
                        detailPanX = detailDragPanX + (e.touches[0].clientX - detailDragStartX);
                        detailPanY = detailDragPanY + (e.touches[0].clientY - detailDragStartY);
                        applyTransform();
                    }
                }
            }, { passive: false });

            detailImgWrap.addEventListener('touchend', function (e) {
                e.preventDefault();
                for (var t = 0; t < e.changedTouches.length; t++) {
                    delete detailTouches[e.changedTouches[t].identifier];
                }
                if (Object.keys(detailTouches).length < 2) {
                    detailPinchStartDist = 0;
                }
                if (Object.keys(detailTouches).length === 0) {
                    detailDragging = false;
                }
            });
        }

        // 初始缩放
        if (detailImg) applyTransform();

        // 发送按钮
        var sendBtn = document.getElementById('lvDetailSendBtn');
        if (sendBtn) {
            sendBtn.onclick = function (e) {
                e.stopPropagation();
                if (stickerId) {
                    sendSticker(stickerId);
                } else {
                    // 聊天贴纸点进来的，没有 id → 按 URL/name 发送
                    if (!isTextSticker(url)) {
                        var payload = bestPayload(url, name);
                        if (payload) sendToChatInput('[E:' + payload + ':' + name + ']', { append: true, send: true });
                    } else {
                        sendToChatInput(url, { append: true, send: false });
                    }
                }
                hideStickerDetail();
            };
        }

        // 复制本地路径按钮（file:// 无法从网页打开，改为复制路径）
        var copyPathBtn = document.getElementById('lvDetailCopyPathBtn');
        if (copyPathBtn) {
            copyPathBtn.onclick = function (e) {
                e.stopPropagation();
                var filePath = url.replace(/^file:\/\/\//i, ''); // file:///C:/... → C:/...
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(filePath).then(function () {
                        showToastMsg('本地路径已复制: ' + filePath);
                    })['catch'](function () {
                        showToastMsg('复制失败，请手动选择路径');
                    });
                } else {
                    showToastMsg('本地路径: ' + filePath);
                }
            };
        }

        // 删除按钮
        var delBtn = document.getElementById('lvDetailDelBtn');
        if (delBtn && stickerId) {
            delBtn.onclick = function (e) {
                e.stopPropagation();
                removeSticker(stickerId);
                showToastMsg('已删除: ' + name);
                hideStickerDetail();
                renderPicker();
            };
        }

        // 添加到我的贴纸
        var addBtn = document.getElementById('lvDetailAddBtn');
        if (addBtn) {
            var list = getStickerList();
            var alreadyExists = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i].url === url) { alreadyExists = true; break; }
            }
            if (alreadyExists) {
                addBtn.textContent = '已添加（同URL已存在）';
                addBtn.disabled = true;
                addBtn.style.opacity = '0.5';
                addBtn.style.cursor = 'default';
            } else {
                addBtn.onclick = function (e) {
                    e.stopPropagation();
                    addSticker(name, url);
                    showToastMsg('已添加: ' + name);
                    addBtn.textContent = '已添加';
                    addBtn.disabled = true;
                    addBtn.style.opacity = '0.5';
                    addBtn.style.cursor = 'default';
                };
            }
        }

        // ESC 关闭
        document.addEventListener('keydown', onDetailKeyDown, true);
    }

    function hideStickerDetail() {
        detailPanX = 0; detailPanY = 0;
        detailDragging = false;
        detailJustDragged = false;
        detailBaseW = 0; detailBaseH = 0;
        detailTouches = {};
        detailPinchStartDist = 0;
        // 清理鼠标拖拽监听器，避免内存泄漏
        if (_detailMouseMoveFn) { document.removeEventListener('mousemove', _detailMouseMoveFn); _detailMouseMoveFn = null; }
        if (_detailMouseUpFn) { document.removeEventListener('mouseup', _detailMouseUpFn); _detailMouseUpFn = null; }
        // 清理 DOM 引用
        detailImg = null; detailImgWrap = null; detailZoomSlider = null;
        if (detailOverlay) {
            detailOverlay.style.display = 'none';
            detailOverlay.innerHTML = '';
        }
        document.removeEventListener('keydown', onDetailKeyDown, true);
    }

    function onDetailKeyDown(e) {
        if (e.key === 'Escape') {
            hideStickerDetail();
        }
    }

    // 鼠标拖拽处理器引用（存入变量以便移除，避免内存泄漏）
    var _detailMouseMoveFn = null;
    var _detailMouseUpFn = null;

    // 事件委托：点击聊天贴纸打开详情
    function onChatStickerClick(e) {
        var el = e.target;
        if (el && (el.classList.contains('lv-chat-sticker') || el.classList.contains('lv-chat-sticker-video-btn') || el.classList.contains('lv-chat-sticker-audio-btn'))) {
            var url = el.getAttribute('data-lv-url');
            var name = el.getAttribute('data-lv-name') || '贴纸';
            var msgEl = el.closest('.chat-msg-text');
            var rawText = msgEl && msgEl._lvStickerRawText ? msgEl._lvStickerRawText : '';
            if (url) {
                showStickerDetail({ url: url, name: name, rawText: rawText });
            }
        }
    }

    function bindStickerClickDelegation() {
        var ids = ['inlineChatMessages', 'chatMessages', 'friendChatMessages', 'dungeonChatMessages'];
        for (var i = 0; i < ids.length; i++) {
            var c = document.getElementById(ids[i]);
            if (c && !c._lvStickerClickBound) {
                c._lvStickerClickBound = true;
                c.addEventListener('click', onChatStickerClick);
            }
        }
    }

    // ===================== 初始化 =====================
    var _scanTimer = null;

    function init() {
        applyStickerSize();
        injectStickerButtons();

        // 窗口大小变化时重新计算贴纸大小
        window.addEventListener('resize', function () {
            applyStickerSize();
        });

        // 定时轮询 + MutationObserver 双保险
        scanMessages();
        _scanTimer = setInterval(function () {
            applyStickerSize();
            scanMessages();
        }, 600);

        // MutationObserver 快速响应新消息
        var observer = new MutationObserver(function () {
            scanMessages();
        });
        function observeContainers() {
            var ids = ['inlineChatMessages', 'chatMessages', 'friendChatMessages', 'dungeonChatMessages'];
            for (var i = 0; i < ids.length; i++) {
                var c = document.getElementById(ids[i]);
                if (c && !c._lvStickerObserved) {
                    c._lvStickerObserved = true;
                    observer.observe(c, { childList: true, subtree: true });
                }
            }
        }
        observeContainers();
        bindStickerClickDelegation();
        // 每隔几秒检查新容器
        setInterval(function () {
            observeContainers();
            bindStickerClickDelegation();
        }, 3000);

        // 聊天面板切换时重新注入按钮
        var chatBtn = document.getElementById('chatBtn');
        if (chatBtn && !chatBtn._lvStickerHooked) {
            chatBtn._lvStickerHooked = true;
            chatBtn.addEventListener('click', function () {
                setTimeout(function () {
                    injectStickerButtons();
                    observeContainers();
                    bindStickerClickDelegation();
                    scanMessages();
                }, 500);
            });
        }

        // 监听 inline chat 变化
        var inlineChat = document.getElementById('inlineChat');
        if (inlineChat && !inlineChat._lvStickerHooked) {
            inlineChat._lvStickerHooked = true;
            new MutationObserver(function () {
                setTimeout(function () {
                    injectStickerButtons();
                    observeContainers();
                    bindStickerClickDelegation();
                }, 300);
            }).observe(inlineChat, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
        }

        // 持续重新注入按钮
        setInterval(injectStickerButtons, 5000);
    }

    // 等游戏 UI 加载后初始化（仅游戏页面需要，避免其他页面无限轮询）
    function waitAndInit() {
        if (document.getElementById('inlineChatInput') || document.getElementById('chatInput') || document.getElementById('chatBtn')) {
            init();
        } else {
            setTimeout(waitAndInit, 800);
        }
    }

    // 仅在游戏页面初始化，其他页面跳过
    if (!/\/game\.html/.test(location.pathname)) return;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(waitAndInit, 1500); });
    } else {
        setTimeout(waitAndInit, 1500);
    }

})();