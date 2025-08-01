import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  UserPlus, 
  Mail, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Copy,
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function InviteUsers() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [invitations, setInvitations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'employee',
    position: ''
  });
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    fetchUserAndCompany();
  }, []);

  useEffect(() => {
    if (company) {
      fetchInvitations();
      fetchEmployees();
    }
  }, [company]);

  const fetchUserAndCompany = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      
      // Buscar dados da empresa do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profile?.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single();
        
        setCompany(companyData);
      }
    }
  };

  const fetchInvitations = async () => {
    if (!company) return;

    const { data } = await supabase
      .from('invitations')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    setInvitations(data || []);
  };

  const fetchEmployees = async () => {
    if (!company) {
      console.log('fetchEmployees: company não encontrada');
      return;
    }

    console.log('fetchEmployees: buscando funcionários para company_id:', company.id);

    // Primeiro, buscar os company_users
    const { data: companyUsers, error: companyUsersError } = await supabase
      .from('company_users')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    if (companyUsersError) {
      console.error('Erro ao buscar company_users:', companyUsersError);
      return;
    }

    console.log('Company users encontrados:', companyUsers);

    // Depois, buscar os perfis dos usuários
    if (companyUsers && companyUsers.length > 0) {
      const userIds = companyUsers.map(cu => cu.user_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      if (profilesError) {
        console.error('Erro ao buscar profiles:', profilesError);
        return;
      }

      console.log('Profiles encontrados:', profiles);

      // Combinar os dados
      const employeesWithProfiles = companyUsers.map(cu => {
        const profile = profiles?.find(p => p.id === cu.user_id);
        return {
          ...cu,
          profiles: profile || { name: 'Usuário', email: 'N/A' }
        };
      });

      console.log('Funcionários com perfis:', employeesWithProfiles);
      setEmployees(employeesWithProfiles);
    } else {
      setEmployees([]);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !inviteForm.email) return;

    setLoading(true);

    try {
      // Gerar token único para o convite
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // Criar convite
      const { data: invitationData, error } = await supabase
        .from('invitations')
        .insert({
          company_id: company.id,
          email: inviteForm.email,
          role: inviteForm.role,
          position: inviteForm.position,
          token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar convite:', error);
        return;
      }

      // Enviar email usando Edge Function
      try {
        console.log('Enviando email para convite ID:', invitationData.id);
        
        const response = await fetch('https://oaxjdnvwwwkmcgcmsvhv.supabase.co/functions/v1/send-invite-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGpkbnZ3d3drbWNnY21zdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTY1OTAsImV4cCI6MjA2NjU3MjU5MH0.vTI-LaYD59BoloFaLBt_OTr7mh5659TaaDwuPUqa7PQ`
          },
          body: JSON.stringify({
            invitation_id: invitationData.id
          })
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Email enviado com sucesso:', result);
          setSuccess(`Convite enviado com sucesso para ${inviteForm.email}!`);
          setTimeout(() => setSuccess(''), 5000);
        } else {
          const errorData = await response.json();
          console.error('Erro ao enviar email:', errorData);
          setSuccess(`Erro ao enviar email: ${errorData.error}`);
          setTimeout(() => setSuccess(''), 5000);
        }
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        setSuccess(`Erro ao enviar email: ${emailError.message}`);
        setTimeout(() => setSuccess(''), 5000);
      }
      
      setInviteForm({ email: '', role: 'employee', position: '' });
      fetchInvitations();
      fetchEmployees();
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(inviteLink);
  };

  const deleteInvitation = async (id: string) => {
    await supabase
      .from('invitations')
      .delete()
      .eq('id', id);
    
    fetchInvitations();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Aceito</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!company) {
    return (
      <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
            <p className="text-gray-600">Você precisa ser membro de uma empresa para acessar esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">
        <div className="w-full max-w-6xl flex flex-col items-center">
          {/* Header */}
          <div className="w-full bg-white rounded-2xl shadow mb-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Convidar Funcionários</h1>
                <p className="text-sm text-gray-600 mt-1">Convide novos membros para {company.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  {invitations.length} convites
                </Badge>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="w-full mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ {success}
            </div>
          )}

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Convite */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Novo Convite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email do Funcionário
                    </label>
                    <Input
                      type="email"
                      placeholder="funcionario@empresa.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-[14px] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition"
                    >
                      <option value="employee">Funcionário</option>
                      <option value="manager">Gerente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Função
                    </label>
                    <Input
                      placeholder="Ex: Analista de Marketing Digital"
                      value={inviteForm.position}
                      onChange={(e) => setInviteForm(f => ({ ...f, position: e.target.value }))}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !inviteForm.email}
                  >
                    {loading ? 'Enviando...' : 'Enviar Convite'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Convites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Convites Enviados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invitations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum convite enviado ainda</p>
                    </div>
                  ) : (
                    invitations.map((invite: any) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{invite.email}</span>
                            {getStatusBadge(invite.status)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {invite.role}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Enviado em {new Date(invite.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {invite.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyInviteLink(invite.token)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInvitation(invite.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Funcionários */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Funcionários da Empresa
                <Badge className="bg-green-100 text-green-800">
                  {employees.length} funcionários
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    console.log('Company atual:', company);
                    fetchEmployees();
                  }}
                  className="ml-auto"
                >
                  Debug
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum funcionário cadastrado ainda</p>
                  </div>
                ) : (
                  employees.map((employee: any) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {employee.profiles?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span className="font-medium">{employee.profiles?.name || 'Usuário'}</span>
                            <span className="text-sm text-gray-500 ml-2">({employee.profiles?.email})</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 ml-10">
                          {employee.position || (employee.role === 'employee' ? 'Funcionário' : 
                            employee.role === 'manager' ? 'Gerente' : 
                            employee.role === 'admin' ? 'Administrador' : 'Funcionário')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-10">
                          Cadastrado em {new Date(employee.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          employee.role === 'admin' ? 'bg-red-100 text-red-800' :
                          employee.role === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {employee.role === 'admin' ? 'Admin' :
                           employee.role === 'manager' ? 'Gerente' :
                           'Funcionário'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 