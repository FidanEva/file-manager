import { useState, useEffect } from "react";
import type { ViewerProps } from "../types/file.types";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[];

interface TreeNodeProps {
  keyName?: string;
  value: JsonValue;
  depth: number;
  defaultOpen?: boolean;
}

const TreeNode = ({ keyName, value, depth, defaultOpen = true }: TreeNodeProps) => {
  const [open, setOpen] = useState(defaultOpen && depth < 2);

  const isObj = value !== null && typeof value === "object";
  const isArr = Array.isArray(value);

  if (!isObj) {
    const type = value === null ? "null" : typeof value;
    return (
      <div className="jv-row" style={{ paddingLeft: depth * 16 }}>
        {keyName !== undefined && <span className="jv-key">"{keyName}"</span>}
        {keyName !== undefined && <span className="jv-colon">: </span>}
        <span className={`jv-val jv-val--${type}`}>
          {value === null ? "null" : type === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
    );
  }

  const entries = isArr
    ? (value as JsonArray).map((v, i) => [String(i), v] as [string, JsonValue])
    : Object.entries(value as JsonObject);

  const bracket = isArr ? ["[", "]"] : ["{", "}"];
  const count = entries.length;

  return (
    <div className="jv-node" style={{ paddingLeft: depth * 16 }}>
      <div className="jv-toggle" onClick={() => setOpen((o) => !o)}>
        <span className="jv-arrow">{open ? "▾" : "▸"}</span>
        {keyName !== undefined && <span className="jv-key">"{keyName}"</span>}
        {keyName !== undefined && <span className="jv-colon">: </span>}
        <span className="jv-bracket">{bracket[0]}</span>
        {!open && <span className="jv-count">{count} {isArr ? "items" : "keys"}</span>}
        {!open && <span className="jv-bracket">{bracket[1]}</span>}
      </div>
      {open && (
        <div className="jv-children">
          {entries.map(([k, v]) => (
            <TreeNode key={k} keyName={isArr ? undefined : k} value={v} depth={depth + 1} />
          ))}
          <div style={{ paddingLeft: 0 }}>
            <span className="jv-bracket">{bracket[1]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const JsonViewer = ({ file }: ViewerProps) => {
  const [data, setData] = useState<JsonValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(file.url)
      .then((r) => r.text())
      .then((text) => {
        setData(JSON.parse(text));
        setLoading(false);
      })
      .catch(() => {
        setError("Invalid JSON or failed to load");
        setLoading(false);
      });
  }, [file.url]);

  if (loading) return <div className="viewer-loading">Loading…</div>;
  if (error) return <div className="viewer-error">{error}</div>;

  return (
    <div className="json-viewer">
      <TreeNode value={data} depth={0} defaultOpen={true} />
    </div>
  );
};