export default function PolicyLayout({
  title, updated, sections,
}: {
  title: string;
  updated?: string;
  sections: { heading: string; body: string | string[] }[];
}) {
  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      <h1 className="text-4xl font-bold mb-3">{title}</h1>
      {updated && (
        <p className="text-sm text-text-secondary mb-10">
          Last updated: {updated}
        </p>
      )}

      <div className="bg-white border border-border rounded-2xl p-8 space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl font-bold mb-3 text-text-primary">{s.heading}</h2>
            {Array.isArray(s.body) ? (
              <ul className="space-y-2 text-sm text-text-secondary leading-relaxed">
                {s.body.map((line, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-brand-accent font-bold shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-text-secondary">
        Questions? <a href="/contact" className="text-brand-accent hover:underline font-semibold">Contact us</a> or call
        <a href="tel:+923397579547" className="text-brand-accent hover:underline font-semibold ml-1">+92 339 7579547</a>
      </div>
    </div>
  );
}
