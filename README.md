# OPI Basketball Community - Highlight Extractor

A responsive web application for extracting and managing basketball game highlights for the OPI Basketball Community.

## Features

- **Bilingual Support:** Full interface available in English and Filipino
- **Responsive Design:** Optimized for both desktop and mobile devices
- **Drag & Drop:** Reorder highlight entries with intuitive drag-and-drop
- **CSV Operations:** Save and import CSV files with highlight data
- **Date Management:** Select game dates with a built-in date picker
- **Email Integration:** Quick submission via email to pvbarredo@gmail.com and peter.emmanuel.barredo@oocl.com
- **Time Search:** Search for existing entries within ±6 seconds with flexible input formats (SS, MM:SS, or HH:MM:SS)
- **Visual Markers:** New empty rows highlighted with yellow background until edited
- **Smart Auto-Copy:** New rows copy values from previous row when both camera and time are filled
- **Mobile Optimized:** Card-based layout with larger touch targets for mobile users

## Tech Stack

- **Framework:** React 19.2.0 with Vite
- **Styling:** Tailwind CSS 3
- **Drag & Drop:** @dnd-kit/core and @dnd-kit/sortable
- **Date Picker:** react-datepicker
- **Icons:** lucide-react

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This app is configured for deployment to GitHub Pages using GitHub Actions.

1. Enable GitHub Pages in your repository settings
2. Set the source to "GitHub Actions"
3. Push to the `main` branch to trigger automatic deployment

## Component Architecture

The application is modular with the following components:

- **DataEntryPage.jsx** - Main orchestrator component with search and submission logic
- **SortableTableRow.jsx** - Desktop table row with drag-and-drop and visual markers
- **SortableCard.jsx** - Mobile card layout with placement badges and visual markers
- **HowToUseModal.jsx** - Bilingual instruction modal
- **AlertModal.jsx** - Reusable alert/confirmation dialogs
- **SearchModal.jsx** - Time search modal with ±6 seconds range
- **DateSelector.jsx** - Game date picker
- **ActionButtons.jsx** - Save, Import, and Submit actions
- **Footer.jsx** - Attribution footer

## Usage

1. **Select Game Date:** Choose the date of the game
   - New empty rows appear with yellow background until edited
   - Time auto-formats on blur (e.g., "55" → "00:00:55", "12:45" → "00:12:45")
3. **Search Times:** Click "Search Time" to find existing entries within ±6 seconds
4. **Reorder:** Drag rows to change the highlight order
5. **Save/Import:** Export to CSV for backup or import previous work
6. **Submit:** Downloads CSV and emails highlights to pvbarredo@gmail.com and peter.emmanuel.barredo@oocl.com
   - **OOCL Outlook Users:** Change email sensitivity from "Restricted" to "Public" before sendingious work
5. **Submit:** Email your highlights to pvbarredo@gmail.com

## License

Created for the OPI Basketball Community
