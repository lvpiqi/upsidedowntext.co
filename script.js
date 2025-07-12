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
let manualLanguageSelected = false; // 添加一个标志，表示用户是否手动选择了语言

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
    
    // 如果设置的是语言cookie，则标记为手动选择
    if (name === "selected_language") {
        manualLanguageSelected = true;
        debugLog('Manual language selection flag set to true');
    }
}

/**
 * 根据选择的语言重定向到相应页面
 */
function redirectToLanguage(lang) {
    if (redirectInProgress) {
        debugLog('Redirect already in progress, skipping');
        return;
    }
    
    // 确保设置了手动选择标志
    manualLanguageSelected = true;
    debugLog('Manual language selection flag set in redirectToLanguage');
    
    const currentPath = window.location.pathname;
    const isInRoot = !currentPath.includes('/zh/') && !currentPath.includes('/ja/');
    
    // 获取当前页面的文件名（如果没有则默认为index.html）
    let currentFile = 'index.html';
    const pathParts = currentPath.split('/');
    if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart.includes('.html')) {
            currentFile = lastPart;
        }
    }
    
    debugLog('Current file detected:', currentFile);
    
    let redirectPath = '';
    
    if (lang === 'zh') {
        redirectPath = isInRoot ? 'zh/' + currentFile : '../zh/' + currentFile;
    } else if (lang === 'ja') {
        redirectPath = isInRoot ? 'ja/' + currentFile : '../ja/' + currentFile;
    } else if (lang === 'en') {
        redirectPath = isInRoot ? currentFile : '../' + currentFile;
    }
    
    // 检查文件是否存在，如果不存在则使用index.html
    // 由于无法直接检查文件是否存在，这里我们假设所有语言版本都有相同的文件结构
    
    if (redirectPath) {
        debugLog('Redirecting to:', redirectPath);
        redirectPath += '?noredirect=1';
        redirectInProgress = true;
        window.location.href = redirectPath;
    }
}

/**
 * Get cookie
 */
function getCookie(name) {
    debugLog('Getting cookie:', name);
    debugLog('All cookies:', document.cookie);
    
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
            debugLog('Found cookie value:', value);
            return value;
        }
    }
    debugLog('Cookie not found');
    return "";
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
