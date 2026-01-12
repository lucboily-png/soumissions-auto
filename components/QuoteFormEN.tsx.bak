import { useState } from 'react';

export default function QuoteFormEN() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postalCode: '',
    year: '',
    brand: '',
    model: '',
    serviceType: '',
    urgency: '',
    description: '',
    preferred_contact: 'email',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: 'EN' }),
      });

      const data = await res.json();
      if (data.success) setMessage('Your request has been sent successfully!');
      else setMessage(data.message || 'An error occurred. Please try again.');
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Auto Repair Quote Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block mb-1">Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block mb-1">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Postal Code</label>
            <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block mb-1">Vehicle Year</label>
            <input type="text" name="year" value={form.year} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Brand</label>
            <input type="text" name="brand" value={form.brand} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Model</label>
            <input type="text" name="model" value={form.model} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Service Requested</label>
            <input type="text" name="serviceType" value={form.serviceType} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Urgency</label>
            <input type="text" name="urgency" value={form.urgency} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" rows={3}></textarea>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
}
