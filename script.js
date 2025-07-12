/**
 * Upside Down Text Generator
 * Main features: Flip text upside down, reverse text, mirror text effects
 */

// DOM elements
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

// Social share buttons
const shareWeixin = document.getElementById('share-weixin');
const shareWeibo = document.getElementById('share-weibo');
const shareQQ = document.getElementById('share-qq');

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Character mapping table - normal characters -> upside down characters
const flipMap = {
    // Lowercase letters
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 
    'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o',
    'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    
    // Uppercase letters
    'A': 'Ɐ', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 
    'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ᒋ',
    'K': 'ꓘ', 'L': '⅂', 'M': 'ꟽ', 'N': 'N', 'O': 'O',
    'P': 'Ԁ', 'Q': 'ტ', 'R': 'ᴚ', 'S': 'S', 'T': 'Ʇ',
    'U': 'Ո', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    
    // Numbers
    '0': '0', '1': 'Ɩ', '2': 'ᘔ', '3': 'Ɛ', '4': 'ㄣ',
    '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
    
    // Punctuation
    '.': '˙', ',': '\'', '\'': ',', '"': ',,', '`': ',',
    '<': '>', '>': '<', '∨': '∧', '∧': '∨', '&': '⅋',
    '_': '‾', '?': '¿', '!': '¡', '[': ']', ']': '[',
    '(': ')', ')': '(', '{': '}', '}': '{', '\\': '/',
    '/': '\\', '‿': '⁀', '⁅': '⁆', '∴': '∵'
};

// 添加一个全局变量，用于防止循环重定向
let redirectInProgress = false;
let debugMode = true; // 开启调试模式
let manualLanguageSelected = false; // 标记用户是否手动选择了语言

// 添加调试函数
function debugLog(...args) {
    if (debugMode) {
        console.log('[DEBUG]', ...args);
    }
}

/**
 * Set cookie
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    
    // 如果设置的是语言cookie，标记为手动选择
    if (name === "selected_language") {
        manualLanguageSelected = true;
        debugLog('语言被手动选择，标记已设置');
    }
}

/**
 * 检测浏览器语言并重定向
 */
function detectBrowserLanguage() {
    // 如果用户已经手动选择过语言，不进行自动检测
    if (manualLanguageSelected) {
        debugLog('用户已手动选择语言，跳过自动检测');
        return;
    }
    
    // 检查cookie中是否已有语言选择
    const cookieLang = getCookie("selected_language");
    if (cookieLang) {
        debugLog('从cookie中检测到语言:', cookieLang);
        manualLanguageSelected = true; // 视为手动选择
        return;
    }
    
    // 检查当前URL是否有意图阻止自动重定向
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('noautodetect')) {
        debugLog('URL包含noautodetect参数，跳过自动检测');
        return;
    }
    
    // 获取浏览器语言
    let browserLang = navigator.language || navigator.userLanguage;
    browserLang = browserLang.toLowerCase();
    debugLog('检测到浏览器语言:', browserLang);
    
    // 确定使用哪种语言
    let targetLang = 'en'; // 默认英文
    if (browserLang.startsWith('zh')) {
        targetLang = 'zh';
    } else if (browserLang.startsWith('ja')) {
        targetLang = 'ja';
    }
    
    // 检查当前是否已经在正确的语言页面
    const currentPath = window.location.pathname;
    const isInZh = currentPath.includes('/zh/');
    const isInJa = currentPath.includes('/ja/');
    const isInRoot = !isInZh && !isInJa;
    
    // 如果已在正确语言页面，不需要重定向
    if ((targetLang === 'zh' && isInZh) || 
        (targetLang === 'ja' && isInJa) || 
        (targetLang === 'en' && isInRoot)) {
        debugLog('已在正确的语言页面，无需重定向');
        return;
    }
    
    // 如果需要重定向，设置cookie并执行重定向
    debugLog('基于浏览器语言自动重定向到:', targetLang);
    setCookie("selected_language", targetLang, 30);
    redirectToLanguage(targetLang);
}

/**
 * 手动切换语言（提供直接调用方法）
 */
function switchToLanguage(lang) {
    console.log('手动切换语言到:', lang);
    // 设置cookie
    setCookie("selected_language", lang, 30);
    // 标记为手动选择
    manualLanguageSelected = true;
    // 执行重定向
    redirectToLanguage(lang);
}

/**
 * 根据选择的语言重定向到相应页面
 */
function redirectToLanguage(lang) {
    console.log('开始重定向到语言:', lang);
    
    if (redirectInProgress) {
        debugLog('重定向已在进行中，跳过');
        return;
    }
    
    // 获取当前完整路径
    const currentPath = window.location.pathname;
    const queryString = window.location.search;
    const hash = window.location.hash;
    
    console.log('当前路径:', currentPath);
    console.log('查询字符串:', queryString);
    debugLog('当前路径:', currentPath);
    debugLog('查询字符串:', queryString);
    debugLog('哈希:', hash);
    
    // 构建目标URL
    let targetUrl;
    
    // 根据语言代码构建URL
    switch (lang) {
        case 'zh':
            targetUrl = '/zh/';
            break;
        case 'ja':
            targetUrl = '/ja/';
            break;
        default:
            targetUrl = '/';
            break;
    }
    
    // 保留除noautodetect外的所有现有查询参数
    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        urlParams.delete('noautodetect'); // 删除noautodetect参数
        
        const remainingParams = urlParams.toString();
        if (remainingParams) {
            targetUrl += '?' + remainingParams;
        }
    }
    
    // 添加哈希标记（如果存在）
    if (hash) {
        targetUrl += hash;
    }
    
    console.log('重定向到:', targetUrl);
    debugLog('重定向到:', targetUrl);
    
    // 设置重定向标记并执行重定向
    redirectInProgress = true;
    window.location.href = targetUrl;
}

/**
 * Get cookie
 */
function getCookie(name) {
    debugLog('获取cookie:', name);
    
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            const value = c.substring(cname.length, c.length);
            debugLog('找到cookie值:', value);
            return value;
        }
    }
    debugLog('未找到cookie');
    return "";
}

/**
 * 检查URL参数
 */
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('noautodetect')) {
        debugLog('URL包含noautodetect参数，跳过自动检测');
        return true;
    }
    return false;
}

/**
 * Update character count
 */
function updateCharCount() {
    const count = inputText.value.length;
    charCount.textContent = count;
}

/**
 * Process text transformation
 * @param {string} type - Transformation type: flip, reverse, mirror, flipReverse
 */
function processText(type) {
    const text = inputText.value;
    
    if (!text) {
        showMessage('Please enter some text first');
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
    
    // Update HTML output
    if (showHtmlCheck.checked) {
        updateHtmlOutput(result);
    }
}

/**
 * Flip text upside down
 * @param {string} text - Input text
 * @return {string} Transformed text
 */
function flipText(text) {
    return text.split('').map(char => {
        return flipMap[char] || char;
    }).join('');
}

/**
 * Reverse text order
 * @param {string} text - Input text
 * @return {string} Reversed text
 */
function reverseText(text) {
    return text.split('').reverse().join('');
}

/**
 * Create mirror text
 * @param {string} text - Input text
 * @return {string} Mirrored text
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
 * Clear all input and output
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
 * Copy transformed text to clipboard
 */
function copyOutput() {
    const text = outputText.textContent;
    if (!text) {
        showMessage('No content to copy');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('Copy failed: ', err);
        showMessage('Copy failed, please select the text manually');
    });
}

/**
 * Copy HTML Unicode format to clipboard
 */
function copyHtmlOutput() {
    const text = htmlCode.textContent;
    if (!text) {
        showMessage('No content to copy');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showMessage('HTML code copied to clipboard');
    }).catch(err => {
        console.error('Copy failed: ', err);
        showMessage('Copy failed, please select the text manually');
    });
}

/**
 * Show copy success notification
 */
function showCopySuccess() {
    copyMsg.classList.add('visible');
    setTimeout(() => {
        copyMsg.classList.remove('visible');
    }, 2000);
}

/**
 * Show message notification
 * @param {string} message - Notification message
 */
function showMessage(message) {
    // More complex message notification can be implemented here
    alert(message);
}

/**
 * Toggle HTML output display
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
 * Update HTML Unicode output
 * @param {string} text - Text to convert to HTML Unicode
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
 * Switch tabs
 * @param {string} tabId - Tab ID
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
 * Initialize character reference tables
 */
function initCharTables() {
    // Uppercase letter table
    const uppercaseTable = document.querySelector('#uppercase .char-table');
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const flippedChar = flipMap[char] || '';
        createCharTableItem(uppercaseTable, char, flippedChar);
    }
    
    // Lowercase letter table
    const lowercaseTable = document.querySelector('#lowercase .char-table');
    for (let i = 97; i <= 122; i++) {
        const char = String.fromCharCode(i);
        const flippedChar = flipMap[char] || '';
        createCharTableItem(lowercaseTable, char, flippedChar);
    }
    
    // Numbers table
    const numbersTable = document.querySelector('#numbers .char-table');
    for (let i = 48; i <= 57; i++) {
        const char = String.fromCharCode(i);
        const flippedChar = flipMap[char] || '';
        createCharTableItem(numbersTable, char, flippedChar);
    }
    
    // Symbols table
    const symbolsTable = document.querySelector('#symbols .char-table');
    const symbols = ['.', ',', '\'', '"', '`', '<', '>', '&', '_', '?', '!', '[', ']', '(', ')', '{', '}', '\\', '/', '-', '+', '=', '*'];
    
    symbols.forEach(symbol => {
        const flippedSymbol = flipMap[symbol] || symbol;
        createCharTableItem(symbolsTable, symbol, flippedSymbol);
    });
}

/**
 * Create character table item
 * @param {HTMLElement} container - Container element
 * @param {string} original - Original character
 * @param {string} flipped - Flipped character
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
    
    // Get Unicode code point and name
    const unicodeName = getCharacterName(flipped);
    nameElement.textContent = unicodeName;
    
    item.appendChild(originalElement);
    item.appendChild(flippedElement);
    item.appendChild(nameElement);
    
    container.appendChild(item);
}

/**
 * Get character's Unicode code point and name
 * @param {string} char - Character
 * @return {string} Character's Unicode information
 */
function getCharacterName(char) {
    if (!char) return '';
    
    const codePoint = char.codePointAt(0).toString(16).toUpperCase();
    return `U+${codePoint.padStart(4, '0')}`;
}

/**
 * Share to WeChat
 * @param {Event} e - Event object
 */
function shareToWeixin(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('Please generate some text before sharing');
        return;
    }
    
    // In a real project, WeChat sharing functionality or QR code generation would be implemented here
    showMessage('Please scan the QR code with WeChat to share');
}

/**
 * Share to Weibo
 * @param {Event} e - Event object
 */
function shareToWeibo(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('Please generate some text before sharing');
        return;
    }
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`I created upside down text with Upside Down Text: ${text}`);
    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
}

/**
 * Share to QQ
 * @param {Event} e - Event object
 */
function shareToQQ(e) {
    e.preventDefault();
    const text = outputText.textContent;
    if (!text) {
        showMessage('Please generate some text before sharing');
        return;
    }
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`Upside Down Text Generator`);
    const desc = encodeURIComponent(`I created upside down text with Upside Down Text: ${text}`);
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${desc}`, '_blank');
} 

/**
 * 根据下拉菜单改变语言
 */
function changeLanguage() {
    const langSelect = document.getElementById('language-select');
    const selectedPath = langSelect.value;
    
    // 记住用户选择
    let langCode = 'en';
    if (selectedPath === '/zh/') {
        langCode = 'zh';
    } else if (selectedPath === '/ja/') {
        langCode = 'ja';
    }
    
    // 设置语言cookie
    setCookie("selected_language", langCode, 30);
    manualLanguageSelected = true;
    
    // 设置重定向标记并执行重定向
    redirectInProgress = true;
    window.location.href = selectedPath;
} 

// 添加一个函数，用于清理URL中的noautodetect参数
function cleanURLParameters() {
    // 检查URL是否包含noautodetect参数
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('noautodetect')) {
        // 移除noautodetect参数
        urlParams.delete('noautodetect');
        
        // 构建新的URL
        let newURL = window.location.pathname;
        const remainingParams = urlParams.toString();
        
        if (remainingParams) {
            newURL += '?' + remainingParams;
        }
        
        // 使用History API更新URL，不刷新页面
        window.history.replaceState({}, document.title, newURL);
        debugLog('已从URL中移除noautodetect参数');
    }
}

// 初始化
window.onload = function() {
    // 首先清理URL参数
    cleanURLParameters();
    
    // 更新当前年份
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // 绑定事件处理程序
    if (inputText) {
        inputText.addEventListener('input', updateCharCount);
    }
    if (flipBtn) {
        flipBtn.addEventListener('click', () => processText('flip'));
    }
    if (reverseBtn) {
        reverseBtn.addEventListener('click', () => processText('reverse'));
    }
    if (mirrorBtn) {
        mirrorBtn.addEventListener('click', () => processText('mirror'));
    }
    if (flipReverseBtn) {
        flipReverseBtn.addEventListener('click', () => processText('flipReverse'));
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', copyOutput);
    }
    if (showHtmlCheck) {
        showHtmlCheck.addEventListener('change', toggleHtmlOutput);
    }
    if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', copyHtmlOutput);
    }
    if (shareWeixin) {
        shareWeixin.addEventListener('click', shareToWeixin);
    }
    if (shareWeibo) {
        shareWeibo.addEventListener('click', shareToWeibo);
    }
    if (shareQQ) {
        shareQQ.addEventListener('click', shareToQQ);
    }
    
    // 初始化字符表
    initCharTables();
    
    // 绑定选项卡切换事件
    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
    }
    
    // 注意：我们不再调用自动检测语言函数
    // if (!checkUrlParams()) {
    //     detectBrowserLanguage();
    // }
}; 
