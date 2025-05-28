"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function StripeRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'cancelled' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const payment = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    console.log('🔄 Stripe redirect handler - Payment status:', payment);
    console.log('🔄 Session ID:', sessionId);

    const verifyPayment = async () => {
      if (payment === 'success' && sessionId) {
        try {
          // Get the authentication token
          const token = localStorage.getItem('access_token') || 
                        sessionStorage.getItem('access_token') ||
                        document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
          
          if (!token) {
            setStatus('error');
            setMessage('Authentication required. Please log in again.');
            setTimeout(() => {
              router.push('/auth/login');
            }, 3000);
            return;
          }

          console.log('🔑 Verifying payment with token:', token ? 'Token found' : 'No token');

          // Verify the payment with your backend
          const response = await fetch(`http://localhost:8000/api/payment/verify-session/${sessionId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          console.log('📡 Verification response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Verification error:', errorData);
            throw new Error(errorData.detail || 'Payment verification failed');
          }
          
          const result = await response.json();
          console.log('✅ Verification result:', result);
          
          if (result.success && result.payment_status === 'paid') {
            setStatus('success');
            setMessage('Your hackathon has been created successfully!');
            toast({
              title: "Payment Successful!",
              description: "Your hackathon has been created successfully.",
              duration: 5000,
            });
            
            // Redirect after successful verification
            setTimeout(() => {
              router.push('/dashboard/organizer/my-hackathons');
            }, 3000);
          } else {
            setStatus('error');
            setMessage('Payment verification failed. Please contact support.');
            setTimeout(() => {
              router.push('/dashboard/organizer/my-hackathons');
            }, 5000);
          }
        } catch (error) {
          console.error('💥 Payment verification error:', error);
          setStatus('error');
          setMessage('Failed to verify payment. Please contact support.');
          setTimeout(() => {
            router.push('/dashboard/organizer/my-hackathons');
          }, 5000);
        }
      } else if (payment === 'cancelled') {
        setStatus('cancelled');
        setMessage('Your payment was cancelled.');
        toast({
          title: "Payment Cancelled",
          description: "Your payment was cancelled. You can try again anytime.",
          variant: "destructive",
          duration: 5000,
        });
        
        setTimeout(() => {
          router.push('/dashboard/organizer/my-hackathons');
        }, 3000);
      } else {
        setStatus('error');
        setMessage('Invalid payment session.');
        setTimeout(() => {
          router.push('/dashboard/organizer/my-hackathons');
        }, 3000);
      }
    };

    if (!authLoading) {
      verifyPayment();
    }
  }, [searchParams, router, toast, authLoading]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Processing...
            </h2>
            <p className="text-slate-600">
              Please wait while we process your request.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          {status === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-slate-600 mb-4">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </div>
            </>
          )}
          
          {status === 'cancelled' && (
            <>
              <XCircle className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Payment Cancelled
              </h2>
              <p className="text-slate-600 mb-4">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Payment Error
              </h2>
              <p className="text-slate-600 mb-4">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </div>
            </>
          )}
          
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Verifying Payment...
              </h2>
              <p className="text-slate-600">
                Please wait while we confirm your payment.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}