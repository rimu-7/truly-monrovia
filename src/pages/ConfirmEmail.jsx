// pages/ConfirmEmail.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserAuth } from '../../supabase/AuthContext';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      
      if (!token_hash || type !== 'email') {
        toast.error('Invalid confirmation link');
        setLoading(false);
        navigate('/');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          type: 'email',
          token_hash,
        });

        if (error) {
          throw error;
        }

        setConfirmed(true);
        toast.success('Email confirmed successfully!');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate(session ? '/dashboard' : '/login');
        }, 3000);
      } catch (error) {
        toast.error(`Confirmation failed: ${error.message}`);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate, session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Email Confirmation
        </h1>
        
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p>Verifying your email...</p>
          </div>
        ) : confirmed ? (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="mt-4 text-lg font-medium">
              Your email has been confirmed!
            </p>
            <p className="mt-2 text-gray-600">
              You'll be redirected shortly...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="mt-4 text-lg font-medium">
              Email confirmation failed
            </p>
            <p className="mt-2 text-gray-600">
              The confirmation link may be invalid or expired.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;