// supabase/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase_client";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUpNewUser = async (name, email, password) => {
    try {
      // Show loading toast
      const toastId = toast.loading("Creating your account...");
      
      // First, sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) {
        toast.update(toastId, {
          render: `Signup failed`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        throw authError;
      }

      // If signup is successful, add the user to admin_info_only table
      const { data: adminData, error: adminError } = await supabase
        .from("admin")
        .insert([{
          new_id: authData.user.id,
          email: email,
          name: name,
        }])
        .select();

      if (adminError) {
        toast.update(toastId, {
          render: `Account created but profile setup failed`,
          type: "warning",
          isLoading: false,
          autoClose: 5000,
        });
        // Rollback: Delete the auth user if table insertion fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw adminError;
      }

      toast.update(toastId, {
        render: "Account created successfully! Please check your email to verify your account.",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      return {
        success: true,
        data: {
          auth: authData,
          admin: adminData,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "An error occurred during sign-up.",
      };
    }
  };

  const signInUser = async (email, password) => {
    const toastId = toast.loading("Signing in...");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.update(toastId, {
          render: `Login failed: ${error.message}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        return { success: false};
      }

      toast.update(toastId, {
        render: "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return { success: true, data };
    } catch (error) {
      toast.update(toastId, {
        render: "An unexpected error occurred during login",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return { success: false };
    }
  };

  const logOutUser = async () => {
    const toastId = toast.loading("Signing out...");
    try {
      await supabase.auth.signOut();
      toast.update(toastId, {
        render: "You've been signed out successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: `Logout failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  // Add to your AuthContext.js
const resendConfirmationEmail = async (email) => {
  try {
    const toastId = toast.loading('Sending confirmation email...');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      toast.update(toastId, {
        render: `Failed to resend`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      throw error;
    }

    toast.update(toastId, {
      render: 'Confirmation email sent! Please check your inbox.',
      type: 'success',
      isLoading: false,
      autoClose: 5000,
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};


  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signInUser, logOutUser, resendConfirmationEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);