/* eslint-disable react/prop-types */
import "/src/assets/CharacterList.css";

const CharacterList = ({ characters, onSelectCharacter, style }) => {
  return (
    <div className="character-list" style={style}>
      <h3>Who did you find?</h3>
      <ul>
        {characters.map((character, index) => (
          <li key={index}>
            <button onClick={() => onSelectCharacter(character)}>
              {character}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterList;
