import { useState } from "react";
import "./teacher.css";

const API_URL =
  import.meta.env.VITE_LEVEL_GENERATOR_URL ?? "http://localhost:8000";

// Transforma o texto digitado em uma lista de palavras.
// Separa por vírgula e/ou espaço, porque o script Python compara palavra por palavra
// (ex.: "Star Wars" vira ["Star", "Wars"]). Remove duplicatas ignorando maiúsculas.
function parseIgnoredWords(value) {
  const words = value
    .split(/[,\s]+/)
    .map((word) => word.trim())
    .filter(Boolean);

  return [...new Map(words.map((w) => [w.toLowerCase(), w])).values()];
}

export default function TeacherDashboard() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("A1");
  const [text, setText] = useState("");
  const [ignoredWords, setIgnoredWords] = useState("");
  const [image, setImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setImage(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      setImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("The image must be 5 MB or smaller.");
      event.target.value = "";
      setImage(null);
      return;
    }

    setImage({ file });
  }

  function resetForm() {
    setName("");
    setText("");
    setIgnoredWords("");
    setImage(null);
    setFileInputKey((key) => key + 1); // limpa o campo de arquivo
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!image) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("level", level);
    formData.append("text", text.trim());
    formData.append(
      "ignoredWords",
      JSON.stringify(parseIgnoredWords(ignoredWords)),
    );
    formData.append("image", image.file);

    try {
      // Não defina Content-Type: o navegador faz isso (multipart/form-data)
      const response = await fetch(`${API_URL}/levels`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.detail ?? `Server error (${response.status}).`);
      }

      setSuccess(
        `Level created for ${data.name} (${data.level}) with ${data.words_placed} words.`,
      );
      resetForm();
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Could not reach the server. Please try again.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="teacher-dashboard">
      <header className="teacher-dashboard-header">
        <h1>Create new crossword levels</h1>
      </header>

      <div className="new-level-data">
        <p>Text: </p>

        <textarea
          className="textarea-new-level"
          id="biography"
          placeholder="Paste the text here..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={14}
          disabled={loading}
          required
          spellCheck={false}
        />
      </div>

      <div className="new-level-data">
        <p>Words to ignore</p>

        <textarea
          className="textarea-new-level"
          id="ignored-words"
          type="text"
          placeholder="Separate the words with commas or spaces"
          value={ignoredWords}
          onChange={(event) => setIgnoredWords(event.target.value)}
          disabled={loading}
          rows={5}
        />
      </div>

      <div className="title-level">
        <div>
          <label htmlFor="person-name">Title: </label>
          <input
            id="person-name"
            type="text"
            placeholder="Please enter the title"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="proficiency">English Proficiency Level </label>
          <select
            id="proficiency"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            disabled={loading}
            required
          >
            <option value="A1">A1 — Beginner</option>
            <option value="A2">A2 — Elementary</option>
            <option value="B1">B1 — Intermediate</option>
            <option value="B2">B2 — Upper Intermediate</option>
            <option value="C1">C1 — Advanced</option>
            <option value="C2">C2 — Proficient</option>
          </select>
        </div>
      </div>

      <div className="level-creation">
        <p>
          Upload image <span>(JPG, PNG, or WebP image - up to 5 MB)</span>
        </p>

        <input
          key={fileInputKey}
          id="person-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          disabled={loading}
          required
        />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="form-success" role="status">
          {success}
        </p>
      )}

      <button type="submit" className="generate-button" disabled={loading}>
        {loading ? "Generating..." : "Generate level"}
      </button>

      {loading && (
        <small>This can take a few seconds while the audio is generated.</small>
      )}
    </form>
  );
}
