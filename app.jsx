
   // Toast notification component
        function Toast({ message, type, onClose }) {
            const [isVisible, setIsVisible] = React.useState(true);
            
            React.useEffect(() => {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300); // Wait for animation to complete
                }, 3000);
                
                return () => clearTimeout(timer);
            }, [onClose]);
            
            const typeStyles = {
                success: 'bg-green-500 text-white',
                error: 'bg-red-500 text-white',
                info: 'bg-blue-500 text-white',
                warning: 'bg-yellow-500 text-black'
            };
            
            return (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${typeStyles[type]} ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
                    <div className="flex items-center justify-between">
                        <span>{message}</span>
                        <button onClick={() => setIsVisible(false)} className="ml-2 text-lg">×</button>
                    </div>
                </div>
            );
        }

        // Modal component
        function Modal({ isOpen, onClose, title, children }) {
            if (!isOpen) return null;
            
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            );
        }

        // Loading spinner component
        function LoadingSpinner({ isLoading, message }) {
            if (!isLoading) return null;
            
            return (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center space-x-3 fade-in">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="dark:text-white">{message}</span>
                    </div>
                </div>
            );
        }

        // Sidebar component
        function Sidebar({ activeCategory, setActiveCategory, categories, isCollapsed, setIsCollapsed, darkMode }) {
            return (
                <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 slide-in`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            {!isCollapsed && <h2 className="text-lg font-semibold dark:text-white">Categories</h2>}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} ${darkMode ? 'text-white' : 'text-gray-600'}`}></i>
                            </button>
                        </div>
                    </div>
                    <nav className="p-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                                    activeCategory === category.id
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                                title={category.name}
                            >
                                <i className={category.icon}></i>
                                {!isCollapsed && <span>{category.name}</span>}
                            </button>
                        ))}
                    </nav>
                </div>
            );
        }

        // Tab component
        function TabBar({ tabs, activeTab, setActiveTab, onNewTab, onCloseTab }) {
            return (
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 overflow-x-auto">
                    {tabs.map(tab => (
                        <div key={tab.id} className={`flex items-center px-4 py-2 border-r border-gray-200 dark:border-gray-600 ${activeTab === tab.id ? 'bg-white dark:bg-gray-800' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className="text-sm font-medium dark:text-white mr-2"
                            >
                                {tab.name}
                            </button>
                            {tabs.length > 1 && (
                                <button
                                    onClick={() => onCloseTab(tab.id)}
                                    className="text-gray-400 hover:text-red-500 text-xs"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={onNewTab}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="New Tab"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            );
        }

        // Main App component
        function App() {
            // Theme state
            const [darkMode, setDarkMode] = React.useState(() => {
                const saved = localStorage.getItem('darkMode');
                return saved ? JSON.parse(saved) : false;
            });

            // UI state
            const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
            const [activeCategory, setActiveCategory] = React.useState('formatting');
            const [toasts, setToasts] = React.useState([]);
            const [isLoading, setIsLoading] = React.useState(false);
            const [loadingMessage, setLoadingMessage] = React.useState('');

            // Modal state
            const [showFindReplaceModal, setShowFindReplaceModal] = React.useState(false);
            const [findText, setFindText] = React.useState('');
            const [replaceText, setReplaceText] = React.useState('');
            
            // Find/Replace options
            const [useRegex, setUseRegex] = React.useState(false);
            const [caseSensitive, setCaseSensitive] = React.useState(false);
            const [wholeWord, setWholeWord] = React.useState(false);
            const [currentMatchIndex, setCurrentMatchIndex] = React.useState(-1);
            const [totalMatches, setTotalMatches] = React.useState(0);
            const [highlightedText, setHighlightedText] = React.useState('');

            // Tab management
            const [tabs, setTabs] = React.useState([{
                id: 1,
                name: 'Document 1',
                text: '',
                history: [''],
                historyIndex: 0
            }]);
            const [activeTab, setActiveTab] = React.useState(1);

            // Get current tab data
            const currentTab = tabs.find(tab => tab.id === activeTab);
            const text = currentTab?.text || '';
            const history = currentTab?.history || [''];
            const historyIndex = currentTab?.historyIndex || 0;

            // Other states
            const [isUndoRedo, setIsUndoRedo] = React.useState(false);
            const [searchWord, setSearchWord] = React.useState('');
            const [wordOccurrences, setWordOccurrences] = React.useState(0);


            // Categories definition
            const categories = [
                { id: 'formatting', name: 'Text Formatting', icon: 'fas fa-font' },
                { id: 'lines', name: 'Line Operations', icon: 'fas fa-list' },
                { id: 'encoding', name: 'Encoding/Decoding', icon: 'fas fa-code' },
                { id: 'utilities', name: 'Utilities', icon: 'fas fa-tools' },
                { id: 'export', name: 'Export', icon: 'fas fa-download' },
                { id: 'analysis', name: 'Analysis', icon: 'fas fa-chart-bar' }
            ];

            // Apply dark mode to document
            React.useEffect(() => {
                if (darkMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                localStorage.setItem('darkMode', JSON.stringify(darkMode));
            }, [darkMode]);

            // Calculate stats and word occurrences
            React.useEffect(() => {
                if (searchWord.trim()) {
                    countWordOccurrences(text, searchWord);
                } else {
                    setWordOccurrences(0);
                }

                // Handle history for undo/redo
                if (!isUndoRedo && currentTab) {
                    const newHistory = history.slice(0, historyIndex + 1);
                    updateTab(activeTab, {
                        ...currentTab,
                        text,
                        history: [...newHistory, text],
                        historyIndex: newHistory.length
                    });
                }
                setIsUndoRedo(false);
            }, [text, searchWord]);

            // Helper functions
            const updateTab = (tabId, updatedTab) => {
                setTabs(prev => prev.map(tab => tab.id === tabId ? updatedTab : tab));
            };

            const setText = (newText) => {
                if (currentTab) {
                    updateTab(activeTab, { ...currentTab, text: newText });
                }
            };

            const showToast = (message, type = 'info') => {
                const id = Date.now();
                const newToast = { id, message, type };
                setToasts(prev => [...prev, newToast]);
            };

            const removeToast = (id) => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            };

            const showLoadingFor = async (operation, message) => {
                setIsLoading(true);
                setLoadingMessage(message);
                
                try {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Minimum loading time
                    await operation();
                } finally {
                    setIsLoading(false);
                }
            };

            // Tab management functions
            const addNewTab = () => {
                const newId = Math.max(...tabs.map(t => t.id)) + 1;
                const newTab = {
                    id: newId,
                    name: `Document ${newId}`,
                    text: '',
                    history: [''],
                    historyIndex: 0
                };
                setTabs(prev => [...prev, newTab]);
                setActiveTab(newId);
            };

            const closeTab = (tabId) => {
                if (tabs.length === 1) return;
                
                setTabs(prev => {
                    const filtered = prev.filter(tab => tab.id !== tabId);
                    if (activeTab === tabId) {
                        setActiveTab(filtered[0]?.id || filtered[filtered.length - 1]?.id);
                    }
                    return filtered;
                });
            };

            // Text manipulation functions
            const countWordOccurrences = (currentText, wordToSearch) => {
                if (!currentText.trim() || !wordToSearch.trim()) {
                    setWordOccurrences(0);
                    return;
                }
                const regex = new RegExp(wordToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                const matches = currentText.match(regex);
                setWordOccurrences(matches ? matches.length : 0);
            };

            const undo = () => {
                if (historyIndex > 0) {
                    setIsUndoRedo(true);
                    const newIndex = historyIndex - 1;
                    updateTab(activeTab, {
                        ...currentTab,
                        text: history[newIndex],
                        historyIndex: newIndex
                    });
                    showToast('Undo successful!', 'success');
                } else {
                    showToast('Nothing to undo.', 'warning');
                }
            };

            const redo = () => {
                if (historyIndex < history.length - 1) {
                    setIsUndoRedo(true);
                    const newIndex = historyIndex + 1;
                    updateTab(activeTab, {
                        ...currentTab,
                        text: history[newIndex],
                        historyIndex: newIndex
                    });
                    showToast('Redo successful!', 'success');
                } else {
                    showToast('Nothing to redo.', 'warning');
                }
            };

            // Text formatting functions
            const toUppercase = () => {
                if (!text.trim()) {
                    showToast('No text to convert to uppercase.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    setText(text.toUpperCase());
                    showToast('Text converted to uppercase!', 'success');
                }, 'Converting to uppercase...');
            };

            const toLowercase = () => {
                if (!text.trim()) {
                    showToast('No text to convert to lowercase.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    setText(text.toLowerCase());
                    showToast('Text converted to lowercase!', 'success');
                }, 'Converting to lowercase...');
            };

            const toTitleCase = () => {
                if (!text.trim()) {
                    showToast('No text to convert to Title Case.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    const titleCaseText = text.split(' ').map(word => {
                        if (word.length === 0) return '';
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }).join(' ');
                    setText(titleCaseText);
                    showToast('Text converted to Title Case!', 'success');
                }, 'Converting to title case...');
            };

            const swapCase = () => {
                if (!text.trim()) {
                    showToast('No text to swap case.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    const swappedText = text.split('').map(char => {
                        if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                            return char.toLowerCase();
                        } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
                            return char.toUpperCase();
                        }
                        return char;
                    }).join('');
                    setText(swappedText);
                    showToast('Case swapped!', 'success');
                }, 'Swapping case...');
            };

            const capitalizeSentences = () => {
                if (!text.trim()) {
                    showToast('No text to capitalize sentences.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    const sentences = text.split(/([.!?]+\s*)/);
                    let result = [];
                    for (let i = 0; i < sentences.length; i++) {
                        let sentencePart = sentences[i];
                        if (sentencePart.trim().length > 0 && i % 2 === 0) {
                            let trimmedSentence = sentencePart.trim();
                            if (trimmedSentence.length > 0) {
                                result.push(trimmedSentence.charAt(0).toUpperCase() + trimmedSentence.slice(1));
                            }
                        } else {
                            result.push(sentencePart);
                        }
                    }
                    setText(result.join(''));
                    showToast('First letter of each sentence capitalized!', 'success');
                }, 'Capitalizing sentences...');
            };

            const trimWhitespace = () => {
                if (!text.trim()) {
                    showToast('No text to trim.', 'warning');
                    return;
                }
                setText(text.trim());
                showToast('Whitespace trimmed!', 'success');
            };

            const removeExtraSpaces = () => {
                if (!text.trim()) {
                    showToast('No text to process for extra spaces.', 'warning');
                    return;
                }
                setText(text.replace(/\s+/g, ' ').trim());
                showToast('Extra spaces removed!', 'success');
            };

            const reverseText = () => {
                if (!text.trim()) {
                    showToast('No text to reverse.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    setText(text.split('').reverse().join(''));
                    showToast('Text reversed!', 'success');
                }, 'Reversing text...');
            };

            // Line operations
            const removeDuplicateLines = () => {
                if (!text.trim()) {
                    showToast('No text to remove duplicate lines from.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    const lines = text.split('\n');
                    const uniqueLines = [];
                    const seen = new Set();
                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!seen.has(trimmedLine)) {
                            uniqueLines.push(line);
                            seen.add(trimmedLine);
                        }
                    }
                    setText(uniqueLines.join('\n'));
                    showToast('Duplicate lines removed!', 'success');
                }, 'Removing duplicate lines...');
            };

            const removeEmptyLines = () => {
                if (!text.trim()) {
                    showToast('No text to remove empty lines from.', 'warning');
                    return;
                }
                const lines = text.split('\n');
                const filteredLines = lines.filter(line => line.trim() !== '');
                setText(filteredLines.join('\n'));
                showToast('Empty lines removed!', 'success');
            };

            const addLineNumbers = () => {
                if (!text.trim()) {
                    showToast('No text to add line numbers to.', 'warning');
                    return;
                }
                const lines = text.split('\n');
                const numberedLines = lines.map((line, index) => `${index + 1}. ${line}`);
                setText(numberedLines.join('\n'));
                showToast('Line numbers added!', 'success');
            };

            const sortLinesAlphabetically = () => {
                if (!text.trim()) {
                    showToast('No text to sort.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    const lines = text.split('\n');
                    const sortedLines = lines.sort((a, b) => a.localeCompare(b));
                    setText(sortedLines.join('\n'));
                    showToast('Lines sorted alphabetically!', 'success');
                }, 'Sorting lines...');
            };

            const toBulletList = () => {
                if (!text.trim()) {
                    showToast('No text to convert to list.', 'warning');
                    return;
                }
                const sentences = text.split(/\n|(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s !== '');
                if (sentences.length === 0) return;
                
                const bulletList = sentences.map(sentence => `• ${sentence}`).join('\n');
                setText(bulletList);
                showToast('Text converted to bullet list!', 'success');
            };

            const toNumberedList = () => {
                if (!text.trim()) {
                    showToast('No text to convert to list.', 'warning');
                    return;
                }
                const sentences = text.split(/\n|(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s !== '');
                if (sentences.length === 0) return;
                
                const numberedList = sentences.map((sentence, index) => `${index + 1}. ${sentence}`).join('\n');
                setText(numberedList);
                showToast('Text converted to numbered list!', 'success');
            };

            // Encoding/Decoding functions
            const encodeBase64 = () => {
                if (!text.trim()) {
                    showToast('No text to encode.', 'warning');
                    return;
                }
                try {
                    const encodedText = btoa(text);
                    setText(encodedText);
                    showToast('Text encoded to Base64!', 'success');
                } catch (e) {
                    showToast('Failed to encode to Base64.', 'error');
                }
            };

            const decodeBase64 = () => {
                if (!text.trim()) {
                    showToast('No text to decode.', 'warning');
                    return;
                }
                try {
                    const decodedText = atob(text);
                    setText(decodedText);
                    showToast('Text decoded from Base64!', 'success');
                } catch (e) {
                    showToast('Failed to decode Base64. Invalid Base64 string.', 'error');
                }
            };

            const urlEncode = () => {
                if (!text.trim()) {
                    showToast('No text to URL encode.', 'warning');
                    return;
                }
                setText(encodeURIComponent(text));
                showToast('Text URL encoded!', 'success');
            };

            const urlDecode = () => {
                if (!text.trim()) {
                    showToast('No text to URL decode.', 'warning');
                    return;
                }
                try {
                    setText(decodeURIComponent(text));
                    showToast('Text URL decoded!', 'success');
                } catch (e) {
                    showToast('Failed to URL decode. Invalid URL encoded string.', 'error');
                }
            };

            const textToBinary = () => {
                if (!text.trim()) {
                    showToast('No text to convert to binary.', 'warning');
                    return;
                }
                showLoadingFor(() => {
                    const binaryString = text.split('').map(char => {
                        const charCode = char.charCodeAt(0);
                        return charCode.toString(2).padStart(8, '0');
                    }).join(' ');
                    setText(binaryString);
                    showToast('Text converted to binary!', 'success');
                }, 'Converting to binary...');
            };

            const binaryToText = () => {
                if (!text.trim()) {
                    showToast('No binary to convert to text.', 'warning');
                    return;
                }
                try {
                    const binaryChunks = text.split(' ').filter(chunk => chunk.trim() !== '');
                    if (binaryChunks.length === 0) {
                        showToast('Invalid binary input. Please enter space-separated binary numbers.', 'error');
                        return;
                    }
                    const decodedText = binaryChunks.map(chunk => {
                        if (!/^[01]+$/.test(chunk)) {
                            throw new Error(`Invalid binary chunk: ${chunk}`);
                        }
                        return String.fromCharCode(parseInt(chunk, 2));
                    }).join('');
                    setText(decodedText);
                    showToast('Binary converted to text!', 'success');
                } catch (e) {
                    showToast(`Failed to convert binary to text: ${e.message}`, 'error');
                }
            };

            // Utility functions
            const copyToClipboard = () => {
                if (!text.trim()) {
                    showToast('No text to copy.', 'warning');
                    return;
                }
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = text;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                try {
                    document.execCommand('copy');
                    showToast('Text copied to clipboard!', 'success');
                } catch (err) {
                    showToast('Failed to copy text. Please try manually.', 'error');
                }
                document.body.removeChild(tempTextArea);
            };

            const clearText = () => {
                setText('');
                showToast('Text cleared!', 'info');
            };

            const removeHtmlTags = () => {
                if (!text.trim()) {
                    showToast('No text to remove HTML tags from.', 'warning');
                    return;
                }
                const cleanText = text.replace(/<[^>]*>/g, '');
                setText(cleanText);
                showToast('HTML tags removed!', 'success');
            };


            // Enhanced Find and Replace Functions
            const buildSearchRegex = (searchText, options = {}) => {
                const { useRegex: isRegex = false, caseSensitive = false, wholeWord = false } = options;
                
                let pattern = searchText;
                
                if (!isRegex) {
                    // Escape special regex characters
                    pattern = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                
                if (wholeWord) {
                    pattern = `\\b${pattern}\\b`;
                }
                
                const flags = caseSensitive ? 'g' : 'gi';
                
                try {
                    return new RegExp(pattern, flags);
                } catch (e) {
                    throw new Error(`Invalid regex pattern: ${e.message}`);
                }
            };

            const findAllMatches = (text, searchText, options = {}) => {
                if (!text || !searchText) return [];
                
                try {
                    const regex = buildSearchRegex(searchText, options);
                    const matches = [];
                    let match;
                    
                    while ((match = regex.exec(text)) !== null) {
                        matches.push({
                            index: match.index,
                            text: match[0],
                            length: match[0].length
                        });
                        
                        // Prevent infinite loop on zero-length matches
                        if (match[0].length === 0) {
                            regex.lastIndex = match.index + 1;
                        }
                    }
                    
                    return matches;
                } catch (e) {
                    showToast(`Search error: ${e.message}`, 'error');
                    return [];
                }
            };

            const highlightMatches = React.useCallback((text, searchText, currentIndex = -1) => {
                if (!text || !searchText) {
                    setHighlightedText('');
                    return;
                }
                
                const matches = findAllMatches(text, searchText, { useRegex, caseSensitive, wholeWord });
                setTotalMatches(matches.length);
                
                if (matches.length === 0) {
                    setHighlightedText('');
                    return;
                }
                
                let highlightedContent = '';
                let lastIndex = 0;
                
                matches.forEach((match, index) => {
                    highlightedContent += text.slice(lastIndex, match.index);
                    const isCurrentMatch = index === currentIndex;
                    const className = isCurrentMatch ? 'current-match' : '';
                    highlightedContent += `<mark class="${className}">${match.text}</mark>`;
                    lastIndex = match.index + match.length;
                });
                
                highlightedContent += text.slice(lastIndex);
                setHighlightedText(highlightedContent);
            }, [useRegex, caseSensitive, wholeWord]);

            const handleFindReplace = () => {
                if (!text.trim() || !findText.trim()) {
                    showToast('Text area or "Find" field cannot be empty for find and replace.', 'warning');
                    return;
                }
                
                try {
                    const regex = buildSearchRegex(findText, { useRegex, caseSensitive, wholeWord });
                    const newText = text.replace(regex, replaceText);
                    const replacedCount = (text.match(regex) || []).length;
                    
                    setText(newText);
                    setShowFindReplaceModal(false);
                    setCurrentMatchIndex(-1);
                    setHighlightedText('');
                    showToast(`${replacedCount} occurrence(s) of "${findText}" replaced with "${replaceText}"!`, 'success');
                } catch (e) {
                    showToast(`Replace error: ${e.message}`, 'error');
                }
            };

            const findNext = () => {
                if (!text.trim() || !findText.trim()) {
                    showToast('Text area or "Find" field cannot be empty.', 'warning');
                    return;
                }
                
                const matches = findAllMatches(text, findText, { useRegex, caseSensitive, wholeWord });
                
                if (matches.length === 0) {
                    showToast('No matches found.', 'info');
                    setCurrentMatchIndex(-1);
                    return;
                }
                
                const nextIndex = (currentMatchIndex + 1) % matches.length;
                setCurrentMatchIndex(nextIndex);
                highlightMatches(text, findText, nextIndex);
                
                showToast(`Match ${nextIndex + 1} of ${matches.length}`, 'info');
            };

            const replaceCurrentMatch = () => {
                if (!text.trim() || !findText.trim()) {
                    showToast('Text area or "Find" field cannot be empty.', 'warning');
                    return;
                }
                
                const matches = findAllMatches(text, findText, { useRegex, caseSensitive, wholeWord });
                
                if (currentMatchIndex < 0 || currentMatchIndex >= matches.length) {
                    showToast('No current match selected. Use "Find Next" first.', 'warning');
                    return;
                }
                
                const match = matches[currentMatchIndex];
                const newText = text.substring(0, match.index) + 
                               replaceText + 
                               text.substring(match.index + match.length);
                
                setText(newText);
                setCurrentMatchIndex(-1);
                setHighlightedText('');
                showToast('Current match replaced!', 'success');
            };

            // Effect to update highlighting when find text or options change
            React.useEffect(() => {
                if (findText && showFindReplaceModal) {
                    highlightMatches(text, findText, currentMatchIndex);
                } else {
                    setHighlightedText('');
                    setTotalMatches(0);
                    setCurrentMatchIndex(-1);
                }
            }, [findText, text, highlightMatches, showFindReplaceModal, currentMatchIndex]);

            // Export functions
            const saveTextAsFile = (content, filename, mimeType) => {
                if (!content.trim()) {
                    showToast('No text to save.', 'warning');
                    return;
                }
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast(`Text saved as ${filename}!`, 'success');
            };

            const saveAsTxt = () => saveTextAsFile(text, 'manipulated_text.txt', 'text/plain');
            const saveAsJson = () => saveTextAsFile(JSON.stringify({ content: text }, null, 2), 'manipulated_text.json', 'application/json');
            const saveAsMarkdown = () => saveTextAsFile(text, 'manipulated_text.md', 'text/markdown');
            
            const saveAsPdf = () => {
                if (!text.trim()) {
                    showToast('No text to save as PDF.', 'warning');
                    return;
                }
                
                try {
                    showLoadingFor(async () => {
                        const { jsPDF } = window.jspdf;
                        const doc = new jsPDF();
                        
                        const margin = 20;
                        const pageWidth = doc.internal.pageSize.getWidth();
                        const pageHeight = doc.internal.pageSize.getHeight();
                        const maxLineWidth = pageWidth - (margin * 2);
                        
                        // Split text into lines that fit the page width
                        const lines = doc.splitTextToSize(text, maxLineWidth);
                        
                        let y = margin;
                        const lineHeight = 7;
                        
                        lines.forEach((line) => {
                            if (y + lineHeight > pageHeight - margin) {
                                doc.addPage();
                                y = margin;
                            }
                            doc.text(line, margin, y);
                            y += lineHeight;
                        });
                        
                        doc.save('manipulated_text.pdf');
                        showToast('Text saved as PDF!', 'success');
                    }, 'Generating PDF...');
                } catch (e) {
                    showToast('Failed to generate PDF. Please try again.', 'error');
                }
            };

            // Calculate stats
            const characterCount = text.length;
            const words = text.match(/\b\w+\b/g);
            const wordCount = words ? words.length : 0;
            const lineCount = text.split('\n').length;
            const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
            const paragraphCount = paragraphs.length || (text.trim() ? 1 : 0);

            const renderFunctionButtons = () => {
                const buttonClass = "w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";
                
                switch (activeCategory) {
                    case 'formatting':
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button onClick={toUppercase} className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500`}>
                                    <i className="fas fa-arrow-up mr-2"></i>Uppercase
                                </button>
                                <button onClick={toLowercase} className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500`}>
                                    <i className="fas fa-arrow-down mr-2"></i>Lowercase
                                </button>
                                <button onClick={toTitleCase} className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500`}>
                                    <i className="fas fa-text-height mr-2"></i>Title Case
                                </button>
                                <button onClick={swapCase} className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500`}>
                                    <i className="fas fa-exchange-alt mr-2"></i>Swap Case
                                </button>
                                <button onClick={capitalizeSentences} className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500`}>
                                    <i className="fas fa-paragraph mr-2"></i>Capitalize Sentences
                                </button>
                                <button onClick={trimWhitespace} className={`${buttonClass} bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500`}>
                                    <i className="fas fa-cut mr-2"></i>Trim Whitespace
                                </button>
                                <button onClick={removeExtraSpaces} className={`${buttonClass} bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500`}>
                                    <i className="fas fa-compress mr-2"></i>Remove Extra Spaces
                                </button>
                                <button onClick={reverseText} className={`${buttonClass} bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-500`}>
                                    <i className="fas fa-undo mr-2"></i>Reverse Text
                                </button>
                            </div>
                        );
                    case 'lines':
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={removeDuplicateLines} className={`${buttonClass} bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500`}>
                                    <i className="fas fa-copy mr-2"></i>Remove Duplicate Lines
                                </button>
                                <button onClick={removeEmptyLines} className={`${buttonClass} bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500`}>
                                    <i className="fas fa-minus mr-2"></i>Remove Empty Lines
                                </button>
                                <button onClick={addLineNumbers} className={`${buttonClass} bg-green-500 hover:bg-green-600 text-white focus:ring-green-500`}>
                                    <i className="fas fa-list-ol mr-2"></i>Add Line Numbers
                                </button>
                                <button onClick={sortLinesAlphabetically} className={`${buttonClass} bg-green-500 hover:bg-green-600 text-white focus:ring-green-500`}>
                                    <i className="fas fa-sort-alpha-down mr-2"></i>Sort Lines
                                </button>
                                <button onClick={toBulletList} className={`${buttonClass} bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500`}>
                                    <i className="fas fa-list-ul mr-2"></i>To Bullet List
                                </button>
                                <button onClick={toNumberedList} className={`${buttonClass} bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500`}>
                                    <i className="fas fa-list-ol mr-2"></i>To Numbered List
                                </button>
                            </div>
                        );
                    case 'encoding':
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={encodeBase64} className={`${buttonClass} bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500`}>
                                    <i className="fas fa-lock mr-2"></i>Encode Base64
                                </button>
                                <button onClick={decodeBase64} className={`${buttonClass} bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500`}>
                                    <i className="fas fa-unlock mr-2"></i>Decode Base64
                                </button>
                                <button onClick={urlEncode} className={`${buttonClass} bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500`}>
                                    <i className="fas fa-link mr-2"></i>URL Encode
                                </button>
                                <button onClick={urlDecode} className={`${buttonClass} bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500`}>
                                    <i className="fas fa-unlink mr-2"></i>URL Decode
                                </button>
                                <button onClick={textToBinary} className={`${buttonClass} bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-500`}>
                                    <i className="fas fa-binary mr-2"></i>Text to Binary
                                </button>
                                <button onClick={binaryToText} className={`${buttonClass} bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-500`}>
                                    <i className="fas fa-font mr-2"></i>Binary to Text
                                </button>
                            </div>
                        );
                    case 'utilities':
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => setShowFindReplaceModal(true)} className={`${buttonClass} bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-500`}>
                                    <i className="fas fa-search mr-2"></i>Find & Replace
                                </button>
                                <button onClick={copyToClipboard} className={`${buttonClass} bg-green-500 hover:bg-green-600 text-white focus:ring-green-500`}>
                                    <i className="fas fa-copy mr-2"></i>Copy to Clipboard
                                </button>
                                <button onClick={removeHtmlTags} className={`${buttonClass} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`}>
                                    <i className="fas fa-code mr-2"></i>Remove HTML Tags
                                </button>
                                <button onClick={clearText} className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white focus:ring-red-500`}>
                                    <i className="fas fa-trash mr-2"></i>Clear Text
                                </button>
                            </div>
                        );
                    case 'export':
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button onClick={saveAsTxt} className={`${buttonClass} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`}>
                                    <i className="fas fa-file-alt mr-2"></i>Save as TXT
                                </button>
                                <button onClick={saveAsJson} className={`${buttonClass} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`}>
                                    <i className="fas fa-file-code mr-2"></i>Save as JSON
                                </button>
                                <button onClick={saveAsMarkdown} className={`${buttonClass} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`}>
                                    <i className="fab fa-markdown mr-2"></i>Save as Markdown
                                </button>
                                <button onClick={saveAsPdf} className={`${buttonClass} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`}>
                                    <i className="fas fa-file-pdf mr-2"></i>Save as PDF
                                </button>
                            </div>
                        );
                    case 'analysis':
                        return (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                        <div className="text-2xl font-bold text-blue-600">{characterCount}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Characters</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                        <div className="text-2xl font-bold text-green-600">{wordCount}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Words</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                        <div className="text-2xl font-bold text-purple-600">{lineCount}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Lines</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                        <div className="text-2xl font-bold text-orange-600">{paragraphCount}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Paragraphs</div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-3 dark:text-white">Word Counter</h3>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            type="text"
                                            placeholder="Word to count..."
                                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                            value={searchWord}
                                            onChange={(e) => setSearchWord(e.target.value)}
                                        />
                                        <div className="text-lg font-semibold dark:text-white">
                                            Occurrences: <span className="text-blue-600">{wordOccurrences}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            };

            return (
                <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} flex`}>
                    {/* Sidebar */}
                    <Sidebar 
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        categories={categories}
                        isCollapsed={sidebarCollapsed}
                        setIsCollapsed={setSidebarCollapsed}
                        darkMode={darkMode}
                    />

                    {/* Main content */}
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Text Manipulator Pro
                                </h1>
                                <div className="flex items-center space-x-4">
                                    {/* Undo/Redo */}
                                    <button
                                        onClick={undo}
                                        disabled={historyIndex === 0}
                                        className={`p-2 rounded-lg transition-colors ${
                                            historyIndex === 0 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                        title="Undo"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={redo}
                                        disabled={historyIndex === history.length - 1}
                                        className={`p-2 rounded-lg transition-colors ${
                                            historyIndex === history.length - 1 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                        title="Redo"
                                    >
                                        <i className="fas fa-redo"></i>
                                    </button>
                                    
                                    {/* Dark mode toggle */}
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    >
                                        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Tab Bar */}
                        <TabBar 
                            tabs={tabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            onNewTab={addNewTab}
                            onCloseTab={closeTab}
                        />

                        {/* Main workspace */}
                        <div className="flex-1 p-6 space-y-6">
                            {/* Text editor */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="text-editor-container relative">
                                    {highlightedText && (
                                        <div 
                                            className="text-highlight-overlay absolute top-0 left-0 w-full h-64 p-4 whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-hidden"
                                            dangerouslySetInnerHTML={{ __html: highlightedText }}
                                        />
                                    )}
                                    <textarea
                                        className="w-full h-64 p-4 bg-transparent border-none focus:outline-none resize-none dark:text-white custom-scrollbar font-mono text-sm leading-relaxed"
                                        placeholder="Enter your text here..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Function buttons */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 tab-content">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                                    {categories.find(cat => cat.id === activeCategory)?.name}
                                </h2>
                                {renderFunctionButtons()}
                            </div>
                        </div>
                    </div>

                    {/* Find and Replace Modal */}
                    <Modal isOpen={showFindReplaceModal} onClose={() => setShowFindReplaceModal(false)} title="Find and Replace">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Find</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    value={findText}
                                    onChange={(e) => setFindText(e.target.value)}
                                    placeholder="Text to find..."
                                />
                                {totalMatches > 0 && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {totalMatches} match(es) found
                                        {currentMatchIndex >= 0 && ` (showing ${currentMatchIndex + 1}/${totalMatches})`}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Replace with</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    value={replaceText}
                                    onChange={(e) => setReplaceText(e.target.value)}
                                    placeholder="Replacement text..."
                                />
                            </div>
                            
                            {/* Search Options */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Options</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={useRegex}
                                            onChange={(e) => setUseRegex(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Regular Expression</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={caseSensitive}
                                            onChange={(e) => setCaseSensitive(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Case Sensitive</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={wholeWord}
                                            onChange={(e) => setWholeWord(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Whole Word Match</span>
                                    </label>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 justify-end">
                                <button
                                    onClick={() => setShowFindReplaceModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={findNext}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                    disabled={!findText.trim()}
                                >
                                    <i className="fas fa-search mr-1"></i>Find Next
                                </button>
                                <button
                                    onClick={replaceCurrentMatch}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                    disabled={currentMatchIndex < 0}
                                >
                                    <i className="fas fa-exchange-alt mr-1"></i>Replace
                                </button>
                                <button
                                    onClick={handleFindReplace}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                    disabled={!findText.trim()}
                                >
                                    <i className="fas fa-refresh mr-1"></i>Replace All
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* Loading Spinner */}
                    <LoadingSpinner isLoading={isLoading} message={loadingMessage} />

                    {/* Toast notifications */}
                    <div className="fixed top-4 right-4 z-50 space-y-2">
                        {toasts.map(toast => (
                            <Toast
                                key={toast.id}
                                message={toast.message}
                                type={toast.type}
                                onClose={() => removeToast(toast.id)}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        // Render the App
        ReactDOM.render(<App />, document.getElementById('root'));
