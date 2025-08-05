import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { setSession, setLoading } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, session, loading, initialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        dispatch(setSession(session));
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signIn = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signUp = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signOut = async () => {
    dispatch(setLoading(true));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    session,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
};