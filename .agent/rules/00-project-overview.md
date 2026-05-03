# Visão Geral do Projeto CuidarApp

**Escopo:** Global (Aplica-se a todas as interações)

## Identidade
CuidarApp é uma plataforma Web + PWA de gestão de Home Care (Assistência Domiciliária).
Conecta três perfis: Administrador/Clínica, Familiar/Acompanhante e Cuidador.

## Stack Principal
- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS (paleta: teal/green-600 e navy blue/slate-800)
- **PWA:** manifest.json + Service Worker (sw.js)
- **Banco de Dados:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Deploy:** Vercel (frontend) / Cloud Run (quando necessário)

## Perfis de Acesso
| Perfil | Interface | Dispositivo Principal | Status |
|---|---|---|---|
| Admin/Clínica | Dashboard com sidebar | Desktop/Tablet | Implementado (UI) |
| Familiar | App mobile-first + bottom bar | Smartphone | Implementado (UI) |
| Cuidador | App mobile-first | Smartphone | **Pendente** |

## Estado Atual
MVP Frontend concluído. Dados mockados. Backend (Supabase) a ser implementado.

## Diretrizes de Negócio
- Dados de saúde são sensíveis: LGPD obrigatória em todas as decisões
- Isolamento por clínica: admin de Clínica A nunca vê dados da Clínica B
- Familiar só vê dados do seu paciente específico
- Cuidador só vê pacientes atribuídos ao seu turno

## Regra de Não Regressão
Qualquer mudança de backend NÃO deve quebrar o layout/UI existente do frontend.
Valide sempre o frontend visualmente após mudanças de integração.
