# Relatório Técnico: CuidarApp

## 1. Visão Geral do Projeto
O **CuidarApp** é uma plataforma Web e PWA voltada para a gestão de assistência domiciliária (Home Care) e clínicas de saúde. O sistema conecta a administração da clínica, os cuidadores em serviço e os familiares dos pacientes, garantindo total transparência, rastreabilidade dos cuidados e acompanhamento de saúde em tempo real.

## 2. Arquitetura e Tecnologias
- **Frontend Core:** Single-Page Application (SPA) desenvolvida com **React (TypeScript)** e compilada pelo **Vite**.
- **PWA (Progressive Web App):** Possui `manifest.json` com ícones dedicados e um Service Worker (`sw.js`) ativo, o que permite que familiares instalem o CuidarApp nativamente em smartphones, tablets ou desktops, rodando de forma semelhante a um app de loja nativa.
- **Apresentação e UI:** Interface construída de maneira responsiva. Utiliza um design escalável com paleta de cores corporativa de saúde (verde-azulado e azul marinho escuro), gerando confiança. Tipografia pensada na fácil leitura e integração massiva de ícones amigáveis.

## 3. Interfaces do Sistema (Perfis de Acesso)

### 3.1. Painel de Gestão (Perfil: Admin / Clínica)
Acessado predominantemente por computadores e tablets, permite a visão operacional da clínica.
- **Dashboard (Visão Geral):** Exibe métricas chave de acesso rápido, como Pacientes Ativos, Cuidadores trabalhando no momento e número de alertas de saúde disparados. 
- **Tabelas de Gestão:** Listagem clara de pacientes (condição, unidade, localização) e Cuidadores (cargo, turno).
- **Escalas e Turnos:** Rastreia os plantões, cruzando escalas de horários, os pacientes envolvidos e se há atrasos de clock-in do cuidador.
- **Responsividade Adaptada:** Possui uma barra lateral inteligente, que comprime para modo de ícones expandindo o conteúdo útil no Tablet, ou escondendo elegantemente no Mobile (usando menu hamburger).

### 3.2. Aplicativo do Familiar (Perfil: Familiar / Acompanhante)
Adaptado de forma nativa para mobile com paradigma de app:
- Agora apresentado de forma imersiva e preenchendo a tela do dispositivo em qualquer proporção (livre daquele mockup de um celular físico, garantindo aproveitamento de tela até para navegadores desktop que abram o perfil mobile).
- **Tela Principal Diária:** Mostra foto do paciente, equipe escalada do dia e linha do tempo de cuidados (alimentação, curativos, higienização).
- **Sinais Vitais:** Componentes que indicam os padrões de aferição (saturação, pressão arterial).
- **Alertas Recentes:** Eventos de intercorrências que necessitarão de atenção por parte do dono familiar.
- **Navegação Bottom Bar:** Padrão clássico de navegação por abas na parte inferior da tela, extremamente amigável ao usuário.

## 4. Status Atual do Projeto
- O projeto encontra-se em um estado maduro de **Protótipo Interativo (MVP Frontend)**, ou seja: toda a estrutura visual, fluxos de navegação interna e reações de design estão concluídos e hospedados operantes (Vercel / Cloud Run).
- As transições de tela, layout das abas, animações de foco hover e reações a mudança de largura (Responsividade - Media Queries) estão totalmente validadas.
- A etapa PWA (Service workers e Manifests) tem sua camada base inserida com sucesso.

## 5. Próximos Passos (Evoluções Recomendadas)
Ao prosseguir pela jornada de desenvolvimento, para que o sistema se torne pronto para rodar dados reais do público final, precisaremos das seguintes etapas:
1. **Implantação de Nuvem e Banco de Dados Real (Ex: Firebase):** Substituindo as listas fixas ("mockadas") por um sistema de armazenamento que persista os dados de pacientes, cuidadores e rotinas em tempo real.
2. **Autenticação Real:** Telas de login contendo e-mail, senha e verificações de segurança visando assegurar a privacidade (LGPD).
3. **Módulo Cuidador:** A criação da terceira interface para o funcionário apontar a realização dos passos (Check-in, apontamento dos sinais vitais para atualizar o familiar em tempo real, check-out do plantão).
4. **Notificações Push Reais:** Aproveitando o motor PWA recém-instalado, conectar o serviço de notificação ao Service Worker para disparar alerta na tela bloqueada do celular quando uma alteração severa em Sinais Vitais acontecer.
