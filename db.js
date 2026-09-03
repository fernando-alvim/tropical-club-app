const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Garante que o diretório de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getSeedData();
    saveData(initialData);
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    
    // Auto-migração: adiciona glossary, races e gallery caso não existam no db.json
    let modified = false;
    const seed = getSeedData();
    if (!data.races || data.races.length === 0) {
      data.races = seed.races;
      modified = true;
    }
    if (!data.glossary || data.glossary.length === 0) {
      data.glossary = seed.glossary;
      modified = true;
    }
    if (!data.gallery || data.gallery.length === 0) {
      data.gallery = seed.gallery;
      modified = true;
    }
    if (modified) {
      saveData(data);
    }
    return data;
  } catch (err) {
    console.error('Erro ao ler db.json, reinicializando com seed:', err);
    const initialData = getSeedData();
    saveData(initialData);
    return initialData;
  }
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Retorna a data de um dia da semana atual (0 = Segunda, 6 = Domingo)
function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getSeedData() {
  const week = getCurrentWeekDates();

  const runners = [
    {
      id: 'runner-1',
      name: 'Camila Duarte',
      email: 'camila.duarte@email.com',
      phone: '+55 51 98822-1101',
      avatar: 'CD',
      goal: 'Meia Maratona 21k (Sub 1h50)',
      base_pace: '5:15/km',
      category: '21k',
      active: true
    },
    {
      id: 'runner-2',
      name: 'Rodrigo Mendonça',
      email: 'rodrigo.m@email.com',
      phone: '+55 51 99133-4422',
      avatar: 'RM',
      goal: '10k Sub 45 min',
      base_pace: '4:25/km',
      category: '10k',
      active: true
    },
    {
      id: 'runner-3',
      name: 'Mateo Fernández',
      email: 'mateo.running@email.com',
      phone: '+54 9 11 4455-6677',
      avatar: 'MF',
      goal: 'Maratona 42k Buenos Aires',
      base_pace: '4:50/km',
      category: '42k',
      active: true
    },
    {
      id: 'runner-4',
      name: 'Luciana Rossi',
      email: 'lu.rossi@email.com',
      phone: '+55 51 99744-8833',
      avatar: 'LR',
      goal: 'Estreia 5k sem caminhar',
      base_pace: '6:30/km',
      category: '5k',
      active: true
    },
    {
      id: 'runner-5',
      name: 'Juliana Castro',
      email: 'ju.castro@email.com',
      phone: '+55 51 98211-5566',
      avatar: 'JC',
      goal: '10k Ritmo Forte',
      base_pace: '4:40/km',
      category: '10k',
      active: true
    }
  ];

  const workouts = [
    {
      id: 'w-101',
      runner_id: 'runner-1',
      date: week[0],
      title: 'Rodagem Regenerativa Leve',
      workout_type: 'Regenerativo',
      target_distance_km: 6.0,
      target_pace: '5:45 - 6:00 /km',
      description: 'Aquecimento articular + 6km em ritmo Z2 bem confortável. Foco em soltar a musculatura e respiração nasal controlada.',
      coach_notes: 'Mantenha a frequência cardíaca baixa. Não force o ritmo hoje!',
      status: 'completed'
    },
    {
      id: 'w-102',
      runner_id: 'runner-1',
      date: week[2],
      title: 'Tiros de 1.000m (Pista/Asfalto)',
      workout_type: 'Intervalado',
      target_distance_km: 9.0,
      target_pace: '4:40 - 4:45 /km',
      description: 'Aquecimento 2km trote leve + Educativos + 5x 1000m a 4:40 com intervalo de 2min caminhando/trote leve + 1.5km desaquecimento.',
      coach_notes: 'Atenção à cadência de passadas nas repetições 4 e 5. Manter regularidade.',
      status: 'completed'
    },
    {
      id: 'w-103',
      runner_id: 'runner-1',
      date: week[4],
      title: 'Fartlek Progressivo',
      workout_type: 'Fartlek',
      target_distance_km: 7.0,
      target_pace: '5:10 /km médio',
      description: '1km Z2 + alternar 2min ritmo de prova (4:55) por 1min moderado (5:30) até completar 6km + 1km solto.',
      coach_notes: 'Treino para trabalhar transição de marcha e potência aeróbica.',
      status: 'pending'
    },
    {
      id: 'w-104',
      runner_id: 'runner-1',
      date: week[5],
      title: 'Longão de Fim de Semana',
      workout_type: 'Longo',
      target_distance_km: 16.0,
      target_pace: '5:25 - 5:35 /km',
      description: '16km contínuos. Levar hidratação e gel de carboidrato no km 7 e km 12. Os últimos 3km podem ser feitos no ritmo de prova (5:15).',
      coach_notes: 'Simulação oficial de hidratação para a Meia Maratona!',
      status: 'pending'
    },
    {
      id: 'w-201',
      runner_id: 'runner-2',
      date: week[1],
      title: 'Tiros Curtos 400m',
      workout_type: 'Intervalado',
      target_distance_km: 8.5,
      target_pace: '3:55 - 4:05 /km',
      description: '2km aquecimento + 8x 400m no talo a 3:55 com 1min15s descanso parado + 1.5km soltando.',
      coach_notes: 'Trabalho de VO2max puro. Postura alta e braços firmes.',
      status: 'completed'
    },
    {
      id: 'w-202',
      runner_id: 'runner-2',
      date: week[3],
      title: 'Tempo Run (Ritmo Sustentado)',
      workout_type: 'Ritmo',
      target_distance_km: 8.0,
      target_pace: '4:20 /km',
      description: '1.5km aquecimento + 5km cravados a 4:20/km sem oscilar + 1.5km desaquecimento.',
      coach_notes: 'Limiar anaeróbico. Concentração total no cronômetro.',
      status: 'pending'
    },
    {
      id: 'w-203',
      runner_id: 'runner-2',
      date: week[6],
      title: 'Rodagem Longa com Subidas',
      workout_type: 'Longo',
      target_distance_km: 13.0,
      target_pace: '4:45 /km',
      description: '13km em percurso ondulado. Subir mantendo esforço constante e aproveitar a descida para soltar o giro.',
      coach_notes: 'Fortalecimento específico de quadríceps e panturrilha na subida.',
      status: 'pending'
    }
  ];

  const feedbacks = [
    {
      id: 'fb-1',
      workout_id: 'w-101',
      runner_id: 'runner-1',
      completed_at: `${week[0]}T19:30:00Z`,
      actual_distance_km: 6.2,
      actual_duration: '36:10',
      actual_pace: '5:50 /km',
      perceived_exertion: 4,
      athlete_notes: 'Treino bem gostoso após um dia cansativo de trabalho. Pernas estavam um pouco pesadas no início mas depois soltou bem.',
      strava_url: 'https://strava.com/activities/123456789',
      coach_feedback: 'Excelente controle de ritmo, Camila! Recuperação ativa perfeita.'
    },
    {
      id: 'fb-2',
      workout_id: 'w-102',
      runner_id: 'runner-1',
      completed_at: `${week[2]}T07:15:00Z`,
      actual_distance_km: 9.15,
      actual_duration: '44:20',
      actual_pace: '4:42 /km',
      perceived_exertion: 8,
      athlete_notes: 'Tiros saíram fortes! O 4º tiro foi o mais duro psicologicamente, mas fechei o 5º a 4:38. Me senti forte!',
      strava_url: 'https://strava.com/activities/987654321',
      coach_feedback: 'Orgulho demais desse treino! Você cravou todos os mil metros abaixo do teto. Pode descansar bem na quinta!'
    },
    {
      id: 'fb-3',
      workout_id: 'w-201',
      runner_id: 'runner-2',
      completed_at: `${week[1]}T06:40:00Z`,
      actual_distance_km: 8.6,
      actual_duration: '38:00',
      actual_pace: '3:58 /km',
      perceived_exertion: 9,
      athlete_notes: 'Treino insano na pista do parque. Saí com gosto de ferro na boca mas bati todas as parciais entre 1:33 e 1:36 nos 400m.',
      strava_url: '',
      coach_feedback: 'Animal, Rodrigo! É esse estímulo que vai fazer seu 10k despencar para sub 45.'
    }
  ];

  // GUIA EDUCATIVO DOS EXERCÍCIOS / GLOSSÁRIO DE TREINOS
  const glossary = [
    {
      id: 'gloss-intervalado',
      type: 'Intervalado / Tiros',
      tag: 'Velocidade & VO2max',
      summary: 'Repetições de alta intensidade intercaladas por intervalos de descanso controlado.',
      description: 'O treino intervalado é o principal estímulo para elevar o VO2max e a capacidade de suportar ritmos rápidos. As repetições podem ser curtas (200m a 400m para velocidade pura) ou longas (800m a 2.000m para potência aeróbica).',
      how_to_do: 'Mantenha todas as repetições no mesmo ritmo. O erro clássico é sair em ritmo de sprint no primeiro tiro e não conseguir sustentar até o final. Respire de forma ritmada e concentre-se na postura ereta.',
      heart_rate_zone: 'Z4 e Z5 (Limiar / Anaeróbica - 88% a 100% FCmax)',
      borg_scale: '8 a 9 (Muito Intenso / Quase Máximo)',
      recovery: 'Intervalo ativo (trote leve) ou passivo (caminhada/parado) conforme indicado pelo professor.',
      icon: 'fa-stopwatch-20'
    },
    {
      id: 'gloss-fartlek',
      type: 'Fartlek',
      tag: 'Jogo de Velocidade',
      summary: 'Corrida contínua com variação livre e fluida de ritmos sem paradas.',
      description: 'Criado na Suécia (onde "Fart" significa velocidade e "lek" brincadeira), o Fartlek é uma corrida dinâmica que alterna tiros rápidos com recuperações trotando. Pode ser baseado em tempo (ex: 3min forte x 1min30s leve) ou terreno (acelerar nas subidas, soltar nas retas).',
      how_to_do: 'Não há descanso parado! O segredo é conseguir recuperar o fôlego mesmo mantendo o trote leve durante a fase de recuperação ativa. Excelente para simular variações de ritmo em provas.',
      heart_rate_zone: 'Oscila continuamente entre Z3 (Moderada) e Z4 (Forte)',
      borg_scale: '6 a 8 (Moderado a Intenso)',
      recovery: 'Trote moderado/leve entre os blocos acelerados.',
      icon: 'fa-shuffle'
    },
    {
      id: 'gloss-rodagem',
      type: 'Rodagem Leve (Easy Run)',
      tag: 'Base Aeróbica',
      summary: 'A espinha dorsal do corredor: corrida contínua e confortável em Zona 2.',
      description: 'Representa de 70% a 80% de todo o volume semanal de um corredor de elite ou amador. Estimula a capilarização muscular, densidade mitocondrial e fortalece tendões e ligamentos sem sobrecarga articular excessiva.',
      how_to_do: 'Regra de ouro do "Conversational Pace": você deve ser capaz de falar frases completas sem perder o ar. Se a respiração ficar pesada demais, reduza a velocidade sem medo.',
      heart_rate_zone: 'Z2 (Aeróbica Leve - 65% a 75% FCmax)',
      borg_scale: '3 a 5 (Leve a Confortável)',
      recovery: 'Treino de baixo desgaste metabólico.',
      icon: 'fa-person-running'
    },
    {
      id: 'gloss-regenerativo',
      type: 'Regenerativo (Recovery Run)',
      tag: 'Recuperação Ativa',
      summary: 'Corrida curta em ritmo ultraconfortável para acelerar a drenagem de metabólitos.',
      description: 'Realizado tipicamente no dia seguinte a um treino extenuante (como tiros ou o longão de fim de semana). Seu papel não é treinar condicionamento físico, mas aumentar a circulação sanguínea para acelerar a regeneração celular.',
      how_to_do: 'Esqueça o relógio e o pace! Corra no ritmo mais fácil possível, com passadas curtas, relaxando ombros, mandíbula e trapézio. Duração recomendada entre 30 e 45 minutos.',
      heart_rate_zone: 'Z1 a Z2 Baixa (<65% FCmax)',
      borg_scale: '2 a 4 (Muito Leve)',
      recovery: 'Favorece o sono e a restauração das reservas de glicogênio.',
      icon: 'fa-heart-pulse'
    },
    {
      id: 'gloss-longo',
      type: 'Longão (Long Run)',
      tag: 'Resistência & Gordura como Combustível',
      summary: 'O treino de maior volume da semana, simulando o desafio mental e físico de provas.',
      description: 'Essencial para quem treina para 10k, 21k ou 42k. Ensina o organismo a metabolizar gorduras com maior eficiência e prepara os sistemas neuromuscular e mental para permanecer em movimento por longas horas.',
      how_to_do: 'Comece em ritmo conversacional e mantenha a paciência nos primeiros quilômetros. É o momento perfeito para testar tênis de prova, meias antiatrito e o protocolo de géis de carboidrato a cada 40-50 minutos.',
      heart_rate_zone: 'Z2 a Z3 (Aeróbica Estável - 70% a 82% FCmax)',
      borg_scale: '5 a 7 (Desafiador pelo acúmulo de tempo)',
      recovery: 'Hidratação rigorosa com eletrólitos e refeição rica em carboidratos complexos e proteínas.',
      icon: 'fa-route'
    },
    {
      id: 'gloss-ritmo',
      type: 'Ritmo / Tempo Run',
      tag: 'Limiar Anaeróbico',
      summary: 'Corrida em velocidade sustentada no limiar de acúmulo de ácido lático.',
      description: 'Treino contínuo em ritmo "confortavelmente duro" mantido por 20 a 50 minutos. Ensina seu corpo a reciclar e depurar o lactato sanguíneo em velocidades próximas às de prova de 10k e Meia Maratona.',
      how_to_do: 'Exige foco mental afiado. Se você começar rápido demais, entrará em fadiga precoce. Encontre a velocidade prescrita logo no primeiro quilômetro e mantenha o relógio travado.',
      heart_rate_zone: 'Z4 (Limiar de Lactato - 85% a 90% FCmax)',
      borg_scale: '7 a 8 (Duro, porém sustentável)',
      recovery: 'Desaquecimento obrigatório com trote suave de 1km a 2km.',
      icon: 'fa-gauge-high'
    }
  ];

  // CALENDÁRIO DE PROVAS & MARATONAS (BRASIL / ARGENTINA - TROPICAL CLUB BRAR)
  const races = [
    {
      id: 'race-1',
      title: 'Maratona Internacional de Porto Alegre 2026',
      date: '2026-06-07',
      city: 'Porto Alegre, RS',
      country: 'Brasil 🇧🇷',
      distances: ['42k', '21k', '10k', '5k'],
      badge: 'Major Alvo do Clube',
      description: 'O percurso mais plano e veloz da América Latina, beirando a orla do Guaíba. Prova ideal para bater recorde pessoal (RP) e conquistar índice para a Maratona de Boston.',
      image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
      official_url: 'https://www.maratonadeportoalegre.com.br'
    },
    {
      id: 'race-2',
      title: 'Maratón Internacional de Buenos Aires 2026',
      date: '2026-09-20',
      city: 'Buenos Aires',
      country: 'Argentina 🇦🇷',
      distances: ['42k', '21k'],
      badge: 'Viagem Oficial BRAR',
      description: 'A maior maratona da América do Sul! Largada em Palermo passando pelo Obelisco, Casa Rosada, La Boca e Puerto Madero com clima frio e torcida apaixonada pelas ruas.',
      image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
      official_url: 'https://maratondebuenosaires.com'
    },
    {
      id: 'race-3',
      title: 'Meia Maratona Internacional de Florianópolis',
      date: '2026-08-16',
      city: 'Florianópolis, SC',
      country: 'Brasil 🇧🇷',
      distances: ['21k', '10k', '5k'],
      badge: 'Meia Maratona Rápida',
      description: 'Corrida costeira pelas pontes de Floripa com vista para o mar, brisa oceânica e clima ameno de inverno. Excelente preparação para os maratonistas do segundo semestre.',
      image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
      official_url: 'https://www.meiamaratonadeflorianopolis.com.br'
    },
    {
      id: 'race-4',
      title: 'Circuito Tropical Club 10k & 5k (Etapa Sunset)',
      date: '2026-10-18',
      city: 'Orla do Guaíba / Porto Alegre',
      country: 'Brasil 🇧🇷',
      distances: ['10k', '5k'],
      badge: 'Evento Exclusivo do Clube',
      description: 'Treino teste e corrida oficial da nossa comunidade. Cronometragem oficial com chip, medalha de finisher exclusiva e confraternização pós-prova no pôr do sol.',
      image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      official_url: 'https://instagram.com/tropicalclubrs'
    }
  ];

  // GALERIA DE FOTOS DA COMUNIDADE
  const gallery = [
    {
      id: 'photo-1',
      title: 'Treino de Tiros na Pista',
      subtitle: 'Pelotão de velocidade focado nas séries de 1.000m',
      image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-25'
    },
    {
      id: 'photo-2',
      title: 'Longão de Sábado na Orla',
      subtitle: '16km e 26km rodados ao amanhecer',
      image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-29'
    },
    {
      id: 'photo-3',
      title: 'Conexão Brasil & Argentina',
      subtitle: 'Comunidade Tropical Club reunida em prova internacional',
      image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-15'
    },
    {
      id: 'photo-4',
      title: 'Chegada e Pódio da Equipe',
      subtitle: 'Superação de metas e novos Recordes Pessoais (RP)',
      image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-10'
    }
  ];

  return {
    runners,
    workouts,
    feedbacks,
    glossary,
    races,
    gallery
  };
}

// Métodos de Acesso aos Dados

const db = {
  // Atletas
  getRunners() {
    const data = loadData();
    return data.runners || [];
  },

  getRunnerById(id) {
    const data = loadData();
    return data.runners.find(r => r.id === id) || null;
  },

  addRunner(runner) {
    const data = loadData();
    const newRunner = {
      id: 'runner-' + Date.now(),
      active: true,
      avatar: (runner.name || 'TC').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
      ...runner
    };
    data.runners.push(newRunner);
    saveData(data);
    return newRunner;
  },

  // Treinos
  getWorkouts(filters = {}) {
    const data = loadData();
    let list = data.workouts || [];

    if (filters.runner_id) {
      list = list.filter(w => w.runner_id === filters.runner_id);
    }
    if (filters.status) {
      list = list.filter(w => w.status === filters.status);
    }
    if (filters.date) {
      list = list.filter(w => w.date === filters.date);
    }
    if (filters.date_from && filters.date_to) {
      list = list.filter(w => w.date >= filters.date_from && w.date <= filters.date_to);
    }

    return list.map(w => {
      const fb = (data.feedbacks || []).find(f => f.workout_id === w.id);
      const runner = (data.runners || []).find(r => r.id === w.runner_id);
      return {
        ...w,
        feedback: fb || null,
        runner_name: runner ? runner.name : 'Atleta Desconhecido',
        runner_avatar: runner ? runner.avatar : 'TC',
        runner_goal: runner ? runner.goal : ''
      };
    });
  },

  getWorkoutById(id) {
    const data = loadData();
    const workout = (data.workouts || []).find(w => w.id === id);
    if (!workout) return null;
    const fb = (data.feedbacks || []).find(f => f.workout_id === workout.id);
    const runner = (data.runners || []).find(r => r.id === workout.runner_id);
    return {
      ...workout,
      feedback: fb || null,
      runner
    };
  },

  addWorkout(workout) {
    const data = loadData();
    const newWorkout = {
      id: 'w-' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString(),
      ...workout
    };
    data.workouts.push(newWorkout);
    saveData(data);
    return newWorkout;
  },

  updateWorkout(id, updates) {
    const data = loadData();
    const idx = data.workouts.findIndex(w => w.id === id);
    if (idx === -1) return null;
    data.workouts[idx] = { ...data.workouts[idx], ...updates };
    saveData(data);
    return data.workouts[idx];
  },

  deleteWorkout(id) {
    const data = loadData();
    data.workouts = data.workouts.filter(w => w.id !== id);
    data.feedbacks = (data.feedbacks || []).filter(f => f.workout_id !== id);
    saveData(data);
    return true;
  },

  // Feedbacks
  addFeedback(feedback) {
    const data = loadData();
    const wIdx = data.workouts.findIndex(w => w.id === feedback.workout_id);
    if (wIdx !== -1) {
      data.workouts[wIdx].status = 'completed';
    }

    const newFeedback = {
      id: 'fb-' + Date.now(),
      completed_at: new Date().toISOString(),
      coach_feedback: '',
      ...feedback
    };

    data.feedbacks = (data.feedbacks || []).filter(f => f.workout_id !== feedback.workout_id);
    data.feedbacks.push(newFeedback);
    saveData(data);
    return newFeedback;
  },

  updateCoachNote(workoutId, coachFeedback) {
    const data = loadData();
    const fb = (data.feedbacks || []).find(f => f.workout_id === workoutId);
    if (!fb) return null;
    fb.coach_feedback = coachFeedback;
    saveData(data);
    return fb;
  },

  // Glossário de Exercícios / Tipos de Treino
  getGlossary() {
    const data = loadData();
    return data.glossary || [];
  },

  // Próximas Corridas / Maratonas
  getRaces() {
    const data = loadData();
    return data.races || [];
  },

  addRace(race) {
    const data = loadData();
    const newRace = {
      id: 'race-' + Date.now(),
      ...race
    };
    if (!data.races) data.races = [];
    data.races.push(newRace);
    saveData(data);
    return newRace;
  },

  deleteRace(id) {
    const data = loadData();
    data.races = (data.races || []).filter(r => r.id !== id);
    saveData(data);
    return true;
  },

  // Galeria de Fotos
  getGallery() {
    const data = loadData();
    return data.gallery || [];
  },

  addPhoto(photo) {
    const data = loadData();
    const newPhoto = {
      id: 'photo-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...photo
    };
    if (!data.gallery) data.gallery = [];
    data.gallery.unshift(newPhoto);
    saveData(data);
    return newPhoto;
  },

  deletePhoto(id) {
    const data = loadData();
    data.gallery = (data.gallery || []).filter(p => p.id !== id);
    saveData(data);
    return true;
  },

  // Estatísticas e Resumo Semanal para o Treinador
  getWeekOverview(dateFrom, dateTo) {
    const data = loadData();
    const workouts = this.getWorkouts({ date_from: dateFrom, date_to: dateTo });

    const totalPlanned = workouts.length;
    const totalCompleted = workouts.filter(w => w.status === 'completed').length;
    const totalPending = workouts.filter(w => w.status === 'pending').length;

    let plannedKm = 0;
    let actualKm = 0;
    let rpeSum = 0;
    let rpeCount = 0;

    workouts.forEach(w => {
      plannedKm += Number(w.target_distance_km) || 0;
      if (w.feedback && w.feedback.actual_distance_km) {
        actualKm += Number(w.feedback.actual_distance_km) || 0;
      }
      if (w.feedback && w.feedback.perceived_exertion) {
        rpeSum += Number(w.feedback.perceived_exertion);
        rpeCount++;
      }
    });

    const completionRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;
    const avgRpe = rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : 0;

    return {
      totalPlanned,
      totalCompleted,
      totalPending,
      plannedKm: Math.round(plannedKm * 10) / 10,
      actualKm: Math.round(actualKm * 10) / 10,
      completionRate,
      avgRpe,
      runnersCount: (data.runners || []).length
    };
  },

  getCurrentWeekDates
};

module.exports = db;
