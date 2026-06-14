"use client";

import { useMemo, useState } from "react";

type Matrix = number[][];

const embeddingSize = 4;
const defaultPrompt = "we need context now";

function tokenize(input: string) {
  const tokens = input
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);

  return tokens.length > 0 ? tokens : defaultPrompt.split(" ");
}

function hashToken(token: string, salt: number) {
  let hash = 2166136261 + salt * 16777619;

  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index) + salt;
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function tokenEmbedding(token: string) {
  return Array.from({ length: embeddingSize }, (_, index) => {
    const raw = hashToken(token.toLowerCase(), index + 1) % 2000;
    return Number(((raw / 1000 - 1) * 0.9).toFixed(2));
  });
}

function project(vectors: Matrix, weights: Matrix) {
  return vectors.map((vector) =>
    weights[0].map((_, column) =>
      Number(
        vector
          .reduce((total, value, row) => total + value * weights[row][column], 0)
          .toFixed(3),
      ),
    ),
  );
}

function dot(left: number[], right: number[]) {
  return left.reduce((total, value, index) => total + value * right[index], 0);
}

function softmax(values: number[]) {
  const maxValue = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - maxValue));
  const sum = exps.reduce((total, value) => total + value, 0);

  return exps.map((value) => value / sum);
}

function weightedSum(weights: number[], values: Matrix) {
  return values[0].map((_, column) =>
    Number(
      weights
        .reduce((total, weight, row) => total + weight * values[row][column], 0)
        .toFixed(3),
    ),
  );
}

function scaledDotProductAttention(
  queries: Matrix,
  keys: Matrix,
  values: Matrix,
  masked: boolean,
) {
  const scale = Math.sqrt(keys[0].length);
  const scores = queries.map((query, queryIndex) =>
    keys.map((key, keyIndex) => {
      if (masked && keyIndex > queryIndex) {
        return Number.NEGATIVE_INFINITY;
      }

      return dot(query, key) / scale;
    }),
  );
  const weights = scores.map((row) => softmax(row));
  const outputs = weights.map((row) => weightedSum(row, values));

  return { scores, weights, outputs };
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return value.toFixed(2);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

const queryWeights: Matrix = [
  [0.8, -0.25, 0.35, 0.1],
  [0.15, 0.7, -0.2, 0.45],
  [-0.35, 0.25, 0.85, -0.15],
  [0.25, 0.2, 0.1, 0.75],
];

const keyWeights: Matrix = [
  [0.65, 0.1, -0.4, 0.25],
  [-0.15, 0.9, 0.2, -0.2],
  [0.3, -0.25, 0.7, 0.35],
  [0.2, 0.35, -0.1, 0.8],
];

const valueWeights: Matrix = [
  [0.55, -0.15, 0.25, 0.35],
  [0.2, 0.65, 0.1, -0.25],
  [-0.3, 0.35, 0.75, 0.15],
  [0.4, 0.05, -0.2, 0.7],
];

export default function Home() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [masked, setMasked] = useState(false);

  const model = useMemo(() => {
    const tokens = tokenize(prompt);
    const embeddings = tokens.map(tokenEmbedding);
    const queries = project(embeddings, queryWeights);
    const keys = project(embeddings, keyWeights);
    const values = project(embeddings, valueWeights);
    const attention = scaledDotProductAttention(queries, keys, values, masked);

    return { tokens, embeddings, queries, keys, values, attention };
  }, [prompt, masked]);

  const activeRow = model.attention.weights.at(-1) ?? [];
  const activeOutput = model.attention.outputs.at(-1) ?? [];

  return (
    <main className="page">
      <section className="hero" aria-labelledby="title">
        <div>
          <p className="eyebrow">Transformer attention</p>
          <h1 id="title">Scaled dot-product attention, running live.</h1>
        </div>
        <div className="formula" aria-label="Attention equation">
          <span>Attention(Q, K, V)</span>
          <strong>= softmax(QK^T / sqrt(d_k))V</strong>
        </div>
      </section>

      <section className="controls" aria-label="Attention inputs">
        <label className="prompt-field">
          <span>Tokens</span>
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={defaultPrompt}
          />
        </label>
        <label className="toggle">
          <input
            checked={masked}
            onChange={(event) => setMasked(event.target.checked)}
            type="checkbox"
          />
          <span>Causal mask</span>
        </label>
      </section>

      <section className="workspace">
        <article className="panel token-panel">
          <div className="panel-heading">
            <p className="eyebrow">Step 1</p>
            <h2>Token embeddings</h2>
          </div>
          <div className="token-list">
            {model.tokens.map((token, index) => (
              <div className="token" key={`${token}-${index}`}>
                <span>{token}</span>
                <small>{model.embeddings[index].map(formatNumber).join("  ")}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel matrix-panel">
          <div className="panel-heading">
            <p className="eyebrow">Step 2</p>
            <h2>Query, key, and value projections</h2>
          </div>
          <div className="projection-grid">
            <ProjectionTable label="Q" matrix={model.queries} tokens={model.tokens} />
            <ProjectionTable label="K" matrix={model.keys} tokens={model.tokens} />
            <ProjectionTable label="V" matrix={model.values} tokens={model.tokens} />
          </div>
        </article>

        <article className="panel heatmap-panel">
          <div className="panel-heading">
            <p className="eyebrow">Step 3</p>
            <h2>Attention weights</h2>
          </div>
          <div
            className="attention-grid"
            style={{ "--token-count": model.tokens.length } as React.CSSProperties}
          >
            <span />
            {model.tokens.map((token, index) => (
              <b key={`column-${token}-${index}`}>{token}</b>
            ))}
            {model.tokens.map((token, rowIndex) => (
              <RowCells
                key={`row-${token}-${rowIndex}`}
                rowIndex={rowIndex}
                scores={model.attention.scores[rowIndex]}
                token={token}
                weights={model.attention.weights[rowIndex]}
              />
            ))}
          </div>
        </article>

        <article className="panel result-panel">
          <div className="panel-heading">
            <p className="eyebrow">Step 4</p>
            <h2>Weighted value output</h2>
          </div>
          <div className="bars" aria-label="Attention distribution for final token">
            {model.tokens.map((token, index) => (
              <div className="bar-row" key={`bar-${token}-${index}`}>
                <span>{token}</span>
                <div>
                  <i style={{ width: formatPercent(activeRow[index] ?? 0) }} />
                </div>
                <strong>{formatPercent(activeRow[index] ?? 0)}</strong>
              </div>
            ))}
          </div>
          <div className="output-vector">
            {activeOutput.map((value, index) => (
              <span key={`output-${index}`}>{formatNumber(value)}</span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

function ProjectionTable({
  label,
  matrix,
  tokens,
}: {
  label: string;
  matrix: Matrix;
  tokens: string[];
}) {
  return (
    <div className="projection">
      <h3>{label}</h3>
      <table>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={`${label}-${tokens[rowIndex]}-${rowIndex}`}>
              <th>{tokens[rowIndex]}</th>
              {row.map((value, columnIndex) => (
                <td key={`${label}-${rowIndex}-${columnIndex}`}>{formatNumber(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowCells({
  rowIndex,
  scores,
  token,
  weights,
}: {
  rowIndex: number;
  scores: number[];
  token: string;
  weights: number[];
}) {
  return (
    <>
      <strong>{token}</strong>
      {weights.map((weight, columnIndex) => {
        const maskedCell = !Number.isFinite(scores[columnIndex]);

        return (
          <span
            className={maskedCell ? "masked-cell" : undefined}
            key={`${rowIndex}-${columnIndex}`}
            style={
              {
                "--weight": maskedCell ? 0 : weight,
              } as React.CSSProperties
            }
            title={`score ${formatNumber(scores[columnIndex])}`}
          >
            {maskedCell ? "masked" : formatPercent(weight)}
          </span>
        );
      })}
    </>
  );
}
