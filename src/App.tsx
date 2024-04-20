import "./App.css";
import CharactersSearch from "./CharactersSelect";

function App() {
  return (
    <div className="container">
      <CharactersSearch />
      <p>
        The component above connects to the Harry Potter API to fetch characters
        so you can select them. It's searching for a character by first name.
        Start by typing something.
      </p>
    </div>
  );
}

export default App;
