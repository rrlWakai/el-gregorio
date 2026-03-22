import { supabase } from '@/lib/supabase';
import type { Review, ReviewFormData, ApiResponse } from '@/types';

export const reviewsService = {
  async getVisibleReviews(): Promise<ApiResponse<Review[]>> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    return {
      data: data as Review[] | null,
      error: error?.message ?? null,
    };
  },

  async getAllReviews(): Promise<ApiResponse<Review[]>> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('sort_order', { ascending: true });

    return {
      data: data as Review[] | null,
      error: error?.message ?? null,
    };
  },

  async createReview(formData: ReviewFormData): Promise<ApiResponse<Review>> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([formData])
      .select()
      .single();

    return {
      data: data as Review | null,
      error: error?.message ?? null,
    };
  },

  async updateReview(
    id: string,
    updates: Partial<ReviewFormData>
  ): Promise<ApiResponse<Review>> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return {
      data: data as Review | null,
      error: error?.message ?? null,
    };
  },

  async toggleVisibility(
    id: string,
    isVisible: boolean
  ): Promise<ApiResponse<Review>> {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_visible: isVisible })
      .eq('id', id)
      .select()
      .single();

    return {
      data: data as Review | null,
      error: error?.message ?? null,
    };
  },

  async deleteReview(id: string): Promise<ApiResponse<null>> {
    const { error } = await supabase.from('reviews').delete().eq('id', id);

    return {
      data: null,
      error: error?.message ?? null,
    };
  },
};
