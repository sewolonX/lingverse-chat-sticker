// ==UserScript==
// @name         LingVerse 聊天表情
// @namespace    local.lingverse.sticker
// @version      1.0.0
// @description  灵界聊天自定义表情：点表情按钮发送，装了脚本的玩家互相可见图片
// @match        https://ling.muge.info/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    if (window.__lvStickerLoaded) return;
    window.__lvStickerLoaded = true;

    // ===================== 注入样式 + 亮暗模式 =====================
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
            'width:272px;max-height:400px;overflow-y:auto;',
            'box-shadow:0 0 6px rgba(0,0,0,.15);',
            'font-size:13px;font-family:var(--stk-font);color:var(--stk-text);',
            'display:none;',
            '}',
            '#lvStickerPicker::-webkit-scrollbar{display:none;}',
            '.lv-sticker-item{',
            'display:flex;flex-direction:column;align-items:center;',
            'padding:5px 2px;border-radius:8px;cursor:pointer;text-align:center;',
            'transition:background .2s;',
            '}',
            '.lv-sticker-item:hover{background:var(--stk-btn-hover-bg);}',
            '.lv-sticker-img{width:50px;height:50px;object-fit:contain;border-radius:8px;}',
            '.lv-sticker-name{font-size:10px;color:var(--stk-label);max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:3px;}',
            '/* 管理区 */',
            '.lv-mgmt-divider{border-top:1px solid var(--stk-btn-border);}',
            '.lv-mgmt-toggle{',
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
            'height:26px;padding:0 10px;font-size:11px;',
            'background:transparent;',
            'border:1px solid var(--stk-btn-border);',
            'border-radius:6px;color:var(--stk-btn-text);font-family:var(--stk-font);',
            'cursor:pointer;transition:background .2s,color .2s;',
            '}',
            '.lv-btn-outline:hover{background:var(--stk-btn-hover-bg);color:var(--stk-btn-hover-text);}',
            '.lv-mgmt-item{',
            'position:relative;',
            'background:var(--stk-item-bg);',
            'border:1px solid var(--stk-item-border);',
            'border-radius:8px;padding:4px;text-align:center;',
            '}',
            '.lv-mgmt-thumb{width:100%;height:38px;object-fit:contain;border-radius:4px;}',
            '.lv-mgmt-name{font-size:9px;color:var(--stk-label);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px;}',
            '.lv-mgmt-del{',
            'position:absolute;top:3px;right:3px;',
            'width:16px;height:16px;padding:0;',
            'background:var(--stk-danger);color:var(--stk-danger-text);',
            'border:0;border-radius:50%;',
            'font-size:10px;line-height:16px;cursor:pointer;',
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
            '/* 聊天内贴纸 */',
            '.lv-chat-sticker{width:52px;height:52px;object-fit:contain;vertical-align:middle;border-radius:6px;margin:0 1px;}',
            '/* Toast */',
            '.lv-toast{',
            'position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:2147483647;',
            'background:var(--stk-bg);color:var(--stk-text);',
            'padding:9px 18px;border-radius:8px;',
            'font-size:12px;font-family:var(--stk-font);pointer-events:none;',
            'border:1px solid var(--stk-border);',
            'box-shadow:0 4px 16px rgba(0,0,0,.3);',
            'transition:opacity .3s;',
            '}'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);
    })();

    // ===================== 亮暗模式强制跟随系统 =====================
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

    function loadStickerImage(img, url, fallbackName) {
        // 已有缓存直接用
        if (_blobCache[url]) {
            img.src = _blobCache[url];
            return;
        }
        // 先尝试直连
        img.src = url;
        var _triedGm = false;
        img.addEventListener('error', function () {
            if (_triedGm) return;
            _triedGm = true;
            if (typeof GM_xmlhttpRequest !== 'function') {
                // 没有 GM 权限，显示文字占位
                if (img.parentNode && fallbackName) {
                    img.parentNode.replaceChild(document.createTextNode('[表情:' + fallbackName + ']'), img);
                }
                return;
            }
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                timeout: 15000,
                onload: function (resp) {
                    if (resp.response) {
                        var blobUrl = URL.createObjectURL(resp.response);
                        _blobCache[url] = blobUrl;
                        img.src = blobUrl;
                    } else if (img.parentNode && fallbackName) {
                        img.parentNode.replaceChild(document.createTextNode('[表情:' + fallbackName + ']'), img);
                    }
                },
                onerror: function () {
                    if (img.parentNode && fallbackName) {
                        img.parentNode.replaceChild(document.createTextNode('[表情:' + fallbackName + ']'), img);
                    }
                },
                ontimeout: function () {
                    if (img.parentNode && fallbackName) {
                        img.parentNode.replaceChild(document.createTextNode('[表情:' + fallbackName + ']'), img);
                    }
                }
            });
        });
        // 直连成功的话 error 不会触发，完美
    }

    // ===================== 表情数据（localStorage） =====================
    var STICKER_KEY = 'lvStickerList';

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
        if (!list.length) { return ''; }
        var text = JSON.stringify(list);
        try { navigator.clipboard.writeText(text).then(function () { showToastMsg('表情列表已复制到剪贴板'); }); } catch (e) { prompt('复制以下内容分享给朋友:', text); }
        return text;
    }

    function importStickerList(jsonStr) {
        try {
            var incoming = JSON.parse(jsonStr);
            if (!Array.isArray(incoming)) throw new Error('格式错误');
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
            showToastMsg('导入了 ' + added + ' 个表情');
            return list;
        } catch (e) {
            showToastMsg('导入失败：格式不正确');
            return null;
        }
    }

    function showToastMsg(msg) {
        var toast = document.createElement('div');
        toast.className = 'lv-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function () { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(-8px)'; }, 1600);
        setTimeout(function () { toast.remove(); }, 2100);
    }

    // ===================== 表情选择面板 =====================
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

        // --- 表情网格 ---
        var html = '<div style="padding:10px 8px 4px;">';
        if (!list.length) {
            html += '<div style="text-align:center;color:var(--stk-label);padding:24px 8px;font-size:12px;font-family:var(--stk-font);">还没有贴纸<br><span style="font-size:10px;">点击下方「管理」添加</span></div>';
        } else {
            html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;" id="lvStickerGrid">';
            for (var i = 0; i < list.length; i++) {
                var e = list[i];
                html += '<div data-sticker-id="' + e.id + '" class="lv-sticker-item">' +
                    '<span class="lv-sticker-img-slot" data-eurl="' + escapeHtml(e.url) + '" data-ename="' + escapeHtml(e.name) + '"></span>' +
                    '<span class="lv-sticker-name">' + escapeHtml(e.name) + '</span>' +
                    '</div>';
            }
            html += '</div>';
        }
        html += '</div>';

        // --- 管理区 ---
        html += '<div class="lv-mgmt-divider">' +
            '<button id="lvStickerToggleManage" class="lv-mgmt-toggle">管理</button>' +
            '<div id="lvStickerManagePanel" class="lv-mgmt-panel" style="display:none;">' +
            '<div class="lv-mgmt-row">' +
            '<label>名称</label>' +
            '<input id="lvStickerName" type="text" placeholder="输入贴纸名称">' +
            '</div>' +
            '<div class="lv-mgmt-row">' +
            '<label>图片 URL</label>' +
            '<input id="lvStickerUrl" type="text" placeholder="https://...">' +
            '</div>' +
            '<div class="lv-mgmt-row-actions">' +
            '<button id="lvStickerAddBtn" class="lv-btn lv-btn-add" style="flex:1;">添加</button>' +
            '</div>' +
            '<div class="lv-mgmt-row-actions">' +
            '<button id="lvStickerExportBtn" class="lv-btn-outline">导出</button>' +
            '<button id="lvStickerImportBtn" class="lv-btn-outline">导入</button>' +
            '<input id="lvStickerImportInput" type="text" placeholder="粘贴 JSON" style="flex:1;height:26px;font-size:11px;display:none;background:var(--stk-input-bg);border:1px solid var(--stk-input-border);border-radius:6px;color:var(--stk-text);padding:0 8px;font-family:var(--stk-font);outline:none;">' +
            '</div>' +
            '<div id="lvStickerManageList" style="max-height:130px;overflow-y:auto;"></div>' +
            '</div>' +
            '</div>';

        pickerEl.innerHTML = html;

        // --- DOM API 创建图片，走 GM 回退 ---
        var slots = pickerEl.querySelectorAll('.lv-sticker-img-slot');
        for (var s = 0; s < slots.length; s++) {
            (function (slot) {
                var url = slot.getAttribute('data-eurl');
                var name = slot.getAttribute('data-ename') || '表情';
                var img = document.createElement('img');
                img.className = 'lv-sticker-img';
                img.alt = name;
                loadStickerImage(img, url, name);
                slot.parentNode.replaceChild(img, slot);
            })(slots[s]);
        }

        // --- 点击事件 ---
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
        if (toggleBtn && managePanel) {
            toggleBtn.onclick = function (e) {
                e.stopPropagation();
                manageVisible = !manageVisible;
                managePanel.style.display = manageVisible ? '' : 'none';
                toggleBtn.textContent = manageVisible ? '收起管理' : '管理';
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
                if (!name) { showToastMsg('请输入表情名'); return; }
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
                var text = exportStickerList();
                if (!text) { showToastMsg('表情列表为空，无法导出'); }
            };
        }

        // Import
        var importBtn = document.getElementById('lvStickerImportBtn');
        var importInput = document.getElementById('lvStickerImportInput');
        if (importBtn && importInput) {
            importBtn.onclick = function (e) {
                e.stopPropagation();
                if (importInput.style.display === 'none') {
                    importInput.style.display = '';
                    importInput.focus();
                } else {
                    var val = importInput.value.trim();
                    if (!val) { showToastMsg('请粘贴表情JSON'); return; }
                    var result = importStickerList(val);
                    if (result) { importInput.value = ''; importInput.style.display = 'none'; renderPicker(); }
                }
            };
        }

        // Render management list
        renderManageList();

        // 保持管理面板展开状态（因 renderPicker 会重建 DOM）
        if (manageVisible) {
            var mp = document.getElementById('lvStickerManagePanel');
            var tb = document.getElementById('lvStickerToggleManage');
            if (mp) mp.style.display = '';
            if (tb) tb.textContent = '收起管理';
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
        var html = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">';
        for (var i = 0; i < list.length; i++) {
            var e = list[i];
            html += '<div class="lv-mgmt-item">' +
                '<span class="lv-mgmt-img-slot" data-eurl="' + escapeHtml(e.url) + '" data-ename="' + escapeHtml(e.name) + '"></span>' +
                '<div class="lv-mgmt-name">' + escapeHtml(e.name) + '</div>' +
                '<button data-del="' + e.id + '" class="lv-mgmt-del" title="删除">×</button>' +
                '</div>';
        }
        html += '</div>';
        listEl.innerHTML = html;

        // DOM API 创建缩略图
        var slots = listEl.querySelectorAll('.lv-mgmt-img-slot');
        for (var s = 0; s < slots.length; s++) {
            (function (slot) {
                var url = slot.getAttribute('data-eurl');
                var name = slot.getAttribute('data-ename') || '表情';
                var img = document.createElement('img');
                img.className = 'lv-mgmt-thumb';
                img.alt = name;
                loadStickerImage(img, url, name);
                slot.parentNode.replaceChild(img, slot);
            })(slots[s]);
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
        try { return btoa(unescape(encodeURIComponent(str))); } catch (e) { return ''; }
    }
    function b64Decode(b64) {
        try { return decodeURIComponent(escape(atob(b64))); } catch (e) { return ''; }
    }

    function sendSticker(id) {
        var list = getStickerList();
        var sticker = null;
        for (var i = 0; i < list.length; i++) { if (list[i].id === id) { sticker = list[i]; break; } }
        if (!sticker) return;

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
        if (!input) return;

        // 格式: [E:base64(url):name]
        var encoded = b64Encode(sticker.url);
        if (!encoded) return;
        input.value = '[E:' + encoded + ':' + sticker.name + ']';
        hidePicker();
        if (typeof window.sendChat === 'function') {
            try { window.sendChat(); } catch (e) {}
        }
    }

    function showPicker(anchorEl) {
        buildPicker();
        renderPicker();
        var rect = anchorEl.getBoundingClientRect();
        var top = rect.top - 390;
        if (top < 10) top = rect.bottom + 10;
        var left = rect.left;
        if (left + 260 > window.innerWidth) left = window.innerWidth - 268;
        if (left < 8) left = 8;
        pickerEl.style.top = top + 'px';
        pickerEl.style.left = left + 'px';
        pickerEl.style.display = 'block';
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
        if (pickerEl && !pickerEl.contains(e.target)) {
            // Also check if click was on the sticker chat button
            var clickedOnBtn = false;
            var el = e.target;
            while (el) {
                if (el.id === 'lvStickerChatBtn') { clickedOnBtn = true; break; }
                el = el.parentElement;
            }
            if (!clickedOnBtn) hidePicker();
        }
    }

    // ===================== 聊天表情按钮 =====================
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
            btn.title = '表情';
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
    var STICKER_RE = /\[E:([A-Za-z0-9+\/=]+):([^\]]*)\]/g;

    function renderMsgText(el) {
        if (!el) return;
        // 已处理过且内容未变的跳过
        var text = el.textContent || '';
        if (el._lvStickerLastText === text) return;
        el._lvStickerLastText = text;
        if (text.indexOf('[E:') === -1) return;

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
            var name = m[2] || '表情';
            if (url) {
                var img = document.createElement('img');
                img.className = 'lv-chat-sticker';
                img.alt = '[表情:' + name + ']';
                img.title = name;
                img.setAttribute('data-lv-sticker-img', '1');
                loadStickerImage(img, url, name);
                frag.appendChild(img);
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
        if (frag.childNodes.length > 0) {
            el.textContent = '';
            el.appendChild(frag);
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

    // ===================== 初始化 =====================
    var _scanTimer = null;

    function init() {
        injectStickerButtons();

        // 定时轮询 + MutationObserver 双保险
        scanMessages();
        _scanTimer = setInterval(scanMessages, 600);

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
        // 每隔几秒检查新容器
        setInterval(observeContainers, 3000);

        // 聊天面板切换时重新注入按钮
        var chatBtn = document.getElementById('chatBtn');
        if (chatBtn && !chatBtn._lvStickerHooked) {
            chatBtn._lvStickerHooked = true;
            chatBtn.addEventListener('click', function () {
                setTimeout(function () {
                    injectStickerButtons();
                    observeContainers();
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
                }, 300);
            }).observe(inlineChat, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
        }

        // 持续重新注入按钮
        setInterval(injectStickerButtons, 5000);
    }

    // 等游戏 UI 加载后初始化
    function waitAndInit() {
        if (document.getElementById('inlineChatInput') || document.getElementById('chatInput') || document.getElementById('chatBtn')) {
            init();
        } else {
            setTimeout(waitAndInit, 800);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(waitAndInit, 1500); });
    } else {
        setTimeout(waitAndInit, 1500);
    }

})();