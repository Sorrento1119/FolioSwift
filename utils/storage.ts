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
  saveSite: async (slug: string, data: PortfolioData, email: string) => {
    const { error } = await supabase
      .from('portfolios')
      .upsert({
        slug,
        data,
        owner_email: email,
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });

    if (error) {
      if (error.message.includes('unique constraint')) throw new Error("This URL is already taken!");
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
  }
};