# Time Note: Mobile-First Timestamp Logging App

## 🌟 Project Overview

**Time Note** is a highly specialized, mobile-first web application designed for rapid and efficient logging of timestamps. The application is built with a minimalist, dark aesthetic, heavily inspired by the user interface of the iOS Calculator. Its primary function is to facilitate the quick entry of time data in a structured format, making it ideal for tasks requiring precise time tracking and logging.

The application is built using a clean, efficient, and robust **Vanilla JavaScript** stack, ensuring high performance and a small footprint without reliance on external frameworks or libraries.

## ✨ Key Features

| Feature | Description | Implementation Detail |
| :--- | :--- | :--- |
| **True Black OLED Theme** | Utilizes a pure black (`#000000`) background and bright white text for maximum contrast and power efficiency on OLED screens. | Custom CSS variables and mobile-first styling. |
| **Mobile-First Design** | Fully responsive layout that fills the entire viewport, with the keyboard fixed to the bottom, providing a native app feel. | CSS Flexbox and `vh` units for layout control. |
| **Automated Timestamp Formatting** | Complex JavaScript logic automatically inserts colons (`:`) and closes timestamps with `),(` to streamline data entry. | State machine logic within `script.js` tracks `mm` and `ss` digits. |
| **Intelligent Keyboard** | Features an iOS-inspired keyboard with specialized function keys (`OK`, `Enter`, `C`, `⌫`) to manage input state and formatting. | Event delegation and specific handlers for each key. |
| **State Management** | Includes **UNDO** and **REDO** functionality to manage application state, allowing users to revert or re-apply actions. | History array stores previous text states. |
| **Data Export** | **COPY** and **DOWNLOAD** buttons clean the final text (removing incomplete trailing characters) and export the log to the clipboard or a `.txt` file. | `navigator.clipboard.writeText` and Blob/URL object for download. |

## 💻 Technology Stack

*   **HTML5:** Semantic structure.
*   **CSS3:** Styling and mobile layout (Flexbox).
*   **Vanilla JavaScript:** All application logic, state management, and DOM manipulation.

## 🚀 Getting Started

### Live Demo

The application is hosted via GitHub Pages for a permanent, live demonstration:

**[View Live Application Here](https://normalguy2125.github.io/time-note-app/)**

### Local Development

To run this project locally, simply clone the repository and open `index.html` in your web browser.

```bash
# Clone the repository
git clone https://github.com/normalguy2125/time-note-app.git

# Navigate to the project directory
cd time-note-app

# Open the file in your browser
open index.html
```

## ⚙️ Deployment (GitHub Pages)

This project is configured for simple deployment via GitHub Pages.

1.  **Push** the code to your `main` branch.
2.  Go to your repository's **Settings** tab.
3.  Navigate to **Pages**.
4.  Under **Build and deployment**, select **Deploy from a branch**.
5.  Choose the `main` branch and the `/ (root)` folder, then click **Save**.

Your site will be live at `https://[YOUR_USERNAME].github.io/time-note-app/`.

## 📄 File Structure

| File | Purpose |
| :--- | :--- |
| `index.html` | The main HTML file containing the app's structure (Header, Display, Keyboard). |
| `style.css` | Contains all styling, including the OLED dark theme, mobile responsiveness, and button aesthetics. |
| `script.js` | The core logic, handling all button presses, automatic formatting, state management, and header functions. |

## ✍️ Author

This application was developed by **Manus AI** as a specialized solution for mobile timestamp logging.

---
*This README is designed to be professional, comprehensive, and to clearly communicate the project's purpose and technical details.*
