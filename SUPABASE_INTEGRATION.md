# Integração Supabase

Esta documentação descreve a integração do Supabase com o React Native/Expo para autenticação e gerenciamento de dados.

## Estrutura

### Arquivos Criados

- **`lib/supabase.ts`** - Cliente Supabase configurado com persistência segura de sessão via Expo Secure Store
- **`types/supabase.ts`** - Tipos TypeScript para as tabelas do Supabase (Database schema types)
- **`services/supabaseService.ts`** - Serviço Supabase com operações de autenticação e perfil
- **`services/supabase.test.ts`** - Teste de integração para validar a conexão
- **`SUPABASE_INTEGRATION.md`** - Este arquivo

### Arquivos Modificados

- **`.env`** - Adicionadas variáveis `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **`services/sessionService.ts`** - Integrado com Supabase mantendo compatibilidade com mock
- **`package.json`** - Adicionado `@supabase/supabase-js` e `expo-secure-store`

## Configuração

### Variáveis de Ambiente

```env
EXPO_PUBLIC_SUPABASE_URL=https://uswrbjieipnbgiqkywkl.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_WBrltz7443qsVV1R2dIOow_gXQaW6hf
```

### Persistência de Sessão

A sessão de autenticação é persistida de forma segura usando `expo-secure-store`:

- Tokens são salvos de forma criptografada no dispositivo
- Sessão é automaticamente restaurada ao abrir a aplicação
- Tokens são automaticamente atualizados quando expiram

## API

### supabaseService

```typescript
// Autenticação
await supabaseService.signUp(email, password, displayName, role)
await supabaseService.signIn(email, password)
await supabaseService.signOut()

// Perfil
await supabaseService.getProfile(userId)
await supabaseService.updateProfile(userId, updates)

// Sessão
await supabaseService.getCurrentSession()
await supabaseService.getCurrentUser()

// Observador de estado
const unsubscribe = supabaseService.onAuthStateChange(callback)
```

### sessionService (Compatível com Mock)

```typescript
// Autenticação (Supabase ou Mock)
sessionService.signIn(role, email?, password?)
sessionService.signUp(email, password, displayName, role)
sessionService.signOut()

// Restaurar sessão persisted
sessionService.restoreSession()

// Obter estado atual
sessionService.get()
sessionService.getProfile()
```

## Fluxo de Autenticação

1. **Inicialização**: O cliente Supabase é criado com persistência segura
2. **Sign Up**: Email/password → Supabase Auth + Profile criado
3. **Sign In**: Email/password → Supabase Auth + Profile carregado
4. **Restauração**: App inicia → Supabase restaura sessão persisted
5. **Sign Out**: Sessão local + remota são limpas

## Segurança

- ✓ Chave publishable (segura para cliente)
- ✓ Sem service_role_key no React Native
- ✓ Tokens persistidos de forma segura via Expo Secure Store
- ✓ Auto-refresh de tokens expirados
- ✓ Sem credenciais em código-fonte

## Tabelas Supabase

### profiles
```
id (UUID)
email (TEXT)
display_name (TEXT)
role (TEXT: CLIENT | EXECUTOR)
avatar_url (TEXT)
phone (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### missions
```
id (UUID)
client_id (UUID, FK: profiles.id)
executor_id (UUID, FK: profiles.id)
title (TEXT)
description (TEXT)
service_amount (NUMERIC)
purchase_amount (NUMERIC)
total_amount (NUMERIC)
scheduled_at (TIMESTAMP)
status (TEXT: CREATED|AVAILABLE|ACCEPTED|IN_PROGRESS|AWAITING_CONFIRMATION|COMPLETED|CANCELLED|DISPUTED)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### mission_confirmations
```
id (UUID)
mission_id (UUID, FK: missions.id)
confirmation_token (TEXT)
otp (TEXT)
confirmed_at (TIMESTAMP)
expires_at (TIMESTAMP)
used (BOOLEAN)
created_at (TIMESTAMP)
```

## Próximos Passos

1. ✓ Supabase cliente configurado com persistência
2. ✓ Serviço supabaseService criado
3. ✓ SessionService integrado
4. Conectar telas de autenticação (login/register)
5. Implementar fluxos de missão com dados reais
6. Integrar localização com mission_executor_locations
7. Implementar pagamentos e ratings

## Testes

Para verificar a integração:

```typescript
import { testSupabaseConnection } from '@/services/supabase.test';

const result = await testSupabaseConnection();
console.log(result);
```

## Notas

- O `sessionService` mantém compatibilidade com mock para desenvolvimento
- Ao fornecer `email` e `password`, usa Supabase automaticamente
- Sem parâmetros, usa mock (cliente-ana / executor-marcos)
- Erros de Supabase propagam com contexto
