'use client';

import { Input, Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FooterNewsLetter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [campaignName, setCampaignName] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get('https://thenews.africa/api/category', {
          headers: {
            'TheNews-api-key': process.env.NEXT_PUBLIC_TheNews_API_KEY!,
          },
        });

        const categories = res.data.data;
        if (categories.length > 1) {
          const target = categories[1]; 
          setCategoryId(target._id);
          setCategoryName(target.name);
          setCampaignName(target.campaigns[0]?.name || 'Thenews Footer Campaign');
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategory();
  }, []);

  const handleSubscribe = async () => {
    if (!email || !categoryId) return;

    setLoading(true);
    setMessage('');

    try {
      const payload = {
        email,
        source: `${process.env.NEXT_PUBLIC_SOURCE}/category?${categoryName}`,
        status: 'Subscribed',
        categoryId,
        metadata: {
          campaign: campaignName,
          pageUrl: `${process.env.NEXT_PUBLIC_SOURCE}/${categoryName}`,
          formId: ' Thenews-footer-newsletter-form',
        },
      };

      const res = await axios.post('https://thenews.africa/api/subscribe', payload, {
        headers: {
          'TheNews-api-key': process.env.NEXT_PUBLIC_TheNews_API_KEY!,
        },
      });

      if (res.status === 200) {
        toast.success('Successfully subscribed!');
        setMessage('Successfully subscribed!');
        setEmail('');
      } else {
        toast.error('Subscription failed.');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (err: any) {
      const customMessage = err.response?.data?.error || 'Subscription failed.';
      toast.error(customMessage);
      setMessage(customMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="border-dark-600 bg-dark-700 focus:border-gold-400 text-white"
      />
      <Button
        isLoading={loading}
        onClick={handleSubscribe}
        className="bg-gold-700 text-white hover:bg-gold-400 w-full"
        disabled={!email.trim()}
      >
        Subscribe
      </Button>
      {message && <p className="text-sm text-gray-300">{message}</p>}
    </div>
  );
};

export default FooterNewsLetter;
