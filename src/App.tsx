import PrismComponents from "../lib/components.json";
import { useLayoutEffect, useRef } from "react";
import { usePersistentState } from "./usePersistentState";
import { Theme, themes } from "./themes";

const initialLang = "tsx";
const initialCode = `\
// 3... 2... 1... Blast-off!
async function countdown(): Promise<void> {
  for (let i = 10; i > 0; i--) {
    console.log(i);
    await sleep(1000);
  }
  console.log("Blast-off!");
}

/**
 * \`setTimeout\` for \`delay\` miliseconds
 */
async function sleep(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

countdown();
`;

// Return an object sorted by its values so we don't have to maintain correct
// order in the source code
function sortObject<TObject extends object>(object: TObject): TObject {
  const ret: Record<string, any> = {};
  const pairs = Object.entries(object);
  pairs.sort(([_keyA, valA], [_keyB, valB]) => {
    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
  for (const [key, val] of pairs) {
    ret[key] = val;
  }
  return ret as TObject;
}

const languages = (() => {
  const obj = Object.fromEntries(
    Object.entries(PrismComponents.languages).flatMap(([key, val]) => {
      if (key === "meta" || !("title" in val)) {
        return [];
      }
      return [[key, val.title]];
    })
  );
  // "HTML" is called "Markup" by default which is not very descriptive
  obj.markup = "HTML";
  return sortObject(obj);
})();

function* walk(root: HTMLElement): Generator<HTMLElement> {
  yield root;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node: Node | null = walker.currentNode;
  while (node) {
    if (node instanceof HTMLElement) {
      yield node;
    }
    node = walker.nextNode();
  }
}

type ThemeName = keyof typeof themes;

function isThemeID(x: unknown): x is ThemeName {
  return typeof x === "string" && themes.hasOwnProperty(x);
}

export function App(): JSX.Element {
  const preRef = useRef<HTMLPreElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = usePersistentState("language", initialLang);
  const [code, setCode] = usePersistentState("code", initialCode);
  const [themeID, setThemeID] = usePersistentState(
    "theme_id",
    themes.toxic._meta.id
  );
  const [includeLink, setIncludeLink] = usePersistentState("includeLink", true);

  const themeKey = isThemeID(themeID) ? themeID : "toxic";
  const theme: Theme = themes[themeKey] || themes.toxic;

  function inlineStyles(root: HTMLElement) {
    root.className = "_root";
    for (const elem of walk(root)) {
      for (const cls of elem.classList) {
        const themeObj = theme[cls] || {};
        // Reset styles to avoid leaking styles between themes
        elem.removeAttribute("style");
        for (const [key, val] of Object.entries(themeObj)) {
          elem.style.setProperty(key, val);
        }
      }
      // Leave the class in local development for easier theme debugging
      if (localStorage.debug !== "true") {
        elem.removeAttribute("class");
      }
    }
  }

  useLayoutEffect(() => {
    if (!preRef.current) {
      return;
    }
    const pre = preRef.current;
    pre.innerHTML = "";
    const codeElement = document.createElement("code");
    codeElement.className = `language-${lang}`;
    codeElement.textContent = code || " ";
    pre.appendChild(codeElement);
    Prism.highlightAllUnder(pre);
    // Prism removes all your classes
    pre.classList.add("_root");
    inlineStyles(pre);
  });

  function loadFromFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async () => {
      const [file] = input.files || [];
      if (!file) {
        return;
      }
      const text = await file.text();
      setCode(text);
    };
    input.click();
  }

  function copyAsHTML() {
    if (!proseRef.current) {
      alert("Failed to copy to clipboard");
      return;
    }
    navigator.clipboard.writeText(proseRef.current.innerHTML);
  }

  return (
    <main className="flex flex-column gap3">
      <div className="flex flex-wrap items-end gap3">
        <div className="flex flex-column gap1">
          <label className="bit-label" htmlFor="form-lang">
            Language
          </label>
          <select
            id="form-lang"
            className="bit-select"
            value={lang}
            onChange={(event) => {
              setLang(event.target.value);
            }}
          >
            {Object.entries(languages).map(([key, val]) => {
              return (
                <option key={key} value={key}>
                  {val}
                </option>
              );
            })}
          </select>
        </div>
        <button className="bit-button" type="button" onClick={loadFromFile}>
          Load text from file&hellip;
        </button>
      </div>
      <div className="flex flex flex-column gap1">
        <label className="bit-label" htmlFor="form-code">
          Paste text here
        </label>
        <textarea
          id="form-code"
          className="bit-input code-input"
          spellCheck="false"
          rows={10}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
          }}
        />
      </div>
      <div className="flex flex-wrap gap3 items-end">
        <div className="flex flex-column gap1">
          <label className="bit-label" htmlFor="form-theme">
            Theme
          </label>
          <select
            id="form-theme"
            className="bit-select"
            value={themeID}
            onChange={(event) => {
              setThemeID(event.target.value);
            }}
          >
            {Object.entries(themes).map(([key, val]) => {
              return (
                <option key={key} value={key}>
                  {val._meta.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex-auto" />
        <div className="flex flex-wrap gap3 items-center">
          <label className="bit-field flex flex-wrap gap1 items-center">
            <input
              className="bit-checkbox"
              type="checkbox"
              checked={includeLink}
              onChange={(event) => {
                setIncludeLink(event.target.checked);
              }}
            />
            <div>Include link to codehost</div>
          </label>
          <button className="bit-button" type="button" onClick={copyAsHTML}>
            Copy as HTML
          </button>
        </div>
      </div>

      <output className="code-output">
        <article>
          <header>
            <b>Preview</b> @cohost
          </header>
          <hr />
          <main>
            <h1>Your post title</h1>
            <div className="prose" ref={proseRef}>
              <pre ref={preRef} />
              {includeLink && (
                <div style={theme._footer}>
                  syntax highlighting by{" "}
                  <a
                    href="https://codehost.wavebeem.com"
                    style={{ fontWeight: "bolder" }}
                  >
                    codehost
                  </a>
                </div>
              )}
            </div>
            <aside>
              <small>#codehost</small>
            </aside>
          </main>
          <hr />
          <footer>0 comments</footer>
        </article>
      </output>
    </main>
  );
}
