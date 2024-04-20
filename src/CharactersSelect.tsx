import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "./useDebounceCallback";
import { Autocomplete } from "./Autocomplete";

type Character = {
  fullName: string;
  nickname: string;
  hogwartsHouse: string;
  interpretedBy: string;
  children: string[];
  image: string;
  birthdate: string;
  index: number;
};

function getOptionLabel(option: Character | null) {
  return option ? option.fullName : "";
}

const searchCharacters = async (term: string) => {
  const res = await fetch(
    `https://potterapi-fedeperin.vercel.app/en/characters?search=${term}`
  );
  const characters = await res.json();

  return characters;
};

function CharactersSelect() {
  const [value, setValue] = useState<Character | null>(null);
  const [options, setOptions] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (!term) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const characters = await searchCharacters(term);

    setOptions(characters);
    setLoading(false);
  }, []);

  const debouncedSearch = useDebouncedCallback(handleSearch, 500);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Autocomplete
      ref={inputRef}
      label="Character"
      placeholder="Select a character"
      loading={loading}
      options={options}
      value={value}
      onChange={(_, value) => setValue(value)}
      onInputChange={(_, text) => {
        debouncedSearch(text);
      }}
      getOptionLabel={getOptionLabel}
    />
  );
}

export default CharactersSelect;
