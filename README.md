# 🏃 Tropical Club Running - Plataforma de Gestão de Treinos

Sistema web moderno desenvolvido para a assessoria esportiva **Tropical Club** (`@tropicalclubrs` - Comunidad Running BRAR).

Conecta o **Treinador/Professor** aos **Atletas** para prescrição semanal, monitoramento de adesão, controle de carga de esforço (Borg RPE) e feedback contínuo.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado (v18+)

### Iniciar a Aplicação
```bash
# Instalar dependências (caso ainda não tenha feito)
npm install

# Iniciar o servidor
npm start
```

O servidor iniciará em **`http://localhost:3000`**.

---

## 🧭 Telas e Acessos

| Tela | URL | Descrição |
| :--- | :--- | :--- |
| **Portal Central** | [`http://localhost:3000`](http://localhost:3000) | Tela de boas-vindas e chaveador rápido de perfis |
| **Painel do Treinador** | [`http://localhost:3000/treinador.html`](http://localhost:3000/treinador.html) | Dashboard semanal, grade de monitoramento, prescrição de treinos e exportação WhatsApp |
| **App do Atleta** | [`http://localhost:3000/atleta.html`](http://localhost:3000/atleta.html) | Programação semanal do aluno, botão de concluir treino e retorno do professor |

---

## 🎯 Funcionalidades Implementadas

### 1. Painel do Treinador (`treinador.html`)
- **Ribbon de KPIs Semanais**:
  - Total de treinos planejados na semana
  - Taxa de conclusão (% de adesão)
  - Volume total em km (Planejado vs Realizado)
  - Média de esforço percebido da equipe (RPE Borg 1-10)
  - Contagem de atletas ativos
- **Navegação Semanal**:
  - Botões para avançar ou voltar semanas (`< Anterior`, `Hoje`, `Próxima >`) com ajuste automático de calendário.
- **Grade Semanal em 7 Colunas (Seg a Dom)**:
  - Visualização em cards de todos os treinos prescritos para cada dia.
  - Indicadores de status em tempo real: `✓ Feito` (Verde) ou `Pendente` (Âmbar).
  - Badges coloridos por tipo de treino: *Intervalado/Tiros*, *Rodagem*, *Longão*, *Regenerativo*, *Fartlek*, *Ritmo*.
  - Miniatura do atleta, distância e pace alvo.
- **Prescrição Ágil de Treinos (Modal)**:
  - Seleção do atleta, data, título, tipo de estímulo, distância alvo, pace alvo, detalhamento (aquecimento, séries, soltura) e dicas do coach.
- **Avaliação de Feedback & Carga (Modal)**:
  - Comparativo imediato: Planejado vs Realizado (distância, tempo, pace médio real).
  - Percepção de esforço na Escala de Borg (1 a 10).
  - Relato do atleta sobre como se sentiu.
  - Link direto para atividade no Strava/Garmin.
  - Campo para o professor responder o atleta com feedback técnico.
- **Exportação Rápida para WhatsApp**:
  - Botão com 1 clique para gerar e copiar a planilha semanal formatada com emojis e detalhes para enviar ao atleta.
  - Botão para abrir o WhatsApp Web diretamente com o número do atleta.
- **Cadastro de Novo Aluno**:
  - Nome, telefone WhatsApp, e-mail, categoria/distância foco (5k, 10k, 21k, 42k) e pace de referência.

### 2. App do Atleta (`atleta.html`)
- **Mobile-First**: Design otimizado para celulares, com suporte a visualização dark mode nativa.
- **Programação Semanal Dinâmica**: Lista clara dos treinos atribuídos pelo professor.
- **Chaveador de Perfil**: Permite testar a visão de qualquer aluno cadastrado sem precisar de login prévio.
- **Registro de Treino (Check-in)**:
  - Distância real percorrida (km)
  - Tempo total
  - Pace médio
  - Escala de esforço de Borg (1 a 10)
  - Sensações e notas pós-treino
  - Link da atividade do Strava
- **Retorno do Treinador**: Exibe com destaque as orientações e elogios enviados pelo professor.

---

## 🛠️ Arquitetura & Stack Técnica

- **Backend**: Node.js + Express REST API
- **Banco de Dados**: Persistência em arquivo JSON estruturado (`data/db.json`) com seed automática de atletas reais do Tropical Club.
- **Frontend**: HTML5, Tailwind CSS, FontAwesome 6, Vanilla JavaScript modular e responsivo.
