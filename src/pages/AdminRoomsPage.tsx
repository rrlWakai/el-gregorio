import { useEffect, useState } from 'react';
import { Plus, Pencil, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { roomsService } from '@/services/rooms';
import type { Room, RoomFormData } from '@/types';
import { formatPrice, slugify } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm: RoomFormData = {
  name: '',
  slug: '',
  description: '',
  capacity_min: 1,
  capacity_max: 2,
  base_price: 0,
  image_url: '',
  amenities: [],
  is_active: true,
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomFormData>(emptyForm);
  const [amenityInput, setAmenityInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = async () => {
    setLoading(true);
    const { data } = await roomsService.getAllRooms();
    if (data) setRooms(data);
    setLoading(false);
  };

  useEffect(() => { loadRooms(); }, []);

  const openCreate = () => {
    setEditRoom(null);
    setForm(emptyForm);
    setAmenityInput('');
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditRoom(room);
    setForm({
      name: room.name,
      slug: room.slug,
      description: room.description ?? '',
      capacity_min: room.capacity_min,
      capacity_max: room.capacity_max,
      base_price: room.base_price,
      image_url: room.image_url ?? '',
      amenities: room.amenities,
      is_active: room.is_active,
    });
    setAmenityInput('');
    setError(null);
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? Number(value)
        : value,
      ...(name === 'name' && !editRoom ? { slug: slugify(value) } : {}),
    }));
  };

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm(prev => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
    }
    setAmenityInput('');
  };

  const removeAmenity = (a: string) => {
    setForm(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== a) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || form.base_price <= 0) {
      setError('Name, slug, and base price are required.');
      return;
    }
    setSaving(true);
    setError(null);
    const result = editRoom
      ? await roomsService.updateRoom(editRoom.id, form)
      : await roomsService.createRoom(form);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setModalOpen(false);
    loadRooms();
  };

  const toggleActive = async (room: Room) => {
    await roomsService.toggleRoomActive(room.id, !room.is_active);
    loadRooms();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-gray-900 mb-1">Room Management</h1>
          <p className="font-body text-sm text-gray-500">{rooms.length} room(s) total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 
                     rounded-xl font-body text-sm font-medium hover:bg-primary-600 
                     transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
              <div className="h-40 bg-gray-100 rounded-xl mb-4" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {room.image_url && (
                <div className="h-40 overflow-hidden">
                  <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading text-base text-gray-900">{room.name}</h3>
                  <span className={`text-xs font-body px-2 py-0.5 rounded-full font-medium ${
                    room.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {room.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="font-body text-xs text-gray-500 mb-3 line-clamp-2">
                  {room.description}
                </p>
                <div className="flex items-center justify-between text-xs font-body text-gray-600 mb-4">
                  <span>{room.capacity_min}–{room.capacity_max} guests</span>
                  <span className="font-semibold text-primary">{formatPrice(room.base_price)}/night</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(room)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl 
                               border border-gray-200 text-gray-600 font-body text-xs 
                               hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(room)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl 
                                font-body text-xs transition-colors border ${
                                  room.is_active
                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                    : 'border-green-200 text-green-600 hover:bg-green-50'
                                }`}
                  >
                    {room.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {room.is_active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg 
                         max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-heading text-lg text-gray-900">
                  {editRoom ? 'Edit Room' : 'Add New Room'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="label-text">Room Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Family Room" />
                  </div>
                  <div className="col-span-2">
                    <label className="label-text">Slug</label>
                    <input name="slug" value={form.slug} onChange={handleChange} className="input-field" placeholder="family-room" />
                  </div>
                  <div className="col-span-2">
                    <label className="label-text">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="label-text">Min Capacity</label>
                    <input type="number" name="capacity_min" value={form.capacity_min} onChange={handleChange} min={1} className="input-field" />
                  </div>
                  <div>
                    <label className="label-text">Max Capacity</label>
                    <input type="number" name="capacity_max" value={form.capacity_max} onChange={handleChange} min={1} className="input-field" />
                  </div>
                  <div>
                    <label className="label-text">Base Price (₱)</label>
                    <input type="number" name="base_price" value={form.base_price} onChange={handleChange} min={0} className="input-field" />
                  </div>
                  <div>
                    <label className="label-text">Status</label>
                    <select name="is_active" value={form.is_active ? 'true' : 'false'}
                      onChange={e => setForm(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                      className="input-field">
                      <option value="true">Active</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="label-text">Image URL</label>
                    <input name="image_url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." />
                  </div>
                  <div className="col-span-2">
                    <label className="label-text">Amenities</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={amenityInput}
                        onChange={e => setAmenityInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                        placeholder="Add amenity..."
                        className="input-field flex-1 text-sm"
                      />
                      <button type="button" onClick={addAmenity} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-body hover:bg-primary-600 transition-colors">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.amenities.map(a => (
                        <span key={a} className="flex items-center gap-1 bg-primary/10 text-primary 
                                                  px-3 py-1 rounded-full text-xs font-body font-medium">
                          {a}
                          <button type="button" onClick={() => removeAmenity(a)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 font-body text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary text-white py-3 rounded-xl font-body 
                             font-semibold text-sm hover:bg-primary-600 disabled:opacity-60 
                             flex items-center justify-center gap-2 transition-colors"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Room'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
