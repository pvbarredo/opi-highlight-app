# Data Entry Page Component Prompt

**Date Created:** February 14, 2026  
**Last Updated:** February 16, 2026

## Role
Act as a Senior Frontend Engineer specialized in React and Tailwind CSS.

## Task
Create a responsive React component for a data entry page with a clean, modern interface for the OPI Basketball Community Highlight Extractor.

## Technical Stack

- **Framework:** React (Functional Components with Hooks)
- **Styling:** Tailwind CSS v3 (Mobile-first approach)
- **Icons:** Lucide-React (for add/delete/drag icons)
- **Drag & Drop Library:** @dnd-kit/core and @dnd-kit/sortable (preferred for modern React)
- **Date Library:** react-datepicker

### Tailwind CSS Setup Requirements

**Required Dependencies:**
```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

**tailwind.config.js:**
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**src/index.css (add at the top):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Functional Requirements

### Layout
Use a vertical stack with clean card-based sections.

### Section 0: Title Bar
- Large gradient header with red-700 to red-600 background
- White text with shadow
- **Layout:** Centered flex column design
  - Main title: "OPI Basketball Community" (text-3xl md:text-4xl, bold, centered)
  - Subtitle: "Highlight Extractor" (text-lg md:text-xl, red-100 color, medium weight, centered)
- **"How to Use" Button:** Positioned at bottom-right of title bar in a separate div
  - Uses `flex justify-end mt-4` for bottom-right positioning
  - Lightbulb icon with "How to Use" label
  - White/10 background with backdrop blur, hover to white/20
  - Border: white/20
  - Opens modal when clicked
- Rounded corners and shadow-lg
- Margin bottom before date picker section

### How to Use Modal
- **Trigger:** Lightbulb button in title bar
- **Modal Overlay:** Fixed position, black/50 background, z-50, centered with `flex items-center justify-center`
- **Modal Content:** 
  - White background, rounded-lg, max-w-2xl
  - Max height 90vh with scrollable content
  - Sticky header with title, lightbulb icon, and close button (X)
  - Close on overlay click or X button
  - **Content Alignment:** All section headers and content use `items-start` for left alignment (better readability)
- **Content Sections (with emoji icons):**
  - 📅 **Select Game Date:** Instructions to select the game date
  - 📹 **Camera Values:** 
    - Cam 1: Entrance camera
    - Cam 2: Opposite of Cam 1
    - Multi-part videos format: "Cam 2 Part 1" (in code style)
  - ⏱️ **Timestamp Format:** 
    - Format: HH:MM:SS (e.g., "01:53:22")
    - **Auto-formatting on blur:** If user enters "4:34", it converts to "00:04:34" (4 minutes, 34 seconds)
    - **Validation:** Shows error alert if format is invalid or if minutes/seconds exceed 59
    - Red-50 background timing rules box:
      - Shoot/Score: When ball goes through the net
      - Pass: When receiver catches the ball
      - Rebound: When rebounder secures the ball
      - Steal: When player gains possession
      - Block: When contact is made with the ball
      - **Good Move:** When there's an impressive play, even without a score
  - ◀️ ▶️ **Camera Side:**
    - Left (L): Closer side to camera
    - Right (R): Farther side from camera
    - 💡 Tip about right side potentially offering better angles
  - 🎬 **Action Buttons:**
    - 💾 Save CSV: Downloads a CSV file with all highlight entries for backup
    - 📂 Import CSV: Upload previously saved CSV file to restore entries
    - 📧 Email CSV: Opens email app with CSV data ready to send to pvbarredo@gmail.com
    - ✅ Submit: Opens email app with formatted message ready to submit to pvbarredo@gmail.com
  - **Filipino Translation:** All sections available in Filipino language
- **Styling:** 
  - Modal header: sticky, white background with border-bottom
  - Content padding: p-6, space-y-5
  - Section headers: `flex items-start gap-2` for left-aligned emoji + text
  - Code examples: gray-100 background, red-700 text, font-mono
  - Timing rules box: red-50 background with red-200 border
  - Red-700 bullet points for timing rules

### Section 1: Date Picker
- A date picker input displaying format: MM/DD/YYYY
- Full width input with subtle border styling
- Contained in a white card with padding
- **Reset Button:** Positioned at top-right corner
  - Gray-600 background with white text
  - Hover to gray-700
  - Click prompts confirmation dialog before resetting all rows to initial state (single empty row)
  - Text: "Reset"

### Section 2: Data Entry Table

#### Table Columns
1. **Placement (Desktop only):** Display row number/order (centered, bold, gray-600)
2. **Drag Handle:** Visible grip icon for row reordering (subtle gray color)
3. **Camera:** A text input field with placeholder "Cam ID"
   - **Auto-side setting:** When value contains "Cam1", side sets to Left (L); when "Cam2", side sets to Right (R)
4. **Time:** A free text input field with placeholder "00.00"
   - **Auto-formatting:** onBlur event formats time to HH:MM:SS (e.g., "4:34" → "00:04:34")
   - **Validation:** Shows error alert if format is invalid or values out of range
5. **Side:** A radio group with two options: "L" (Left) and "R" (Right)
   - Note: Each row must have a unique name attribute for its radio group (`side-${row.id}`)
   - Radio buttons styled with red accent color
   - Automatically set based on camera value but can be manually changed
   - Delete button (X icon) integrated within the Side column, not in a separate column

#### Table Header Styling
- Uppercase text labels: "CAMERA", "TIME", "SIDE"
- Medium font weight, small text size
- Gray color scheme
- Minimal padding
- No separate "Actions" column header

### Dynamic Actions

- **Add New Camera Row:** A full-width dashed border button below the table with text "+ Add New Camera Row"
  - Light gray dashed border
  - Centered text
  - Hover effect on border and text
  - **Auto-copy feature:** If the previous row has both camera and time values filled, the new row automatically copies those values (including side)
- **Delete Button:** Red X icon (Trash2) integrated into each row's Side column
- **Drag-and-Drop:** Implement a drag handle (grip icon) on each row allowing the user to reorder the list

### Action Buttons (Bottom of Form)

Four buttons in a responsive grid (2 columns on mobile, 4 columns on desktop):

1. **Save CSV:** 
   - Gray-600 background (#4B5563)
   - White text
   - Rounded corners
   - Exports table data as CSV file with date in filename
   - **CSV Format:** First line contains `Date,YYYY-MM-DD`, second line is headers `Placement,Camera,Time,Side`, then data rows
   - Hover to gray-700
   
2. **Import CSV:**
   - Gray-600 background (#4B5563)
   - White text
   - Rounded corners
   - Opens file picker to import previously saved CSV files
   - **Parses date from first line** and updates the date picker
   - Parses CSV starting from line 2 (skips date row and header row) and populates table rows
   - Shows success alert with row count
   - Hover to gray-700

3. **Email CSV:**
   - Gray-600 background (#4B5563)
   - White text
   - Rounded corners
   - Opens default email client with mailto: link
   - **Recipient:** pvbarredo@gmail.com (hardcoded)
   - **Subject:** "OPI Highlight Extract - [Date]"
   - **Body:** Includes CSV data formatted between markers for easy copy/paste
   - Shows info modal confirming email client opened
   - Hover to gray-700
   
4. **Submit:**
   - Red-700 background (#B91C1C)
   - White text
   - Rounded corners
   - Console logs formatted JSON object with:
     - `date`: ISO string
     - `formattedDate`: localized date string
     - `entries`: array of all row data
     - `totalEntries`: count of rows
   - Shows success modal
   - Hover to red-800

### Styling Details

**Color Scheme (Inspired by OOCL):**
- **Primary Red:** #B91C1C (red-700) - used for accents, borders, buttons, and highlights
- **Dark Gray:** #4B5563 (gray-600) - used for Save CSV and Import CSV buttons
- **Medium Gray:** #374151 (gray-700) - used for table headers (not black/slate-800)
- **Background:** #F3F4F6 (gray-100) - light gray background
- **Cards:** White (#FFFFFF) with red-700 top border accent (4px)

**Important:** Avoid using black (#000000) or very dark colors. Use dark gray or white instead.

**Input Fields:**
  - Light gray border (#D1D5DB / gray-300)
  - Rounded corners
  - Focus state: red-700 border with ring-1
  - Small text size
  - Consistent padding (px-3 py-2)

- **Radio Buttons:**
  - Red-700 accent color (`accent-red-700`) for selected state
  - Compact labels: "L" and "R" in gray-700
  - Medium font weight for labels
  - **Critical:** Each row MUST have unique name: `name={\`side-${row.id}\`}` to prevent sharing state
  - **Critical:** Each radio button MUST have unique id: Desktop uses `side-left-${row.id}` and `side-right-${row.id}`, Mobile uses `side-left-mobile-${row.id}` and `side-right-mobile-${row.id}`
  - **Critical:** Labels MUST use htmlFor attribute matching the radio button id for proper association
  - **Critical:** Use direct value updates: `onChange={() => onUpdate(row.id, 'side', 'left')}` NOT `onChange={(e) => ...}`
  - Cursor pointer on both input and label
  - Desktop: gap-4 between options, gap-1 between input and label
  - Mobile: gap-6 between options, gap-2 between input and label for better touch targets

**Table Headers:**
  - Gray-700 background (NOT slate-800 or black) with white text
  - Red-700 bottom border (2px)
  - Uppercase text labels
  - Small font size, semibold weight

**Buttons:**
  - **Add Row:** Dashed border, gray-600 text, hover to red-700
  - **Save CSV:** Gray-600 background with white text, hover to gray-700
  - **Import CSV:** Gray-600 background with white text, hover to gray-700
  - **Submit:** Red-700 background with white text, hover to red-800
  - All buttons have shadow-sm

**Drag & Drop Animation:**
  - **CRITICAL:** Use single table with thead and tbody (NOT split tables)
  - Add activation constraint to PointerSensor: `activationConstraint: { distance: 8 }` to prevent accidental drags
  - Must include `transform: CSS.Transform.toString(transform)` in style object
  - Add `transition` and `opacity: isDragging ? 0.5 : 1`
  - Add `bg-white hover:bg-gray-50` to table rows for smooth transitions
  - After drag, recalculate placement numbers for all rows: `reorderedItems.map((item, index) => ({ ...item, placement: index + 1 }))`
  - Mobile dragging uses card-based structure with same principles

**Sensor Configuration:**
```jsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

**Global CSS (index.css):**
  - Remove all black colors and dark theme styles
  - Remove button, h1, and anchor default styles (let Tailwind handle these)
  - Keep only essential font smoothing and reset styles
  - **NO** black backgrounds (#000, #1a1a1a, #242424)
  - **NO** dark color schemes

- **Overall Container:**
  - Max width: 4xl (max-w-4xl)
  - Light gray background (#F3F4F6)
  - White cards with shadow-sm and red-700 top border (4px)
  - Consistent spacing between sections

### Responsiveness
On mobile, transform the table into a "card" layout where each row becomes a card with labeled fields. Use Tailwind's `md:` prefix for desktop-specific styling.

**Mobile Card Design:**
- Display placement number at the top with drag handle (# badge with gray-100 background)
- Larger drag handle icon (size 24 instead of 20) with touch-none class for better mobile interaction
- Gray-400 drag handle color, hover to gray-600
- Placement number shown as `#{row.placement}` in a rounded badge
- All form fields arranged vertically with proper spacing
- Delete button positioned to the right of form fields

## State Structure
Manage the table data using a `useState` array of objects, where each object has:
- `id`: unique identifier (timestamp string)
- `placement`: number indicating row order (1, 2, 3, etc.) - automatically maintained during drag/drop and delete
- `camera`: string (camera name/ID)
- `time`: string (time value)
- `side`: string ('left' or 'right')

**Important:** 
- Placement is recalculated after drag operations and deletions
- Placement column is displayed in desktop view for easy reference
- CSV export includes placement for maintaining order on import

### State Update Functions

**updateRow Implementation:**
```jsx
const updateRow = (id, field, value) => {
  setRows((prevRows) =>
    prevRows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-set side based on camera value
        if (field === 'camera') {
          const cameraValue = value.toLowerCase();
          if (cameraValue.includes('cam1')) {
            updatedRow.side = 'left';
          } else if (cameraValue.includes('cam2')) {
            updatedRow.side = 'right';
          }
        }
        
        return updatedRow;
      }
      return row;
    })
  );
};
```
- **CRITICAL:** Must use functional setState `setRows((prevRows) => ...)` to ensure proper re-rendering
- **Auto-side setting:** When camera field is updated:
  - If camera value contains "Cam1" (case-insensitive), side auto-sets to "left" (L)
  - If camera value contains "Cam2", side auto-sets to "right" (R)
  - Users can still manually change the side after it's auto-set

**handleTimeBlur Implementation:**
```jsx
const handleTimeBlur = (id, value) => {
  if (!value || value.trim() === '') return;
  
  // Remove any non-digit and non-colon characters
  const cleanValue = value.replace(/[^\d:]/g, '');
  
  // Split by colon
  const parts = cleanValue.split(':').filter(part => part !== '');
  
  if (parts.length === 0) {
    // Show error alert
    return;
  }
  
  let hours = '00', minutes = '00', seconds = '00';
  
  if (parts.length === 1) {
    // Only one number - treat as seconds
    seconds = parts[0].padStart(2, '0');
  } else if (parts.length === 2) {
    // Two parts - treat as MM:SS
    minutes = parts[0].padStart(2, '0');
    seconds = parts[1].padStart(2, '0');
  } else if (parts.length >= 3) {
    // Three or more parts - treat as HH:MM:SS
    hours = parts[0].padStart(2, '0');
    minutes = parts[1].padStart(2, '0');
    seconds = parts[2].padStart(2, '0');
  }
  
  // Validate ranges
  const h = parseInt(hours);
  const m = parseInt(minutes);
  const s = parseInt(seconds);
  
  if (isNaN(h) || isNaN(m) || isNaN(s) || m > 59 || s > 59) {
    // Show error alert
    return;
  }
  
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  updateRow(id, 'time', formattedTime);
};
```
- **Time formatting on blur:** Automatically formats time input when user leaves the field
  - Single number (e.g., "45") → "00:00:45"
  - Two parts (e.g., "4:34") → "00:04:34"
  - Three parts (e.g., "1:23:45") → "01:23:45"
- **Validation:** Checks that minutes and seconds are 0-59, shows error alert if invalid
- **Must pass to child components:** Both SortableTableRow and SortableCard must receive `onTimeBlur` prop

**addRow Implementation:**
```jsx
const addRow = () => {
  // Get the last row to check if we should copy values
  const lastRow = rows[rows.length - 1];
  const shouldCopyValues = lastRow && lastRow.camera && lastRow.time;
  
  const newRow = {
    id: Date.now().toString(),
    camera: shouldCopyValues ? lastRow.camera : '',
    time: shouldCopyValues ? lastRow.time : '',
    side: shouldCopyValues ? lastRow.side : 'left',
    placement: rows.length + 1,
  };
  setRows([...rows, newRow]);
};
```
- **Auto-copy logic:** If the previous row has both camera and time values, copy them to new row
- Copies side value as well when auto-copying

## Output
Provide the complete code in a single file or clearly separated components. Include necessary imports and basic Tailwind configuration classes.

## Change Log
- **2026-02-14 (Initial):** Updated UI to match new design: simplified table layout, integrated delete button into Side column, updated button styles, added CSV export and Submit functionality, changed date format to MM/DD/YYYY, updated color scheme to use grays and reds.
- **2026-02-14 (Enhancement):** Added placement tracking to maintain row order during drag operations, fixed desktop drag with activation constraint (8px), removed all black colors.
- **2026-02-14 (Reset & CSV):** Added Reset button at top-right of date picker section, updated CSV export/import to include date in first line (format: `Date,YYYY-MM-DD`).
- **2026-02-14 (Accessibility):** Added unique `id` attributes to radio buttons and `htmlFor` to labels for proper association and accessibility.
- **2026-02-14 (State Fix):** Updated `updateRow` to use functional setState with `prevRows` to ensure proper re-rendering, added console logging for debugging state updates.
- **2026-02-14 (User Guide):** Added "How to Use" description section after title bar with comprehensive instructions on camera values, timestamp format, timing rules for different plays, and camera side selection.
- **2026-02-14 (Modal UI):** Converted "How to Use" section to a lightbulb button in title bar that opens a modal dialog, improved content presentation with better styling and scrollable content.
- **2026-02-14 (Alert Modals):** Replaced all browser `alert()` and `confirm()` dialogs with custom modal components for better UX consistency. Includes success messages (import, submit) and confirmation dialogs (reset table) with Cancel/Confirm buttons.
- **2026-02-14 (Email Feature):** Added "Email CSV" button that opens default email client with mailto: link to pvbarredo@gmail.com. Email includes CSV data in body for easy copy/paste. Changed button layout to responsive grid (2 cols mobile, 4 cols desktop).
- **2026-02-15 (Layout Update):** Centered title and subtitle in title bar, moved "How to Use" button to bottom-right of title bar in a separate div for better visual hierarchy.
- **2026-02-15 (Mobile UX):** Improved mobile drag functionality with larger touch target (size 24), added placement number display (#badge) at top of mobile cards, added touch-none class to drag handle for better mobile interaction.
- **2026-02-15 (Conditional Rendering):** Fixed double update trigger bug by implementing conditional rendering instead of CSS hiding for mobile/desktop views. Added isMobile state and useEffect hook for window resize detection.
- **2026-02-15 (User Guide Enhancement):** Added Action Buttons section to "How to Use" modal explaining Save CSV, Import CSV, Email CSV, and Submit functionality. Improved readability and added complete Filipino translations for all sections.
- **2026-02-15 (Content Alignment):** Updated HowToUseModal to left-align all content sections using `items-start` instead of `items-center` for improved readability while keeping modal centered on screen.
- **2026-02-16 (Auto-Copy Feature):** New row now automatically copies camera, time, and side values from previous row if both camera and time are filled.
- **2026-02-16 (Time Validation):** Added automatic time formatting on blur with HH:MM:SS validation. Partial inputs like "4:34" auto-format to "00:04:34". Shows error alert for invalid formats or out-of-range values (minutes/seconds > 59).
- **2026-02-16 (Auto-Side Setting):** Camera field now automatically sets side: Cam1 → Left (L), Cam2 → Right (R). Users can still manually change side after auto-setting.
- **2026-02-16 (Timing Rules Update):** Added "Good Move" to timing rules in How to Use modal (both English and Filipino) - allows highlighting impressive plays even without scoring.
