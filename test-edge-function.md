# 🧪 Teste da Edge Function

## Problemas Possíveis:

### 1. **Variáveis de Ambiente**
A Edge Function precisa das seguintes variáveis:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`

### 2. **Verificar no Supabase Dashboard:**
1. Vá para **Settings > Edge Functions**
2. Verifique se as variáveis estão configuradas
3. Se não estiverem, adicione:
   - `SITE_URL` = `http://localhost:8080` (ou sua URL de produção)

### 3. **Teste Manual:**
```bash
curl -X POST https://oaxjdnvwwwkmcgcmsvhv.supabase.co/functions/v1/send-invite-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGpkbnZ3d3drbWNnY21zdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTY1OTAsImV4cCI6MjA2NjU3MjU5MH0.vTI-LaYD59BoloFaLBt_OTr7mh5659TaaDwuPUqa7PQ" \
  -d '{"invitation_id": "ID_REAL_DO_CONVITE"}'
```

### 4. **Verificar Logs:**
No Supabase Dashboard > Edge Functions > Logs 