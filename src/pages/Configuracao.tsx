import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabaseClient';

export default function Configuracao() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email, phone')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || ''
          });
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">
        
        <div className="w-full max-w-3xl bg-white rounded-2xl flex flex-col md:flex-col gap-8 p-8">
          <div>
          <h1 className="text-3xl font-bold text-center mb-8 text-black">Configuração</h1>
          </div>
          {/* Formulário */}
          <form className="flex-1 flex flex-col gap-5">
            <div>
              <Label htmlFor="nome" className="text-black">Nome</Label>
              <Input id="nome" value={profile.name} readOnly className="text-black focus-visible:ring-indigo-500 bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="email" className="text-black">Email</Label>
              <Input id="email" type="email" value={profile.email} readOnly className=" text-black focus-visible:ring-indigo-500 bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="telefone" className="text-black">Telefone</Label>
              <Input id="telefone" type="tel" value={profile.phone} readOnly className=" text-black focus-visible:ring-indigo-500 bg-gray-100" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 