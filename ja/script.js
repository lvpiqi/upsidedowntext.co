/**
 * Upside Down Text - 文字反転ツール
 * 主な機能：文字の上下反転、文字の反転、ミラー文字効果
 */

// DOM要素
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const charCount = document.getElementById('char-count');
const flipBtn = document.getElementById('flip-btn');
const reverseBtn = document.getElementById('reverse-btn');
const mirrorBtn = document.getElementById('mirror-btn');
const flipReverseBtn = document.getElementById('flip-reverse-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const copyMsg = document.getElementById('copy-msg');
const showHtmlCheck = document.getElementById('show-html');
const htmlOutput = document.getElementById('html-output');
const htmlCode = document.getElementById('html-code');
const copyHtmlBtn = document.getElementById('copy-html-btn');

// ソーシャルシェアボタン
const shareWeixin = document.getElementById('share-weixin');
const shareWeibo = document.getElementById('share-weibo');
const shareQQ = document.getElementById('share-qq');

// タブ切り替え
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// 文字マッピングテーブル - 通常文字 -> 上下反転文字
const flipMap = {
    // 小文字
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 
    'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o',
    'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    
    // 大文字
    'A': 'Ɐ', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 
    'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ᒋ',
    'K': 'ꓘ', 'L': '⅂', 'M': 'ꟽ', 'N': 'N', 'O': 'O',
    'P': 'Ԁ', 'Q': 'ტ', 'R': 'ᴚ', 'S': 'S', 'T': 'Ʇ',
    'U': 'Ո', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    
    // 数字
    '0': '0', '1': 'Ɩ', '2': 'ᘔ', '3': 'Ɛ', '4': 'ㄣ',
    '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
    
    // 句読点
    '.': '˙', ',': '\'', '\'': ',', '"': ',,', '`': ',',
    '<': '>', '>': '<', '∨': '∧', '∧': '∨', '&': '⅋',
    '_': '‾', '?': '¿', '!': '¡', '[': ']', ']': '[',
    '(': ')', ')': '(', '{': '}', '}': '{', '\\': '/',
    '/': '\\', '‿': '⁀', '⁅': '⁆', '∴': '∵'
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // 現在の年を設定
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // ユーザーのブラウザ言語を検出して自動的にリダイレクト
    detectUserLanguage();
    
    // 文字テーブルを初期化
    initCharTables();
    
    // テキスト入力リスナー
    inputText.addEventListener('input', updateCharCount);
    
    // ボタンクリックイベント
    flipBtn.addEventListener('click', () => processText('flip'));
    reverseBtn.addEventListener('click', () => processText('reverse'));
    mirrorBtn.addEventListener('click', () => processText('mirror'));
    flipReverseBtn.addEventListener('click', () => processText('flipReverse'));
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyOutput);
    copyHtmlBtn.addEventListener('click', copyHtmlOutput);
    
    // HTML表示オプション
    showHtmlCheck.addEventListener('change', toggleHtmlOutput);
    
    // ソーシャルシェアボタンクリックイベント
    shareWeixin.addEventListener('click', shareToWeixin);
    shareWeibo.addEventListener('click', shareToWeibo);
    shareQQ.addEventListener('click', shareToQQ);
    
    // タブ切り替えイベント
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
});

/**
 * ユーザーのブラウザ言語を検出して自動的に適切な言語版にリダイレクト
 */
function detectUserLanguage() {
    // すでに言語が手動で選択されている場合（cookieが存在する場合）、自動リダイレクトしない
    if (getCookie('language_selected')) {
        return;
    }
    
    // ブラウザの言語を取得
    const userLang = navigator.language || navigator.userLanguage;
    
    // 現在のページのURLパス
    const currentPath = window.location.pathname;
    
    // 現在の言語ディレクトリにいない場合、ブラウザの言語に基づいて自動的にリダイレクト
    if (currentPath.includes('/ja/')) {
        // すでに日本語版にいる場合は何もしない
    } else {
        // 中国語版にリダイレクト（デフォルト）
        if (userLang.startsWith('zh')) {
            window.location.href = '../index.html';
        }
        // 将来的に他の言語サポートを追加可能
        // else if (userLang.startsWith('en')) {
        //     window.location.href = '../en/index.html';
        // }
    }
    
    // 言語が選択されたことを示すcookieを設定し、繰り返しリダイレクトを避ける
    setCookie('language_selected', 'true', 30); // 30日間有効
}

/**
 * Cookieを設定
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Cookieを取得
 */
function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

/**
 * 文字カウントを更新
 */
function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = count;
}

/**
 * テキスト変換を処理
 * @param {string} type - 変換タイプ: flip, reverse, mirror, flipReverse
 */
function processText(type) {
    const text = inputText.value;
    
    if (!text) {
        showMessage('テキストを入力してください');
        return;
    }
    
    let result = '';
    
    switch(type) {
        case 'flip':
            result = flipText(text);
            break;
        case 'reverse':
            result = reverseText(text);
            break;
        case 'mirror':
            result = mirrorText(text);
            break;
        case 'flipReverse':
            result = flipText(reverseText(text));
            break;
        default:
            result = text;
    }
    
    outputText.textContent = result;
    outputText.classList.add('pulse');
    setTimeout(() => {
        outputText.classList.remove('pulse');
    }, 500);
    
    // HTML出力を更新
    if (showHtmlCheck.checked) {
        updateHtmlOutput(result);
    }
}

/**
 * 文字を上下反転
 * @param {string} text - 入力テキスト
 * @return {string} 変換後のテキスト
 */
function flipText(text) {
    return text.split('').map(char => {
        return flipMap[char] || char;
    }).join('');
}

/**
 * 文字を反転配置
 * @param {string} text - 入力テキスト
 * @return {string} 反転配置されたテキスト
 */
function reverseText(text) {
    return text.split('').reverse().join('');
}

/**
 * ミラー文字を作成
 * @param {string} text - 入力テキスト
 * @return {string} ミラー効果のテキスト
 */
function mirrorText(text) {
    const mirrorChars = {
        'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ',
        'f': 'ꟻ', 'g': 'ǫ', 'h': 'ʜ', 'i': 'i', 'j': 'ꞁ',
        'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o',
        'p': 'q', 'q': 'p', 'r': 'ɿ', 's': 'ꙅ', 't': 'ƚ',
        'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
        'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E',
        'F': 'F', 'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J',
        'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O',
        'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T',
        'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z',
        '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
        '<': '>', '>': '<', '/': '\\', '\\': '/'
    };
    
    return reverseText(text.split('').map(char => {
        return mirrorChars[char] || char;
    }).join(''));
}

/**
 * すべての入力と出力をクリア
 */
function clearAll() {
    inputText.value = '';
    outputText.textContent = '';
    charCount.textContent = '0';
    if (showHtmlCheck.checked) {
        htmlCode.textContent = '';
    }
}

/**
 * 出力をクリップボードにコピー
 */
function copyOutput() {
    const text = outputText.textContent;
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('クリップボードへのコピーに失敗しました: ', err);
    });
}

/**
 * HTML出力をクリップボードにコピー
 */
function copyHtmlOutput() {
    const text = htmlCode.textContent;
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('クリップボードへのコピーに失敗しました: ', err);
    });
}

/**
 * コピー成功メッセージを表示
 */
function showCopySuccess() {
    copyMsg.classList.add('visible');
    setTimeout(() => {
        copyMsg.classList.remove('visible');
    }, 2000);
}

/**
 * メッセージを表示
 */
function showMessage(message) {
    alert(message);
}

/**
 * HTML出力の表示/非表示を切り替え
 */
function toggleHtmlOutput() {
    if (showHtmlCheck.checked) {
        htmlOutput.classList.remove('hidden');
        updateHtmlOutput(outputText.textContent);
    } else {
        htmlOutput.classList.add('hidden');
    }
}

/**
 * HTML出力を更新
 */
function updateHtmlOutput(text) {
    if (!text) {
        htmlCode.textContent = '';
        return;
    }
    
    let htmlText = '';
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        const code = text.charCodeAt(i);
        if (code > 127) {
            htmlText += `&#${code};`;
        } else {
            htmlText += char;
        }
    }
    
    htmlCode.textContent = htmlText;
}

/**
 * タブを切り替え
 */
function switchTab(tabId) {
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

/**
 * 文字テーブルを初期化
 */
function initCharTables() {
    const uppercaseContainer = document.querySelector('#uppercase .char-table');
    const lowercaseContainer = document.querySelector('#lowercase .char-table');
    const numbersContainer = document.querySelector('#numbers .char-table');
    const symbolsContainer = document.querySelector('#symbols .char-table');
    
    // 大文字
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const flipped = flipMap[char] || char;
        createCharTableItem(uppercaseContainer, char, flipped);
    }
    
    // 小文字
    for (let i = 97; i <= 122; i++) {
        const char = String.fromCharCode(i);
        const flipped = flipMap[char] || char;
        createCharTableItem(lowercaseContainer, char, flipped);
    }
    
    // 数字
    for (let i = 48; i <= 57; i++) {
        const char = String.fromCharCode(i);
        const flipped = flipMap[char] || char;
        createCharTableItem(numbersContainer, char, flipped);
    }
    
    // 記号
    const symbols = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~';
    for (let i = 0; i < symbols.length; i++) {
        const char = symbols.charAt(i);
        const flipped = flipMap[char] || char;
        createCharTableItem(symbolsContainer, char, flipped);
    }
}

/**
 * 文字テーブル項目を作成
 */
function createCharTableItem(container, original, flipped) {
    const item = document.createElement('div');
    item.className = 'char-item';
    
    const originalSpan = document.createElement('span');
    originalSpan.className = 'char-original';
    originalSpan.textContent = original;
    
    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'char-arrow';
    arrowSpan.innerHTML = '&darr;';
    
    const flippedSpan = document.createElement('span');
    flippedSpan.className = 'char-flipped';
    flippedSpan.textContent = flipped;
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'char-name';
    nameSpan.textContent = getCharacterName(original);
    
    item.appendChild(originalSpan);
    item.appendChild(arrowSpan);
    item.appendChild(flippedSpan);
    item.appendChild(nameSpan);
    
    container.appendChild(item);
}

/**
 * 文字の名前を取得
 */
function getCharacterName(char) {
    if (/[A-Z]/.test(char)) return '大文字' + char;
    if (/[a-z]/.test(char)) return '小文字' + char;
    if (/[0-9]/.test(char)) return '数字' + char;
    return '記号';
}

/**
 * WeChatで共有
 */
function shareToWeixin(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('共有するテキストがありません');
        return;
    }
    alert('WeChatで共有: QRコードをスキャンしてください（実際の実装ではQRコードが表示されます）');
}

/**
 * Weiboで共有
 */
function shareToWeibo(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('共有するテキストがありません');
        return;
    }
    const url = 'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(text);
    window.open(url, '_blank');
}

/**
 * QQで共有
 */
function shareToQQ(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('共有するテキストがありません');
        return;
    }
    const url = 'https://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent('Upside Down Text') + '&desc=' + encodeURIComponent(text);
    window.open(url, '_blank');
} 