# Autocomplete Component

This project is an implementation of Autocomplete React Component, **without any dependencies, only pure React**, as well as a demonstration on how it can be used. It contains an example of usage that connects to [Harry Potter API](https://github.com/fedeperin/potterapi) to fetch character names. Users can search characters by first name by starting to type in the input field.

Try it out https://zarcode.github.io/react-autocomplete/

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- Node.js (preferred v18.18.0)
- npm (usually comes with Node.js)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

   This command will start the local development server.

## Using the Autocomplete Component

### Component Props

The `Autocomplete` component accepts several props to customize its behavior:

- **`label`** (string): Optional label for the input field. Helps users understand what information is requested.
- **`placeholder`** (string): Optional. A short hint that describes the expected value of the input field (e.g., "Type a character name").
- **`dropdownMaxHeight`** (string): Optional. The maximum height of the dropdown list in pixels. Defaults to 293 if not specified.
- **`loading`** (boolean): Optional. Indicates whether the autocomplete suggestions are being loaded. While `true`, it can display a loading indicator.
- **`options`** (array): Optional. An array of options that users can choose from.
- **`value`** (object | primitive value): Optional. The currently selected value from the options list. Should match the type of objects in the options array.
- **`onChange`** (function): Optional. A callback function that is called when the user selects a different option. It receives the event and the new value as arguments.
- **`onInputChange`** (function): Optional. A callback function that is triggered when the input value changes. It is called with the event and the new input value.
- **`getOptionLabel`** (function): Optional. A function that is used to determine the string to display for each option. Useful if options are objects.

