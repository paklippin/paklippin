'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';

type SocialLink = { platform: string; label: string; url: string; enabled: boolean };

const PLATFORM_PRESETS: Record<string, { label: string; emoji: string; placeholder: string }> = {
  facebook:  { label: 'Facebook',   emoji: '📘', placeholder: 'https://facebook.com/yourpage' },
  instagram: { label: 'Instagram',  emoji: '📷', placeholder: 'https://instagram.com/yourhandle' },
  whatsapp:  { label: 'WhatsApp',   emoji: '💬', placeholder: 'https://wa.me/923397579547' },
  tiktok:    { label: 'TikTok',     emoji: '🎵', placeholder: 'https://tiktok.com/@yourhandle' },
  youtube:   { label: 'YouTube',    emoji: '📺', placeholder: 'https://youtube.com/@yourchannel' },
  twitter:   { label: 'X (Twitter)', emoji: '🐦', placeholder: 'https://x.com/yourhandle' },
  linkedin:  { label: 'LinkedIn',   emoji: '💼', placeholder: 'https://linkedin.com/company/...' },
  snapchat:  { label: 'Snapchat',   emoji: '👻', placeholder: 'https://snapchat.com/add/...' },
  telegram:  { label: 'Telegram',   emoji: '✈️', placeholder: 'https://t.me/yourchannel' },
  pinterest: { label: 'Pinterest',  emoji: '📌', placeholder: 'https://pinterest.com/...' },
};

const DEFAULTS: SocialLink[] = [
  { platform: 'facebook',  label: 'Facebook',  url: '', enabled: false },
  { platform: 'instagram', label: 'Instagram', url: '', enabled: false },
  { platform: 'whatsapp',  label: 'WhatsApp',  url: '', enabled: false },
  { platform: 'tiktok',    label: 'TikTok',    url: '', enabled: false },
  { platform: 'youtube',   label: 'YouTube',   url: '', enabled: false },
  { platform: 'twitter',   label: 'X (Twitter)', url: '', enabled: false },
];

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialLink[]>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/social-links', { cache: 'no-store' });
        const json = await res.json();
        if (Array.isArray(json.links) && json.links.length) setLinks(json.links);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const update = (idx: number, patch: Partial<SocialLink>) => {
    setLinks((prev) => prev.map((l, i) => i === idx ? { ...l, ...patch } : l));
  };

  const addCustom = () => {
    const platform = prompt('Platform name (e.g. "threads")')?.toLowerCase().trim();
    if (!platform) return;
    const preset = PLATFORM_PRESETS[platform];
    setLinks((prev) => [...prev, {
      platform,
      label: preset?.label || platform,
      url: '',
      enabled: false,
    }]);
  };

  const remove = (idx: number) => {
    if (!confirm('Remove this social link?')) return;
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert('Save failed');
      }
    } catch { alert('Save failed'); }
    setSaving(false);
  };

  if (loading) return <p className="text-text-secondary text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Social Links</h1>
          <p className="text-sm text-text-secondary">
            Add social media icons that appear in the footer. Toggle each on/off.
          </p>
        </div>
        <button
          onClick={addCustom}
          className="flex items-center gap-2 bg-white border-2 border-border text-text-primary font-semibold px-4 py-2.5 rounded-lg hover:border-brand-accent hover:text-brand-accent transition text-sm"
        >
          <Plus size={16} /> Add Custom
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mb-5">
          ✓ Social links saved
        </div>
      )}

      <div className="space-y-3 max-w-[800px]">
        {links.map((link, idx) => {
          const preset = PLATFORM_PRESETS[link.platform] || { emoji: '🔗', label: link.label, placeholder: 'https://...' };
          return (
            <div key={idx}
              className={`bg-white border-2 rounded-2xl p-4 transition ${
                link.enabled ? 'border-green-300' : 'border-border opacity-70'
              }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  link.enabled ? 'bg-orange-50' : 'bg-brand-secondary'
                }`}>{preset.emoji}</div>

                <input
                  id={`social-label-${idx}`}
                  name={`social-label-${idx}`}
                  value={link.label}
                  onChange={(e) => update(idx, { label: e.target.value })}
                  className="flex-1 font-semibold text-sm bg-transparent border-b border-transparent hover:border-border focus:border-brand-accent outline-none py-1"
                />

                <button
                  onClick={() => update(idx, { enabled: !link.enabled })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    link.enabled
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-brand-secondary text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {link.enabled ? <><Eye size={14}/> ON</> : <><EyeOff size={14}/> OFF</>}
                </button>

                <button onClick={() => remove(idx)}
                  className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition" title="Remove">
                  <Trash2 size={16} />
                </button>
              </div>

              <input
                id={`social-url-${idx}`}
                name={`social-url-${idx}`}
                type="url"
                value={link.url}
                onChange={(e) => update(idx, { url: e.target.value })}
                placeholder={preset.placeholder}
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm font-mono"
              />

              {link.enabled && !link.url.trim() && (
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Toggle is ON but URL is empty — nothing will show in footer until you add a URL
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 max-w-[800px]">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-brand-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#e55a2b] transition disabled:opacity-60 text-sm">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Social Links'}
        </button>
        <p className="text-xs text-text-secondary text-center mt-3">
          Only <strong>ON</strong> platforms with a URL will appear in the footer.
        </p>
      </div>
    </div>
  );
}
