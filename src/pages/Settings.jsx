import { useState } from 'react'
import { PageHeader } from '../components/ui'
import { useToast } from '../components/toast'

const TABS = ['Store', 'Profile', 'Notifications', 'Payments']

const INITIAL = {
  storeName: 'OJAIN — Pure Jain & Satvik',
  supportEmail: 'support@ojain.in',
  contact: '+91 98765 43210',
  description: 'Pure Jain & Satvik instant premix products with multiple flavour range.',
  fullName: 'Admin User',
  email: 'admin@ojain.in',
  password: '',
  notifyOrders: true,
  notifyStock: true,
  notifyVendors: false,
  notifyWeekly: true,
  payUpi: true,
  payCards: true,
  payCod: true,
  gst: '24ABCDE1234F1Z5',
}

export default function Settings() {
  const toast = useToast()
  const [tab, setTab] = useState('Store')
  const [form, setForm] = useState(INITIAL)
  const [saved, setSaved] = useState(INITIAL)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setBool = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)

  const save = () => {
    setSaved(form)
    toast('Settings saved')
  }
  const cancel = () => {
    setForm(saved)
    toast('Changes discarded', 'info')
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your store configuration and preferences" />

      <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? 'border-brand-600 text-brand-700 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card max-w-2xl p-6">
        {tab === 'Store' && (
          <div className="space-y-4">
            <Field label="Store Name" value={form.storeName} onChange={set('storeName')} />
            <Field label="Support Email" value={form.supportEmail} onChange={set('supportEmail')} />
            <Field label="Contact Number" value={form.contact} onChange={set('contact')} />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Store Description</label>
              <textarea className="input h-24 resize-none" value={form.description} onChange={set('description')} />
            </div>
          </div>
        )}
        {tab === 'Profile' && (
          <div className="space-y-4">
            <Field label="Full Name" value={form.fullName} onChange={set('fullName')} />
            <Field label="Email" value={form.email} onChange={set('email')} />
            <Field label="New Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
          </div>
        )}
        {tab === 'Notifications' && (
          <div className="space-y-4">
            <Toggle label="New order alerts" on={form.notifyOrders} onChange={setBool('notifyOrders')} />
            <Toggle label="Low stock warnings" on={form.notifyStock} onChange={setBool('notifyStock')} />
            <Toggle label="New vendor applications" on={form.notifyVendors} onChange={setBool('notifyVendors')} />
            <Toggle label="Weekly sales summary email" on={form.notifyWeekly} onChange={setBool('notifyWeekly')} />
          </div>
        )}
        {tab === 'Payments' && (
          <div className="space-y-4">
            <Toggle label="UPI" on={form.payUpi} onChange={setBool('payUpi')} />
            <Toggle label="Credit / Debit Cards" on={form.payCards} onChange={setBool('payCards')} />
            <Toggle label="Cash on Delivery" on={form.payCod} onChange={setBool('payCod')} />
            <Field label="GST Number" value={form.gst} onChange={set('gst')} />
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button className="btn-primary disabled:opacity-50" onClick={save} disabled={!dirty}>Save Changes</button>
          <button className="btn-ghost" onClick={cancel} disabled={!dirty}>Cancel</button>
          {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
        </div>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input className="input" {...props} />
    </div>
  )
}

function Toggle({ label, on, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!on)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-brand-500' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
