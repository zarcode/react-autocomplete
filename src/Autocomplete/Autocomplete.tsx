import React, { forwardRef, useEffect, useRef, useState } from "react";
import styles from "./Autocomplete.module.css";

const DROPDOWN_MAXHEIGHT = 293;

function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;

  const escapedQuery = escapeRegExp(query);
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi")); // Split the text on the query text
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
  dropdownMaxHeight?: number;
  renderEmpty?: ({ loading }: { loading?: boolean }) => React.ReactNode;
  placeholder?: string;
  loading?: boolean;
  options?: Value[];
  value?: Value;
  onChange?: (event: React.SyntheticEvent, value: Value | null) => void;
  onInputChange?: (event: React.SyntheticEvent, value: string) => void;
  getOptionLabel?: (option: Value) => string;
}

function defaultGetOptionLabel<V>(option: V): string {
  return option == null ? "" : String(option);
}

function DefaultEmptyList({ loading }: { loading: boolean }) {
  return (
    <div
      className={`${styles["autocomplete__dropdown-empty"]} ${
        loading ? styles["autocomplete__dropdown-empty--stale"] : ""
      }`}
    >
      No items
    </div>
  );
}

function AutocompleteCore<V>(
  props: AutocompleteProps<V>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    label,
    placeholder = "",
    dropdownMaxHeight = DROPDOWN_MAXHEIGHT,
    renderEmpty,
    loading = false,
    options = [],
    value,
    onChange,
    onInputChange,
    getOptionLabel = defaultGetOptionLabel,
  } = props;

  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownAbove, setDropdownAbove] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleResize = () => {
      if (inputWrapperRef.current) {
        const inputRect = inputWrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;

        if (spaceBelow < dropdownMaxHeight && spaceAbove > dropdownMaxHeight) {
          setDropdownAbove(true);
        } else {
          setDropdownAbove(false);
        }
      }
    };

    // Run once on mount
    handleResize();

    // Add resize listener to adjust on window resize
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dropdownMaxHeight]);

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
      <div
        ref={inputWrapperRef}
        className={styles["autocomplete__input-wrapper"]}
      >
        <input
          id="autocomplete_input"
          ref={ref}
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
          <div
            ref={dropdownRef}
            className={styles["autocomplete__dropdown"]}
            style={{
              maxHeight: DROPDOWN_MAXHEIGHT,
              bottom: dropdownAbove ? "100%" : undefined,
              top: dropdownAbove ? undefined : "100%",
            }}
          >
            {options.length > 0 ? (
              <ul
                role="listbox"
                className={`${styles["autocomplete__dropdown-list"]} ${
                  loading ? styles["autocomplete__dropdown-list--loading"] : ""
                }`}
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
            ) : typeof renderEmpty === "function" ? (
              renderEmpty({ loading })
            ) : (
              <DefaultEmptyList loading={loading} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const Autocomplete = forwardRef(AutocompleteCore) as <V>(
  props: AutocompleteProps<V> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof AutocompleteCore>;

export default Autocomplete;
