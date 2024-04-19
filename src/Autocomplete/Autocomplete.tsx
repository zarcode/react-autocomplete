import React, { useEffect, useRef, useState } from "react";
import styles from "./Autocomplete.module.css";

interface AutocompleteProps<Value> {
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
    options,
    value,
    onChange,
    onInputChange,
    getOptionLabel = defaultGetOptionLabel,
  } = props;

  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);

  const derivedValue = value ? getOptionLabel(value) : "";

  useEffect(() => {
    setInputValue(derivedValue);
  }, [derivedValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    if (onInputChange) {
      onInputChange(event, newInputValue);
    }
    setInputValue(newInputValue);

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
      setInputValue(getOptionLabel(option));
      if (onChange) {
        onChange(event, option);
      }
    };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        // setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleMouseEnter = () => {
    setSelectedIndex(-1);
  };

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedIndex]);

  console.log("selectedIndex", selectedIndex);

  return (
    <div className={styles.autocomplete}>
      <input
        value={inputValue}
        type="text"
        className={styles["autocomplete-input"]}
        placeholder="Start typing..."
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {inputValue && (
        <ul ref={dropdownRef} className={styles["autocomplete-results"]}>
          {options.map((option, index) => (
            <li
              key={index}
              className={
                selectedIndex === index
                  ? `${styles["autocomplete-results-item"]} ${styles.selected}`
                  : styles["autocomplete-results-item"]
              }
              ref={(el) => {
                if (el) {
                  itemRefs.current[index] = el;
                }
              }}
              onClick={handleOptionSelect(option)}
              onMouseEnter={handleMouseEnter}
            >
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
