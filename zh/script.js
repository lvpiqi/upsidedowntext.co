/**
 * Upside Down Text - 文字翻转工具
 * 主要功能：文字上下颠倒、文字反向、镜像文字效果
 */

// DOM元素
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

// 社交分享按钮
const shareWeixin = document.getElementById('share-weixin');
const shareWeibo = document.getElementById('share-weibo');
const shareQQ = document.getElementById('share-qq');

// 标签页切换
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// 字符映射表 - 正常字符 -> 上下颠倒字符
const flipMap = {
    // 小写字母
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 
    'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o',
    'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    
    // 大写字母
    'A': 'Ɐ', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 
    'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ᒋ',
    'K': 'ꓘ', 'L': '⅂', 'M': 'ꟽ', 'N': 'N', 'O': 'O',
    'P': 'Ԁ', 'Q': 'ტ', 'R': 'ᴚ', 'S': 'S', 'T': 'Ʇ',
    'U': 'Ո', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    
    // 数字
    '0': '0', '1': 'Ɩ', '2': 'ᘔ', '3': 'Ɛ', '4': 'ㄣ',
    '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
    
    // 标点符号
    '.': '˙', ',': '\'', '\'': ',', '"': ',,', '`': ',',
    '<': '>', '>': '<', '∨': '∧', '∧': '∨', '&': '⅋',
    '_': '‾', '?': '¿', '!': '¡', '[': ']', ']': '[',
    '(': ')', ')': '(', '{': '}', '}': '{', '\\': '/',
    '/': '\\', '‿': '⁀', '⁅': '⁆', '∴': '∵'
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置当前年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 检测用户浏览器语言并自动跳转
    detectUserLanguage();
    
    // 初始化字符表
    initCharTables();
    
    // 输入文本监听
    inputText.addEventListener('input', updateCharCount);
    
    // 按钮点击事件
    flipBtn.addEventListener('click', () => processText('flip'));
    reverseBtn.addEventListener('click', () => processText('reverse'));
    mirrorBtn.addEventListener('click', () => processText('mirror'));
    flipReverseBtn.addEventListener('click', () => processText('flipReverse'));
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyOutput);
    copyHtmlBtn.addEventListener('click', copyHtmlOutput);
    
    // 显示HTML选项
    showHtmlCheck.addEventListener('change', toggleHtmlOutput);
    
    // 社交分享按钮点击事件
    shareWeixin.addEventListener('click', shareToWeixin);
    shareWeibo.addEventListener('click', shareToWeibo);
    shareQQ.addEventListener('click', shareToQQ);
    
    // 标签页切换事件
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
});

/**
 * 检测用户浏览器语言并自动跳转到相应语言版本
 */
function detectUserLanguage() {
    // 如果已经手动选择了语言（存在cookie），则不自动跳转
    if (getCookie('language_selected')) {
        return;
    }
    
    // 获取浏览器语言
    const userLang = navigator.language || navigator.userLanguage;
    
    // 当前页面URL路径
    const currentPath = window.location.pathname;
    
    // 如果当前在中文子目录中
    if (currentPath.includes('/zh/')) {
        // 已经在中文版，不做任何跳转
    } else {
        // 如果浏览器语言是日语，跳转到日语版
        if (userLang.startsWith('ja')) {
            window.location.href = '../ja/index.html';
        }
        // 未来可以添加更多语言支持
        // else if (userLang.startsWith('en')) {
        //     window.location.href = '../en/index.html';
        // }
    }
    
    // 设置cookie标记已选择语言，避免重复跳转
    setCookie('language_selected', 'true', 30); // 30天有效期
}

/**
 * 设置cookie
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * 获取cookie
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
 * 更新字符计数
 */
function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = count;
}

/**
 * 处理文本转换
 * @param {string} type - 转换类型: flip, reverse, mirror, flipReverse
 */
function processText(type) {
    const text = inputText.value;
    
    if (!text) {
        showMessage('请先输入文字');
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
    
    // 更新HTML输出
    if (showHtmlCheck.checked) {
        updateHtmlOutput(result);
    }
}

/**
 * 文字上下颠倒转换
 * @param {string} text - 输入文本
 * @return {string} 转换后的文本
 */
function flipText(text) {
    return text.split('').map(char => {
        return flipMap[char] || char;
    }).join('');
}

/**
 * 文字反向排列
 * @param {string} text - 输入文本
 * @return {string} 反向排列的文本
 */
function reverseText(text) {
    return text.split('').reverse().join('');
}

/**
 * 创建镜像文字
 * @param {string} text - 输入文本
 * @return {string} 镜像效果的文本
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
 * 清空所有输入和输出
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
 * 复制转换后的文本到剪贴板
 */
function copyOutput() {
    const text = outputText.textContent;
    if (!text) {
        showMessage('没有可复制的内容');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('复制失败: ', err);
        showMessage('复制失败，请手动选择文本复制');
    });
}

/**
 * 复制HTML Unicode格式到剪贴板
 */
function copyHtmlOutput() {
    const text = htmlCode.textContent;
    if (!text) {
        showMessage('没有可复制的内容');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showMessage('HTML代码已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败: ', err);
        showMessage('复制失败，请手动选择文本复制');
    });
}

/**
 * 显示复制成功提示
 */
function showCopySuccess() {
    copyMsg.classList.add('visible');
    setTimeout(() => {
        copyMsg.classList.remove('visible');
    }, 2000);
}

/**
 * 显示消息提示
 * @param {string} message - 提示消息
 */
function showMessage(message) {
    // 可以在此处实现更复杂的消息提示功能
    alert(message);
}

/**
 * 切换HTML输出显示状态
 */
function toggleHtmlOutput() {
    if (showHtmlCheck.checked) {
        htmlOutput.classList.remove('hidden');
        const outputContent = outputText.textContent;
        if (outputContent) {
            updateHtmlOutput(outputContent);
        }
    } else {
        htmlOutput.classList.add('hidden');
    }
}

/**
 * 更新HTML Unicode输出
 * @param {string} text - 要转换为HTML Unicode的文本
 */
function updateHtmlOutput(text) {
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
 * 切换标签页
 * @param {string} tabId - 标签页ID
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
 * 初始化字符对照表
 */
function initCharTables() {
    // 大写字母表
    const uppercaseTable = document.querySelector('#uppercase .char-table');
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const flippedChar = flipMap[char] || '';
        createCharTableItem(uppercaseTable, char, flippedChar);
    }
    
    // 小写字母表
    const lowercaseTable = document.querySelector('#lowercase .char-table');
    for (let i = 97; i <= 122; i++) {
        const char = String.fromCharCode(i);
        const flippedChar = flipMap[char] || '';
        createCharTableItem(lowercaseTable, char, flippedChar);
    }
    
    // 数字表
    const numbersTable = document.querySelector('#numbers .char-table');
    for (let i = 48; i <= 57; i++) {
        const char = String.fromCharCode(i);
        const flippedChar = flipMap[char] || '';
        createCharTableItem(numbersTable, char, flippedChar);
    }
    
    // 符号表
    const symbolsTable = document.querySelector('#symbols .char-table');
    const symbols = ['.', ',', '\'', '"', '`', '<', '>', '&', '_', '?', '!', '[', ']', '(', ')', '{', '}', '\\', '/', '-', '+', '=', '*'];
    
    symbols.forEach(symbol => {
        const flippedSymbol = flipMap[symbol] || symbol;
        createCharTableItem(symbolsTable, symbol, flippedSymbol);
    });
}

/**
 * 创建字符表项
 * @param {HTMLElement} container - 容器元素
 * @param {string} original - 原始字符
 * @param {string} flipped - 颠倒字符
 */
function createCharTableItem(container, original, flipped) {
    const item = document.createElement('div');
    item.className = 'char-item';
    
    const originalElement = document.createElement('div');
    originalElement.className = 'char-original';
    originalElement.textContent = original;
    
    const flippedElement = document.createElement('div');
    flippedElement.className = 'char-flipped';
    flippedElement.textContent = flipped;
    
    const nameElement = document.createElement('div');
    nameElement.className = 'char-name';
    
    // 获取Unicode代码点和名称
    const unicodeName = getCharacterName(flipped);
    nameElement.textContent = unicodeName;
    
    item.appendChild(originalElement);
    item.appendChild(flippedElement);
    item.appendChild(nameElement);
    
    container.appendChild(item);
}

/**
 * 获取字符的Unicode代码点和名称
 * @param {string} char - 字符
 * @return {string} 字符的Unicode信息
 */
function getCharacterName(char) {
    if (!char) return '';
    
    const codePoint = char.codePointAt(0).toString(16).toUpperCase();
    return `U+${codePoint.padStart(4, '0')}`;
}

/**
 * 分享到微信
 * @param {Event} e - 事件对象
 */
function shareToWeixin(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('请先生成文字再分享');
        return;
    }
    
    // 在实际项目中，这里可以实现微信分享功能或二维码生成
    showMessage('请使用微信扫描二维码分享');
}

/**
 * 分享到微博
 * @param {Event} e - 事件对象
 */
function shareToWeibo(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('请先生成文字再分享');
        return;
    }
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`我用Upside Down Text制作了颠倒文字：${text}`);
    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
}

/**
 * 分享到QQ
 * @param {Event} e - 事件对象
 */
function shareToQQ(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('请先生成文字再分享');
        return;
    }
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`上下颠倒文字转换器`);
    const desc = encodeURIComponent(`我用Upside Down Text制作了颠倒文字：${text}`);
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${desc}`, '_blank');
} 