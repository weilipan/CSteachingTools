# C++ String & Array Visualization Plan

## Goal
Create an interactive, visually appealing web page to explain the relationship between C++ strings, characters, and one-dimensional arrays. The tool will demonstrate how `std::string` manages memory and indices, and visualize common string operations.

## User Review Required
> [!IMPORTANT]
> I will be using Vanilla HTML/CSS/JS as this is a single-page visualization tool. No heavy framework (React/Vue) is needed unless requested.

## Proposed Changes

### Core Structure
#### [NEW] [index.html](file:///f:/antigravityproject/string and array/index.html)
- Main container with glassmorphism effect.
- **Hero Section**: Title and brief intro.
- **Visualization Stage**:
    - Dynamic rendering of the string as an array of character boxes.
    - Indices (0, 1, 2...) shown above/below.
    - Memory address simulation (optional, for advanced context).
- **Control Panel**:
    - Input field to set the base string.
    - Buttons for operations: `find`, `substr`, `at`, `append`, `insert`, `erase`, `replace`.
    - Parameter inputs for these methods (e.g., "Find what?", "Start index?").
- **Log/Explanation Area**:
    - Textual explanation of the result (e.g., "`str.substr(2, 3)` returns 'llo'").
    - C++ code snippet corresponding to the action.

#### [NEW] [style.css](file:///f:/antigravityproject/string and array/style.css)
- **Theme**: Dark mode with neon blue/purple accents (Cyberpunk/Dev theme).
- **Typography**: 'Inter' or 'Fira Code' (for code parts).
- **Animations**:
    - Smooth transitions when adding/removing characters.
    - Highlighting effects for `find` (scanning animation).
    - Pop-out effects for `substr`.

#### [NEW] [script.js](file:///f:/antigravityproject/string and array/script.js)
- **State Management**: Current string value.
- **Render Logic**: Function to draw the string array based on current state.
- **Method Implementations**:
    - `find`: Highlight matching indices.
    - `substr`: Highlight range, then show result in a separate bubble.
    - `append`: Animate new boxes appearing at the end.
    - `erase`: Animate boxes collapsing.

## Verification Plan
### Manual Verification
- Open `index.html` in the browser.
- Test entering a string (e.g., "Hello World").
- Click `find("World")` -> Verify indices 6-10 highlight.
- Click `substr(0, 5)` -> Verify "Hello" is displayed.
- Click `append("!")` -> Verify string becomes "Hello World!".
- Verify responsive design on different window sizes.
