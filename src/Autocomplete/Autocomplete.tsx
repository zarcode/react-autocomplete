import React, { useEffect, useRef, useState } from "react";
import styles from "./Autocomplete.module.css";

function highlightMatch(text: string, query: string) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi")); // Split the text on the query text
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        className={styles["autocomplete__dropdown-item-text--highlight"]}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

interface AutocompleteProps<Value> {
  label?: string;
  placeholder?: string;
  loading: boolean;
  options: Value[];
  value: Value;
  onChange?: (event: React.SyntheticEvent, value: Value | null) => void;
  onInputChange?: (event: React.SyntheticEvent, value: string) => void;
  getOptionLabel?: (option: Value) => string;
}

function defaultGetOptionLabel<V>(option: V): string {
  return option == null ? "" : String(option);
}

export default function Autocomplete<V>(props: AutocompleteProps<V>) {
  const {
    label,
    placeholder = "",
    loading,
    options,
    value,
    onChange,
    onInputChange,
    getOptionLabel = defaultGetOptionLabel,
  } = props;

  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);

  const derivedValue = value ? getOptionLabel(value) : "";

  useEffect(() => {
    setInputValue(derivedValue);
  }, [derivedValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;

    setShowDropdown(newInputValue !== "");
    setInputValue(newInputValue);

    if (onInputChange) {
      onInputChange(event, newInputValue);
    }

    if (newInputValue === "") {
      if (onChange) {
        onChange(event, null);
      }
    }
  };

  const handleOptionSelect =
    (option: V) =>
    (
      event:
        | React.MouseEvent<HTMLLIElement>
        | React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (loading) {
        return;
      }

      const newInputValue = getOptionLabel(option);

      setInputValue(newInputValue);

      if (onInputChange) {
        onInputChange(event, newInputValue);
      }

      setShowDropdown(false);
      if (onChange) {
        onChange(event, option);
      }
    };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (loading) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < options.length) {
          handleOptionSelect(options[selectedIndex])(event);
          setSelectedIndex(-1);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleMouseEnter = () => {
    setSelectedIndex(-1);
  };

  const handleBlur = () => {
    // Delay hiding the dropdown to allow for clicks to be processed
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  const handleFocus = () => {
    if (inputValue) {
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedIndex]);

  return (
    <div className={styles.autocomplete}>
      {label ? (
        <label
          htmlFor="autocomplete_input"
          className={styles.autocomplete__label}
        >
          {label}
        </label>
      ) : null}
      <input
        id="autocomplete_input"
        value={inputValue}
        type="text"
        className={styles.autocomplete__input}
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="both"
      />
      {showDropdown && (
        <ul
          ref={dropdownRef}
          role="listbox"
          className={styles.autocomplete__dropdown}
        >
          {options.map((option, index) => (
            <li
              key={index}
              role="option"
              className={`${styles["autocomplete__dropdown-item"]} ${
                selectedIndex === index
                  ? styles["autocomplete__dropdown-item--selected"]
                  : ""
              }
              ${loading ? styles["autocomplete__dropdown-item--stale"] : ""}
              `}
              ref={(el) => {
                if (el) {
                  itemRefs.current[index] = el;
                }
              }}
              onClick={handleOptionSelect(option)}
              onMouseEnter={handleMouseEnter}
              aria-selected={selectedIndex === index}
            >
              {highlightMatch(getOptionLabel(option), inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
