import React, { useEffect, useState } from "react";
import styles from "./Autocomplete.module.css";

interface AutocompleteProps<Value> {
  options: Value[];
  value: Value;
  onChange?: (event: React.SyntheticEvent, value: Value | null) => void;
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
    getOptionLabel = defaultGetOptionLabel,
  } = props;

  const [inputValue, setInputValue] = useState("");

  const derivedValue = value ? getOptionLabel(value) : "";

  useEffect(() => {
    setInputValue(derivedValue);
  }, [derivedValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    if (newInputValue === "") {
      if (onChange) {
        onChange(event, null);
      }
    }
  };

  const handleOptionClick =
    (option: V) => (e: React.MouseEvent<HTMLLIElement>) => {
      setInputValue(getOptionLabel(option));
      if (onChange) {
        onChange(e, option);
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
        <ul id="autocomplete-results" className={styles["autocomplete-items"]}>
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
