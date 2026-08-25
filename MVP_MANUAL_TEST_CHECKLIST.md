# De Lhe Mandar MVP Manual Test Checklist

Pré-requisitos:
- Executar `supabase_mvp_rpc.sql` no projeto Supabase.
- Confirmar RLS, Realtime habilitado nas tabelas e coluna `mission_executor_locations.created_at`.
- Usar dois dispositivos/sessões: uma conta CLIENT (Cota) e uma conta EXECUTOR (Nengue).

## Fluxo principal

- [ ] 1. Criar conta Cota; confirmar profile com role `CLIENT`.
- [ ] 2. Criar conta Nengue; confirmar profile com role `EXECUTOR`.
- [ ] 3. Cota cria missão com serviço, compras e total.
- [ ] 4. Confirmar `missions.status = AVAILABLE`.
- [ ] 5. Confirmar que o Nengue vê a missão.
- [ ] 6. Nengue aceita; confirmar `executor_id` correto.
- [ ] 7. Confirmar atualização da Cota via Realtime.
- [ ] 8. Nengue inicia deslocamento.
- [ ] 9. Confirmar localização em `mission_executor_locations` usando `created_at`.
- [ ] 10. Confirmar localização atualizada para a Cota via Realtime/mapa.
- [ ] 11. Nengue registra chegada.
- [ ] 12. Nengue inicia execução; confirmar `IN_PROGRESS`.
- [ ] 13. Nengue solicita conclusão.
- [ ] 14. Cota recebe `COMPLETION_REQUESTED`.
- [ ] 15. Cota vê QR Code com `confirmation_token` e OTP de 6 dígitos.
- [ ] 16. Nengue confirma por QR ou OTP.
- [ ] 17. Confirmar chamada RPC `confirm_mission`.
- [ ] 18. Confirmar `missions.status = COMPLETED` e `completed_at` preenchido.
- [ ] 19. Confirmar confirmação com `used = true`; repetir deve falhar.
- [ ] 20. Cota submete rating de 1 a 5 com comentário opcional.
- [ ] 21. Confirmar notificações de cada evento permitido.
- [ ] 22. Histórico mostra a missão concluída.

## Casos de erro e segurança

- [ ] OTP inválido é rejeitado.
- [ ] OTP expirado é rejeitado.
- [ ] OTP reutilizado é rejeitado.
- [ ] Nengue não atribuído não confirma QR/token.
- [ ] Nengue não pode confirmar usando OTP da Cota.
- [ ] Cota não consegue executar/avançar missão.
- [ ] Dois Nengues concorrentes: apenas um aceita.
- [ ] Missão cancelada não pode avançar nem ser concluída.
- [ ] Localização sem permissão mostra erro e não grava posição.
- [ ] Perda de conexão mostra erro; nenhuma navegação ocorre antes da confirmação remota.
- [ ] Usuário sem sessão é rejeitado nas operações protegidas.

## Resultado da execução

- Execução remota: pendente até RPC/RLS/Realtime serem confirmados no Supabase.
- Validação local: `npx tsc --noEmit`, `npm run lint`, `npx expo-doctor` e export web.
