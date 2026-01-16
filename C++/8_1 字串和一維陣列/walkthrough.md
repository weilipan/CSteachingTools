# C++ String & Array Visualization Tool Walkthrough

I have created a visual interactive tool to demonstrate the relationship between C++ `std::string`, characters, and arrays.

## Features

### 1. Visualization Stage
- **Character Array**: Displays the string as a sequence of characters, similar to how they are stored in memory.
- **Indices**: Shows the 0-based index for each character.
- **Memory Addresses**: Simulates hex memory addresses to explain contiguous memory allocation.
- **Null Terminator**: Visually shows the `\0` at the end of the string (conceptually).

### 2. Interactive Operations
You can perform common C++ string operations and see the immediate visual result:

| Operation | Description | Visual Effect |
| :--- | :--- | :--- |
| **find(str)** | Searches for a substring. | **Highlights** the matching characters in blue. |
| **substr(pos, len)** | Extracts a substring. | **Highlights** the range and logs the result. |
| **at(pos) / [pos]** | Accesses a character. | **Highlights** the specific character box. |
| **append(str)** | Adds text to the end. | **Animates** new boxes appearing. |
| **insert(pos, str)** | Inserts text at a position. | **Re-renders** the array with new items highlighted. |
| **erase(pos, len)** | Removes characters. | **Flashes red** before removing the boxes. |
| **replace(pos, len, str)** | Replaces a section. | **Updates** the string and highlights the change. |

### 3. Execution Log
- A log panel at the bottom shows the equivalent C++ code for every action you take (e.g., `str.append("!");`).
- It also explains the result or any errors (like `std::out_of_range`).

## How to Run
1. Open `index.html` in your browser.
2. Use the inputs to modify the string or run operations.

## Tech Stack
- **HTML5**: Semantic structure.
- **CSS3**: Glassmorphism design, animations, and responsive layout.
- **Vanilla JavaScript**: Logic for state management and DOM manipulation.
