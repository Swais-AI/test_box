'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setIndustry } from '../../store/slices/userSlice';
import ChangeIndustryModal from '../../components/ChangeIndustryModal';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, industry } = useSelector(state => state.user);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user from our backend via http-only cookie
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/user/me', {
      credentials: 'include' // needed for http-only cookies
    })
    .then(res => {
      if (!res.ok) throw new Error('Unauthenticated');
      return res.json();
    })
    .then(data => {
      dispatch(setUser(data));
      if (data.user_type) {
        dispatch(setIndustry(data.user_type));
      } else {
        setModalOpen(true);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      router.push('/');
    });
  }, [dispatch, router]);

  useEffect(() => {
    if (!loading && user && !industry && !isModalOpen) {
      setModalOpen(true);
    }
  }, [user, industry, isModalOpen, loading]);

  const handleLogout = () => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      router.push('/');
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#0f2851] antialiased bg-[#f0f4f8]">Loading Session...</div>;
  }

  return (
    <>
      {children}
      <ChangeIndustryModal isOpen={isModalOpen} onClose={() => {
        if (industry) setModalOpen(false);
      }} />
    </>
  );
}
