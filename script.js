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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Detect user browser language and redirect
    detectUserLanguage();
    
    // Initialize character tables
    initCharTables();
    
    // Input text listener
    inputText.addEventListener('input', updateCharCount);
    
    // Button click events
    flipBtn.addEventListener('click', () => processText('flip'));
    reverseBtn.addEventListener('click', () => processText('reverse'));
    mirrorBtn.addEventListener('click', () => processText('mirror'));
    flipReverseBtn.addEventListener('click', () => processText('flipReverse'));
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyOutput);
    copyHtmlBtn.addEventListener('click', copyHtmlOutput);
    
    // Show HTML option
    showHtmlCheck.addEventListener('change', toggleHtmlOutput);
    
    // Social share button click events
    shareWeixin.addEventListener('click', shareToWeixin);
    shareWeibo.addEventListener('click', shareToWeibo);
    shareQQ.addEventListener('click', shareToQQ);
    
    // Tab switching events
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
});

/**
 * Detect user browser language and redirect to appropriate language version
 */
function detectUserLanguage() {
    // 如果已经在进行重定向，则不再继续
    if (redirectInProgress) {
        console.log('Redirect already in progress, skipping');
        return;
    }
    
    // 检查URL中是否有noredirect参数，如果有则不进行重定向
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('noredirect')) {
        console.log('Redirect prevention parameter found, skipping redirect');
        return;
    }
    
    // 调试信息：打印完整的当前URL
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    // 检查是否有语言切换请求参数
    const langParam = urlParams.get('lang');
    if (langParam) {
        console.log('Language parameter found in URL:', langParam);
        // 设置cookie并重定向到相应语言版本（不带参数）
        setCookie('selected_language', langParam, 30);
        
        // 构建不带参数的URL
        let newUrl = window.location.pathname;
        
        // 根据选择的语言和当前路径确定重定向目标
        const currentPath = window.location.pathname;
        const isInRoot = !currentPath.includes('/zh/') && !currentPath.includes('/ja/');
        const isInZh = currentPath.includes('/zh/');
        const isInJa = currentPath.includes('/ja/');
        
        if (langParam === 'zh') {
            if (!isInZh) { // 不在中文目录
                newUrl = isInRoot ? 'zh/index.html' : '../zh/index.html';
            }
        } else if (langParam === 'ja') {
            if (!isInJa) { // 不在日语目录
                newUrl = isInRoot ? 'ja/index.html' : '../ja/index.html';
            }
        } else if (langParam === 'en') {
            if (!isInRoot) { // 不在根目录（英文）
                newUrl = '../index.html';
            }
        }
        
        // 添加noredirect参数，防止循环重定向
        newUrl += '?noredirect=1';
        
        console.log('Redirecting to (from URL param):', newUrl);
        redirectInProgress = true;
        window.location.href = newUrl;
        return;
    }
    
    // If language has been manually selected, redirect to that language
    const selectedLang = getCookie('selected_language');
    console.log('Selected language from cookie:', selectedLang);
    
    if (selectedLang) {
        // Only redirect if we're not already on the selected language page
        const currentPath = window.location.pathname;
        console.log('Current path:', currentPath);
        
        // Check if we need to redirect based on current path and selected language
        const isInRoot = !currentPath.includes('/zh/') && !currentPath.includes('/ja/');
        const isInZh = currentPath.includes('/zh/');
        const isInJa = currentPath.includes('/ja/');
        
        console.log('Path analysis:', { isInRoot, isInZh, isInJa });
        
        let shouldRedirect = false;
        let redirectPath = '';
        
        if (selectedLang === 'zh') {
            if (!isInZh) { // Not in zh directory
                shouldRedirect = true;
                redirectPath = isInRoot ? 'zh/index.html' : '../zh/index.html';
            }
        } else if (selectedLang === 'ja') {
            if (!isInJa) { // Not in ja directory
                shouldRedirect = true;
                redirectPath = isInRoot ? 'ja/index.html' : '../ja/index.html';
            }
        } else if (selectedLang === 'en') {
            if (!isInRoot) { // Not in root directory (en)
                shouldRedirect = true;
                redirectPath = '../index.html';
            }
        }
        
        if (shouldRedirect) {
            console.log('Redirecting to:', redirectPath);
            // 添加noredirect参数，防止循环重定向
            redirectPath += '?noredirect=1';
            redirectInProgress = true;
            window.location.href = redirectPath;
        } else {
            console.log('No redirect needed, already in correct language section');
        }
        
        return;
    }
    
    // 如果没有选择语言，则不进行自动重定向
    console.log('No language selection found, skipping auto-redirect');
    return;
}

/**
 * Set cookie
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Get cookie
 */
function getCookie(name) {
    console.log('Getting cookie:', name);
    console.log('All cookies:', document.cookie);
    
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
            console.log('Found cookie value:', value);
            return value;
        }
    }
    console.log('Cookie not found');
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
