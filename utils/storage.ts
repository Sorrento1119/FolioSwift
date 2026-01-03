import { PortfolioData } from '../types';
import { supabase } from './supabase';

export interface SavedSite {
  slug: string;
  data: PortfolioData;
  owner_email: string;
  updated_at: string;
}

export const storage = {
  // Save or Update a portfolio in the cloud
  saveSite: async (slug: string, data: PortfolioData, email: string, oldSlug?: string | null) => {
    // If we are renaming an existing site (slug changed)
    if (oldSlug && oldSlug !== slug) {
      const { error } = await supabase
        .from('portfolios')
        .update({
          slug,
          data,
          updated_at: new Date().toISOString()
        })
        .eq('slug', oldSlug)
        .eq('owner_email', email);

      if (error) {
        if (error.message.includes('unique constraint') || error.code === '23505') {
          throw new Error("This URL is already taken! Please try another one.");
        }
        throw error;
      }
      return;
    }

    // Otherwise, normal upsert (for new sites or updating content of same slug)
    const { error } = await supabase
      .from('portfolios')
      .upsert({
        slug,
        data,
        owner_email: email,
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });

    if (error) {
      if (error.message.includes('unique constraint') || error.code === '23505') {
        // If it's an upsert and we get a unique constraint error, 
        // it means either the slug is taken by someone else OR 
        // if there's a 1-site limit, the user already has a site.
        if (error.message.includes('owner_email')) {
          throw new Error("You already have a published portfolio. Try editing it instead of creating a new one!");
        }
        throw new Error("This URL is already taken!");
      }
      throw error;
    }
  },

  // Fetch a public site by its slug
  getSite: async (slug: string): Promise<PortfolioData | null> => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('data')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data.data as PortfolioData;
  },

  // Get all portfolios belonging to a specific user
  getUserSites: async (email: string): Promise<SavedSite[]> => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('owner_email', email)
      .order('updated_at', { ascending: false });

    if (error) return [];
    return data as any[];
  },

  // Delete a site by its slug
  deleteSite: async (slug: string) => {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('slug', slug);

    if (error) {
      throw error;
    }
  },

  // Delete all data for a specific user
  deleteAccount: async (email: string) => {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('owner_email', email);

    if (error) {
      throw error;
    }
  }
};