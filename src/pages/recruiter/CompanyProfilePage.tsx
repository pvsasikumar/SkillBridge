import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useRecruiter } from '@/context/RecruiterContext';

export default function CompanyProfilePage() {
  const { company, updateCompany } = useRecruiter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...company });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateCompany(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Company Profile</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage your company information visible to candidates</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditing(false); setForm({ ...company }); }}>Cancel</Button>
            <Button onClick={handleSave}><span className="material-symbols-outlined text-[16px]">save</span> Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {saved && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl text-sm font-medium">
          Profile updated successfully.
        </div>
      )}

      <Card>
        <CardHeader title="Company Details" subtitle="Basic information about your organization" />
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="flex items-center gap-4 md:col-span-2">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-white">{company.name.charAt(0)}</span>
            </div>
            <div>
              {editing ? (
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Company Name" />
              ) : (
                <>
                  <h3 className="text-lg font-bold text-on-surface">{company.name}</h3>
                  <p className="text-sm text-on-surface-variant">{company.industry}</p>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
            {editing ? (
              <Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Company description" />
            ) : (
              <p className="text-sm text-on-surface-variant">{company.description}</p>
            )}
          </div>

          {editing ? (
            <>
              <Input label="Industry" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} icon={<span className="material-symbols-outlined text-[16px]">business</span>} />
              <Input label="Website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} icon={<span className="material-symbols-outlined text-[16px]">language</span>} />
              <Input label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} icon={<span className="material-symbols-outlined text-[16px]">location_on</span>} />
              <Input label="Contact Person" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} icon={<span className="material-symbols-outlined text-[16px]">person</span>} />
              <Input label="Contact Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} icon={<span className="material-symbols-outlined text-[16px]">mail</span>} />
            </>
          ) : (
            <>
              <InfoRow icon={<span className="material-symbols-outlined text-[16px]">business</span>} label="Industry" value={company.industry} />
              <InfoRow icon={<span className="material-symbols-outlined text-[16px]">language</span>} label="Website" value={company.website} />
              <InfoRow icon={<span className="material-symbols-outlined text-[16px]">location_on</span>} label="Location" value={company.location} />
              <InfoRow icon={<span className="material-symbols-outlined text-[16px]">person</span>} label="Contact Person" value={company.contactPerson} />
              <InfoRow icon={<span className="material-symbols-outlined text-[16px]">mail</span>} label="Contact Email" value={company.contactEmail} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-outline">{icon}</span>
      <div>
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="text-sm font-medium text-on-surface">{value}</p>
      </div>
    </div>
  );
}
