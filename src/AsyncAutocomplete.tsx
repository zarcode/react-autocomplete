import { useState } from "react";
import "./App.css";
import { Autocomplete } from "./Autocomplete";

const dummyOptions = [
  { id: 1, title: "The Shawshank Redemption", year: 1994 },
  { id: 2, title: "The Godfather", year: 1972 },
  { id: 3, title: "The Godfather: Part II", year: 1974 },
  { id: 4, title: "The Dark Knight", year: 2008 },
  { id: 5, title: "12 Angry Men", year: 1957 },
  { id: 6, title: "Schindler's List", year: 1993 },
  { id: 7, title: "Pulp Fiction", year: 1994 },
  { id: 8, title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { id: 9, title: "The Good, the Bad and the Ugly", year: 1966 },
  { id: 10, title: "Fight Club", year: 1999 },
  {
    id: 11,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    id: 12,
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { id: 13, title: "Forrest Gump", year: 1994 },
  { id: 14, title: "Inception", year: 2010 },
  { id: 15, title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { id: 16, title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { id: 17, title: "Goodfellas", year: 1990 },
  { id: 18, title: "The Matrix", year: 1999 },
  { id: 19, title: "Seven Samurai", year: 1954 },
  { id: 20, title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { id: 21, title: "City of God", year: 2002 },
  { id: 22, title: "Se7en", year: 1995 },
  { id: 23, title: "The Silence of the Lambs", year: 1991 },
  { id: 24, title: "It's a Wonderful Life", year: 1946 },
  { id: 25, title: "Life Is Beautiful", year: 1997 },
  { id: 26, title: "The Usual Suspects", year: 1995 },
  { id: 27, title: "Léon: The Professional", year: 1994 },
  { id: 28, title: "Spirited Away", year: 2001 },
  { id: 29, title: "Saving Private Ryan", year: 1998 },
  { id: 30, title: "Once Upon a Time in the West", year: 1968 },
  { id: 31, title: "American History X", year: 1998 },
  { id: 32, title: "Interstellar", year: 2014 },
];

type Option = {
  id: number;
  title: string;
  year: number;
};

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

function getOptionLabel(option: Option | null) {
  return option ? option.title : "";
}

function AsyncAutocomplete() {
  const [value, setValue] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([...dummyOptions]);

  const handleSearch = async (term: string) => {
    await sleep(1000);
    setOptions(
      dummyOptions.filter((opt) =>
        getOptionLabel(opt).toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  console.log("value", value);

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, value) => setValue(value)}
      onInputChange={(_, text) => {
        handleSearch(text);
      }}
      getOptionLabel={getOptionLabel}
    />
  );
}

export default AsyncAutocomplete;