'use client';
type Note = { text: string; status: string; by: string; at: string };

export default function OrderNotes({ notes }: { notes: Note[] }) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="pt-3 mt-3 border-t border-border">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary mb-2">
        Activity ({notes.length})
      </div>
      <div className="space-y-2">
        {notes.map((n, i) => (
          <div key={i} className="flex gap-2 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold uppercase text-[10px] text-brand-accent">{n.status}</span>
                <span className="text-text-secondary text-[10px]">
                  {new Date(n.at).toLocaleString('en-PK')}
                </span>
                {n.by && <span className="text-text-secondary text-[10px]">· by {n.by}</span>}
              </div>
              <div className="text-text-primary mt-0.5">{n.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
