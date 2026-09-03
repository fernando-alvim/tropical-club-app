const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname)));

// ----------------------------------------------------
// ROTAS DA API REST
// ----------------------------------------------------

// Status da API
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Tropical Club Running API online', time: new Date().toISOString() });
});

// Atletas
app.get('/api/runners', (req, res) => {
  try {
    const runners = db.getRunners();
    res.json({ success: true, data: runners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/runners/:id', (req, res) => {
  try {
    const runner = db.getRunnerById(req.params.id);
    if (!runner) {
      return res.status(404).json({ success: false, error: 'Atleta não encontrado' });
    }
    res.json({ success: true, data: runner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/runners', (req, res) => {
  try {
    const { name, email, phone, goal, base_pace, category } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Nome é obrigatório' });
    }
    const newRunner = db.addRunner({ name, email, phone, goal, base_pace, category });
    res.status(201).json({ success: true, data: newRunner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Treinos (Prescrição e Listagem)
app.get('/api/workouts', (req, res) => {
  try {
    const filters = {
      runner_id: req.query.runner_id,
      status: req.query.status,
      date_from: req.query.date_from,
      date_to: req.query.date_to
    };
    const workouts = db.getWorkouts(filters);
    res.json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Visão da semana com métricas agregadas para o Treinador
app.get('/api/workouts/week', (req, res) => {
  try {
    const weekDates = db.getCurrentWeekDates();
    const dateFrom = req.query.date_from || weekDates[0];
    const dateTo = req.query.date_to || weekDates[6];

    const workouts = db.getWorkouts({ date_from: dateFrom, date_to: dateTo });
    const stats = db.getWeekOverview(dateFrom, dateTo);

    res.json({
      success: true,
      week: {
        from: dateFrom,
        to: dateTo,
        dates: weekDates
      },
      stats,
      data: workouts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compatibilidade direta com atleta.html existente (/api/trainings/:runnerId)
app.get('/api/trainings/:runnerId', (req, res) => {
  try {
    const workouts = db.getWorkouts({ runner_id: req.params.runnerId });
    res.json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/workouts', (req, res) => {
  try {
    const {
      runner_id,
      date,
      title,
      workout_type,
      target_distance_km,
      target_pace,
      description,
      coach_notes
    } = req.body;

    if (!runner_id || !date || !title) {
      return res.status(400).json({ success: false, error: 'Atleta, data e título são obrigatórios' });
    }

    const newWorkout = db.addWorkout({
      runner_id,
      date,
      title,
      workout_type: workout_type || 'Rodagem',
      target_distance_km: Number(target_distance_km) || 0,
      target_pace: target_pace || 'Livre',
      description: description || '',
      coach_notes: coach_notes || ''
    });

    res.status(201).json({ success: true, data: newWorkout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/workouts/:id', (req, res) => {
  try {
    const updated = db.updateWorkout(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Treino não encontrado' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/workouts/:id', (req, res) => {
  try {
    db.deleteWorkout(req.params.id);
    res.json({ success: true, message: 'Treino excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Feedbacks do Atleta
app.post('/api/feedbacks', (req, res) => {
  try {
    const {
      training_plan_id,
      workout_id,
      actual_distance,
      actual_distance_km,
      actual_duration,
      actual_pace,
      perceived_exertion,
      athlete_notes,
      strava_url
    } = req.body;

    const targetWorkoutId = workout_id || training_plan_id;
    if (!targetWorkoutId) {
      return res.status(400).json({ success: false, error: 'workout_id é obrigatório' });
    }

    const distance = actual_distance_km !== undefined ? actual_distance_km : actual_distance;

    const feedback = db.addFeedback({
      workout_id: targetWorkoutId,
      actual_distance_km: Number(distance) || 0,
      actual_duration: actual_duration || '',
      actual_pace: actual_pace || '',
      perceived_exertion: Number(perceived_exertion) || 5,
      athlete_notes: athlete_notes || '',
      strava_url: strava_url || ''
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Retorno/Comentário do Treinador sobre o treino concluído
app.post('/api/workouts/:id/coach-feedback', (req, res) => {
  try {
    const { coach_feedback } = req.body;
    const updated = db.updateCoachNote(req.params.id, coach_feedback || '');
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Feedback não encontrado para este treino' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Glossário Educativo dos Tipos de Treino
app.get('/api/glossary', (req, res) => {
  try {
    const glossary = db.getGlossary();
    res.json({ success: true, data: glossary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Próximas Corridas & Maratonas
app.get('/api/races', (req, res) => {
  try {
    const races = db.getRaces();
    res.json({ success: true, data: races });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/races', (req, res) => {
  try {
    const { title, date, city, country, distances, badge, description, image_url, official_url } = req.body;
    if (!title || !date) {
      return res.status(400).json({ success: false, error: 'Título e data da corrida são obrigatórios' });
    }
    const newRace = db.addRace({
      title,
      date,
      city: city || '',
      country: country || 'Brasil 🇧🇷',
      distances: distances || ['10k'],
      badge: badge || 'Prova Oficial',
      description: description || '',
      image_url: image_url || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
      official_url: official_url || ''
    });
    res.status(201).json({ success: true, data: newRace });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/races/:id', (req, res) => {
  try {
    db.deleteRace(req.params.id);
    res.json({ success: true, message: 'Corrida removida com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Galeria de Fotos da Comunidade
app.get('/api/gallery', (req, res) => {
  try {
    const gallery = db.getGallery();
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/gallery', (req, res) => {
  try {
    const { title, subtitle, image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ success: false, error: 'URL da imagem é obrigatória' });
    }
    const newPhoto = db.addPhoto({
      title: title || 'Treino Tropical Club',
      subtitle: subtitle || 'Comunidade em movimento',
      image_url
    });
    res.status(201).json({ success: true, data: newPhoto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/gallery/:id', (req, res) => {
  try {
    db.deletePhoto(req.params.id);
    res.json({ success: true, message: 'Foto removida com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota raiz: Redireciona para o portal principal
app.get('/', (req, res) => {
  res.redirect('/treinador.html');
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`⚡ TROPICAL CLUB RUNNING - SERVIDOR ATIVO`);
  console.log(`🌐 Porta: http://localhost:${PORT}`);
  console.log(`🏃 Painel Treinador: http://localhost:${PORT}/treinador.html`);
  console.log(`📱 Painel Atleta:    http://localhost:${PORT}/atleta.html`);
  console.log(`================================================`);
});
