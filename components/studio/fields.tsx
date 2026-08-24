"use client";

import { fileToCompressedDataUrl } from "@/lib/images";

export function TextField({
  label,
  hint,
  value,
  onChange,
  multiline,
  rows = 4,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          className="w-full resize-y rounded-none border border-line bg-ink px-3 py-2.5 text-[14px] leading-relaxed text-paper outline-none focus:border-[#c4a574]"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-none border border-line bg-ink px-3 py-2.5 text-[14px] text-paper outline-none focus:border-[#c4a574]"
        />
      )}
      {hint ? <span className="text-[12px] leading-5 text-mist/80">{hint}</span> : null}
    </label>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{label}</span>
      <div className="flex items-center gap-2 border border-line bg-ink px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-8 cursor-pointer border-0 bg-transparent"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-[13px] outline-none"
        />
      </div>
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{label}</span>
      <input
        value={value ?? ""}
        placeholder="URL da imagem"
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-line bg-ink px-3 py-2.5 text-[13px] outline-none focus:border-[#c4a574]"
      />
      <label className="cursor-pointer border border-dashed border-line px-3 py-4 text-center text-[12px] text-mist hover:border-[#c4a574]">
        ou carrega um ficheiro
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            onChange(await fileToCompressedDataUrl(file));
          }}
        />
      </label>
      {value ? (
        <img src={value} alt="" className="h-28 w-full object-cover" />
      ) : null}
    </div>
  );
}

export function ListEditor({
  label,
  hint,
  values,
  onChange,
  min = 3,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  min?: number;
}) {
  const items = values.length >= min ? values : [...values, ...Array(min - values.length).fill("")];
  return (
    <div className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{label}</span>
      {hint ? <p className="text-[12px] text-mist/80">{hint}</p> : null}
      <div className="grid gap-2">
        {items.map((item, index) => (
          <input
            key={index}
            value={item}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="w-full border border-line bg-ink px-3 py-2 text-[13px] outline-none focus:border-[#c4a574]"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="justify-self-start text-[12px] text-[#c4a574]"
      >
        + linha
      </button>
    </div>
  );
}
