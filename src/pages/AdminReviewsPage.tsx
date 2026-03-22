import { useEffect, useState } from 'react';
import { Plus, Pencil, Eye, EyeOff, Star, X, Loader2 } from 'lucide-react';
import { reviewsService } from '@/services/reviews';
import type { Review, ReviewFormData } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm: ReviewFormData = {
  guest_name: '',
  avatar_url: '',
  rating: 5,
  review_text: '',
  is_visible: true,
  sort_order: 0,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [form, setForm] = useState<ReviewFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    const { data } = await reviewsService.getAllReviews();
    if (data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => { loadReviews(); }, []);

  const openCreate = () => {
    setEditReview(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (review: Review) => {
    setEditReview(review);
    setForm({
      guest_name: review.guest_name,
      avatar_url: review.avatar_url ?? '',
      rating: review.rating,
      review_text: review.review_text,
      is_visible: review.is_visible,
      sort_order: review.sort_order,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
        : type === 'number' ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guest_name || !form.review_text) {
      setError('Guest name and review text are required.');
      return;
    }
    setSaving(true);
    setError(null);
    const result = editReview
      ? await reviewsService.updateReview(editReview.id, form)
      : await reviewsService.createReview(form);
    setSaving(false);
    if (result.error) { setError(result.error); return; }
    setModalOpen(false);
    loadReviews();
  };

  const toggleVisible = async (review: Review) => {
    await reviewsService.toggleVisibility(review.id, !review.is_visible);
    loadReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await reviewsService.deleteReview(id);
    loadReviews();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-gray-900 mb-1">Reviews Management</h1>
          <p className="font-body text-sm text-gray-500">{reviews.length} review(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 
                     rounded-xl font-body text-sm font-medium hover:bg-primary-600 
                     transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-body text-sm font-semibold text-gray-800">
                      {review.guest_name}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'text-accent fill-accent' : 'text-gray-200 fill-gray-200'
                        }`} />
                      ))}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${
                      review.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {review.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">
                    {review.review_text}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(review)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleVisible(review)} className={`p-2 rounded-lg transition-colors ${
                    review.is_visible ? 'hover:bg-red-50 text-red-400' : 'hover:bg-green-50 text-green-500'
                  }`}>
                    {review.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteReview(review.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400">
                    <X className="w-4 h-4" />
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-heading text-lg text-gray-900">
                  {editReview ? 'Edit Review' : 'Add Review'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="label-text">Guest Name</label>
                  <input name="guest_name" value={form.guest_name} onChange={handleChange} className="input-field" placeholder="Maria Santos" />
                </div>
                <div>
                  <label className="label-text">Avatar URL (Optional)</label>
                  <input name="avatar_url" value={form.avatar_url} onChange={handleChange} className="input-field" placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Rating</label>
                    <select name="rating" value={form.rating} onChange={handleChange} className="input-field">
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Sort Order</label>
                    <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label-text">Review Text</label>
                  <textarea name="review_text" value={form.review_text} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Guest review..." />
                </div>
                <div>
                  <label className="label-text">Visibility</label>
                  <select name="is_visible" value={form.is_visible ? 'true' : 'false'}
                    onChange={e => setForm(prev => ({ ...prev, is_visible: e.target.value === 'true' }))}
                    className="input-field">
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
                {error && <p className="text-red-600 font-body text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200">{error}</p>}
                <button type="submit" disabled={saving}
                  className="w-full bg-primary text-white py-3 rounded-xl font-body font-semibold 
                             text-sm hover:bg-primary-600 disabled:opacity-60 flex items-center 
                             justify-center gap-2 transition-colors">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Review'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
