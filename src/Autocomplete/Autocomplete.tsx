import React, { useEffect, useState } from "react";
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

  const handleOptionClick =
    (option: V) => (event: React.MouseEvent<HTMLLIElement>) => {
      setInputValue(getOptionLabel(option));
      if (onChange) {
        onChange(event, option);
      }
    };

  return (
    <div className={styles.autocomplete}>
      <input
        value={inputValue}
        type="text"
        className={styles["autocomplete-input"]}
        placeholder="Start typing..."
        onChange={handleInputChange}
      />
      {inputValue && (
        <ul className={styles["autocomplete-results"]}>
          {options.map((option, index) => (
            <li key={index} onClick={handleOptionClick(option)}>
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
