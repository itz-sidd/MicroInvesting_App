import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { setProfile, setLoading, updateProfile } from '@/store/slices/userSlice';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    dispatch(setLoading(true));
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        dispatch(setProfile({ ...data, email: user.email || '' }));
      } else {
        // No profile exists yet, create a basic one
        dispatch(setProfile({ 
          id: user.id, 
          email: user.email || '', 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    dispatch(setLoading(true));
    try {
      // First try to update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              ...updates,
            })
            .select()
            .single();

          if (createError) throw createError;
          dispatch(setProfile({ ...newProfile, email: user.email || '' }));
        } else {
          throw error;
        }
      } else {
        dispatch(updateProfile(data));
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    profile,
    loading,
    updateUserProfile,
    fetchProfile,
  };
};