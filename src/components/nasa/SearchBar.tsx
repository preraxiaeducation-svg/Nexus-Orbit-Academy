interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function SearchBar({ value, onChange, onSubmit, loading }: SearchBarProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3 shadow-[0_0_25px_rgba(123,47,247,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSubmit()}
          placeholder="Search NASA imagery and missions"
          className="input-field sm:flex-1"
          aria-label="Search NASA imagery"
        />
        <button type="button" onClick={onSubmit} disabled={loading} className="btn-primary px-5 py-3 text-sm">
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
    </div>
  );
}
