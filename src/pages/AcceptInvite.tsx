import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de convite não encontrado');
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      // Buscar convite pelo token
      const { data: invitationData, error: invitationError } = await supabase
        .from('invitations')
        .select(`
          *,
          companies(name, email)
        `)
        .eq('token', token)
        .eq('status', 'sent')
        .single();

      if (invitationError || !invitationData) {
        setError('Convite não encontrado ou já expirado');
        setLoading(false);
        return;
      }

      // Verificar se o convite não expirou
      if (new Date(invitationData.expires_at) < new Date()) {
        setError('Este convite expirou');
        setLoading(false);
        return;
      }

      setInvitation(invitationData);
      setCompany(invitationData.companies);
      setFormData(prev => ({ ...prev, email: invitationData.email }));
      setLoading(false);

    } catch (error) {
      console.error('Erro ao buscar convite:', error);
      setError('Erro ao carregar convite');
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Criar conta do usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            is_company_owner: false
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Erro ao criar conta');
      }

      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
          company_id: invitation.company_id,
          is_company_owner: false
        });

      if (profileError) {
        throw new Error('Erro ao criar perfil');
      }

      // Adicionar usuário à empresa
      const { error: companyUserError } = await supabase
        .from('company_users')
        .insert({
          company_id: invitation.company_id,
          user_id: authData.user.id,
          role: invitation.role,
          position: invitation.position
        });

      if (companyUserError) {
        throw new Error('Erro ao adicionar usuário à empresa');
      }

      // Atualizar status do convite
      await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      setSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      console.error('Erro ao aceitar convite:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Erro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Sucesso!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Conta criada com sucesso! Você será redirecionado para o login.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Aceitar Convite</CardTitle>
          <CardDescription>
            Você foi convidado para se juntar à equipe da <strong>{company?.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={formErrors.email ? 'border-red-500' : ''}
                disabled
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={formErrors.password ? 'border-red-500' : ''}
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={formErrors.confirmPassword ? 'border-red-500' : ''}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Aceitar Convite e Criar Conta'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 