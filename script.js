/*
 * Time Note - script.js
 * Core application logic, state management, and event handling
 */

class TimeNoteApp {
    constructor() {
        // DOM Elements
        this.displayContent = document.getElementById('display-content');
        this.keyboard = document.getElementById('keyboard');
        this.undoBtn = document.getElementById('undo-btn');
        this.redoBtn = document.getElementById('redo-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.downloadBtn = document.getElementById('download-btn');

        // State Management
        this.history = ['1)\n(']; // Array to store previous states for undo/redo
        this.historyIndex = 0;
        this.currentText = '1)\n(';

        // Parsing state to track where we are in the input
        this.parseState = {
            lineNumber: 1,
            isInTimestamp: true, // Are we inside a timestamp?
            mmDigits: 0, // Number of mm digits entered
            ssDigits: 0, // Number of ss digits entered
            lastCharWasOperator: false, // Track if the last character was + or -
        };

        // Initialize the app
        this.init();
    }

    init() {
        // Attach keyboard event listeners
        this.attachKeyboardListeners();
        this.attachHeaderListeners();
        this.updateDisplay();
    }

    attachKeyboardListeners() {
        const keys = document.querySelectorAll('.key');
        keys.forEach((key) => {
            key.addEventListener('click', (e) => {
                const keyValue = key.dataset.key;
                this.handleKeyPress(keyValue);
            });
        });
    }

    attachHeaderListeners() {
        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
    }

    handleKeyPress(key) {
        switch (key) {
            case 'C':
                this.handleClear();
                break;
            case 'backspace':
                this.handleBackspace();
                break;
            case 'OK':
                this.handleOK();
                break;
            case 'Enter':
                this.handleEnter();
                break;
            case '+':
            case '-':
                this.handleOperator(key);
                break;
            case '(':
            case ')':
            case ':':
            case ',':
                this.handleCharacter(key);
                break;
            default:
                // Numbers 0-9
                if (/^\d$/.test(key)) {
                    this.handleDigit(key);
                }
                break;
        }
    }

    handleDigit(digit) {
        // Remove the cursor from the current text
        let text = this.currentText.replace('▋', '');

        // Determine the current state
        const lastChar = text[text.length - 1];

        // If we're at the start of a timestamp (after '(')
        if (lastChar === '(' || (this.parseState.mmDigits === 0 && this.parseState.ssDigits === 0)) {
            // First digit of mm
            text += digit;
            this.parseState.mmDigits = 1;
        } else if (this.parseState.mmDigits === 1 && this.parseState.ssDigits === 0) {
            // Second digit of mm - auto-insert colon
            text += digit + ':';
            this.parseState.mmDigits = 2;
        } else if (this.parseState.mmDigits === 2 && this.parseState.ssDigits === 0) {
            // First digit of ss
            text += digit;
            this.parseState.ssDigits = 1;
        } else if (this.parseState.mmDigits === 2 && this.parseState.ssDigits === 1) {
            // Second digit of ss - auto-insert ),(
            text += digit + '),(\n' + (this.parseState.lineNumber + 1) + ')\n(';
            this.parseState.lineNumber += 1;
            this.parseState.mmDigits = 0;
            this.parseState.ssDigits = 0;
            this.parseState.lastCharWasOperator = false;
        }

        // Add cursor
        text += '▋';
        this.currentText = text;
        this.saveState();
        this.updateDisplay();
    }

    handleCharacter(char) {
        let text = this.currentText.replace('▋', '');

        // Allow manual character insertion
        text += char;

        // Reset parsing state based on the character
        if (char === '(') {
            this.parseState.mmDigits = 0;
            this.parseState.ssDigits = 0;
        } else if (char === ':') {
            if (this.parseState.mmDigits === 1) {
                this.parseState.mmDigits = 2;
            }
        }

        text += '▋';
        this.currentText = text;
        this.saveState();
        this.updateDisplay();
    }

    handleOK() {
        let text = this.currentText.replace('▋', '');

        // If we have 1 digit for mm
        if (this.parseState.mmDigits === 1 && this.parseState.ssDigits === 0) {
            // Prepend 0 and add colon
            const lastChar = text[text.length - 1];
            if (/^\d$/.test(lastChar)) {
                text = text.slice(0, -1) + '0' + lastChar + ':';
                this.parseState.mmDigits = 2;
            }
        }
        // If we have 1 digit for ss
        else if (this.parseState.mmDigits === 2 && this.parseState.ssDigits === 1) {
            // Prepend 0 and trigger timestamp completion
            const lastChar = text[text.length - 1];
            if (/^\d$/.test(lastChar)) {
                text = text.slice(0, -1) + '0' + lastChar + '),(\n' + (this.parseState.lineNumber + 1) + ')\n(';
                this.parseState.lineNumber += 1;
                this.parseState.mmDigits = 0;
                this.parseState.ssDigits = 0;
                this.parseState.lastCharWasOperator = false;
            }
        }

        text += '▋';
        this.currentText = text;
        this.saveState();
        this.updateDisplay();
    }

    handleOperator(op) {
        let text = this.currentText.replace('▋', '');

        // Operators can only be pressed immediately after a full timestamp
        // Check if the last two characters are ),(
        if (text.endsWith('),(')) {
            // Replace ),( with )+(  or )-(
            text = text.slice(0, -3) + ')' + op + '(';
            this.parseState.lastCharWasOperator = true;
        }

        text += '▋';
        this.currentText = text;
        this.saveState();
        this.updateDisplay();
    }

    handleBackspace() {
        let text = this.currentText.replace('▋', '');

        if (text.length === 0) return;

        // Handle special cases for auto-inserted characters
        const lastChar = text[text.length - 1];

        // If the last character is a colon, also remove the previous digit (mm)
        if (lastChar === ':') {
            text = text.slice(0, -2); // Remove digit and colon
            this.parseState.mmDigits = Math.max(0, this.parseState.mmDigits - 1);
        }
        // If the last characters are ),( (auto-inserted), remove them along with the ss digits
        else if (text.endsWith('),(')) {
            text = text.slice(0, -3);
            this.parseState.ssDigits = 0;
            this.parseState.mmDigits = 2;
        }
        // If the last characters are a newline and line number, handle it
        else if (text.match(/\n\d+\)\n\($/) && text.length > 4) {
            // Remove the newly created line
            text = text.replace(/\n\d+\)\n\($/, '),(\n');
            this.parseState.lineNumber = Math.max(1, this.parseState.lineNumber - 1);
            this.parseState.ssDigits = 0;
            this.parseState.mmDigits = 2;
        }
        // Regular backspace
        else {
            text = text.slice(0, -1);
            if (/^\d$/.test(lastChar)) {
                if (this.parseState.ssDigits > 0) {
                    this.parseState.ssDigits -= 1;
                } else if (this.parseState.mmDigits > 0) {
                    this.parseState.mmDigits -= 1;
                }
            }
        }

        text += '▋';
        this.currentText = text;
        this.saveState();
        this.updateDisplay();
    }

    handleClear() {
        // Single press: clear current line
        // Double press (within 500ms): clear entire document

        if (this.lastClearTime && Date.now() - this.lastClearTime < 500) {
            // Double press: clear entire document
            this.currentText = '1)\n(▋';
            this.parseState = {
                lineNumber: 1,
                isInTimestamp: true,
                mmDigits: 0,
                ssDigits: 0,
                lastCharWasOperator: false,
            };
            this.lastClearTime = null;
        } else {
            // Single press: clear current line
            const lines = this.currentText.replace('▋', '').split('\n');
            lines[lines.length - 1] = '(';
            this.currentText = lines.join('\n') + '▋';
            this.parseState.mmDigits = 0;
            this.parseState.ssDigits = 0;
            this.parseState.lastCharWasOperator = false;
            this.lastClearTime = Date.now();
        }

        this.saveState();
        this.updateDisplay();
    }

    handleEnter() {
        let text = this.currentText.replace('▋', '');

        // Finalize the current line and create a new one
        const newLineNumber = this.parseState.lineNumber + 1;
        text += '\n' + newLineNumber + ')\n(';

        this.parseState.lineNumber = newLineNumber;
        this.parseState.mmDigits = 0;
        this.parseState.ssDigits = 0;
        this.parseState.lastCharWasOperator = false;

        text += '▋';
        this.currentText = text;
        this.saveState();
        this.updateDisplay();
    }

    saveState() {
        // Remove any states after the current index (in case we undo and then make a new change)
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(this.currentText);
        this.historyIndex = this.history.length - 1;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex -= 1;
            this.currentText = this.history[this.historyIndex];
            this.updateParseState();
            this.updateDisplay();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex += 1;
            this.currentText = this.history[this.historyIndex];
            this.updateParseState();
            this.updateDisplay();
        }
    }

    updateParseState() {
        // Recalculate the parse state based on the current text
        const text = this.currentText.replace('▋', '');
        const lines = text.split('\n');
        this.parseState.lineNumber = parseInt(lines[0]) || 1;

        // Find the last line and analyze it
        const lastLine = lines[lines.length - 1];
        const lastTwoLines = lines.slice(-2).join('\n');

        // Count mm and ss digits in the last timestamp
        const timestampMatch = lastTwoLines.match(/\((\d*)(?::(\d*))?/);
        if (timestampMatch) {
            this.parseState.mmDigits = (timestampMatch[1] || '').length;
            this.parseState.ssDigits = (timestampMatch[2] || '').length;
        } else {
            this.parseState.mmDigits = 0;
            this.parseState.ssDigits = 0;
        }
    }

    updateDisplay() {
        this.displayContent.textContent = this.currentText;
    }

    cleanText() {
        // Remove the cursor and any incomplete trailing characters
        let text = this.currentText.replace('▋', '');

        // Remove incomplete trailing characters like ,(  or +(
        text = text.replace(/[+\-,]\($/, '');

        return text;
    }

    copy() {
        const cleanedText = this.cleanText();
        navigator.clipboard.writeText(cleanedText).then(() => {
            // Visual feedback: temporarily change button text
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'COPIED!';
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
            }, 1500);
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
    }

    download() {
        const cleanedText = this.cleanText();
        const now = new Date();
        const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const filename = `timenotes_${dateString}.txt`;

        const blob = new Blob([cleanedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TimeNoteApp();
});
