import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function VirtualKeyboard({ onKeyPress }) {
  return (
    <div className="mobile-keyboard">
      <Keyboard
        onKeyPress={onKeyPress}
        layout={{
          default: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M {bksp}",
          ],
        }}
        display={{
          "{bksp}": "←",
        }}
      />
    </div>
  );
}
