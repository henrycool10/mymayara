'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function StaffForm({ initial, onSaved, onCancel, showToast }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      // fill form for edit
      setFirstName(initial.firstName || '');
      setLastName(initial.lastName || '');
      setPosition(initial.position || '');
      setDepartment(initial.department || '');
      setEmail(initial.email || '');
      setPhone(initial.phone || '');
      setBio(initial.bio || '');
      setImage(null);
    } else {
      resetForm();
    }
  }, [initial]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPosition('');
    setDepartment('');
    setEmail('');
    setPhone('');
    setBio('');
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('position', position);
      formData.append('department', department);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('bio', bio);
      if (image) formData.append('image', image);

      if (initial?._id) {
        await axios.put(`/api/staff/${initial._id}`, formData);
        showToast?.('Staff updated', 'success');
        await onSaved?.();
        onCancel?.(); // close after edit
      } else {
        await axios.post('/api/staff', formData);
        showToast?.('Staff added', 'success');
        await onSaved?.();
        resetForm(); // stay open but clear inputs
      }
    } catch (err) {
      console.error('Failed to save staff', err);
      showToast?.('Failed to save staff', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-4 max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-700 text-center">
        {initial ? 'Edit Staff' : 'Add Staff'}
      </h2>

      <input
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="First Name"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Last Name"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        value={position}
        onChange={e => setPosition(e.target.value)}
        placeholder="Position"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        value={department}
        onChange={e => setDepartment(e.target.value)}
        placeholder="Department"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Phone"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <textarea
        value={bio}
        onChange={e => setBio(e.target.value)}
        placeholder="Bio"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        rows={4}
      />
      <input
        type="file"
        onChange={e => setImage(e.target.files[0])}
        className="text-gray-600 text-sm"
      />

      <div className="flex gap-4 justify-center mt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-all disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
