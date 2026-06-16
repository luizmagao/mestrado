// === CONFIGURAÇÃO DO QUIZ ===
const QUESTIONS = [
  {
    name: 'q1',
    correct: 'b',
    title: 'Crise do poder oligárquico',
    options: [
      { value: 'a', label: 'Um colapso definitivo da aristocracia agrária e de seus privilégios.' },
      { value: 'b', label: 'O início de uma transição que, ainda sob hegemonia oligárquica, recompôs as estruturas do poder burguês.' },
      { value: 'c', label: 'A ruptura imediata com as estruturas coloniais e escravistas.' },
      { value: 'd', label: 'A consolidação plena do poder burguês e da dominação democrática.' },
    ],
    explanation:
      'Florestan critica a ideia de “colapso” oligárquico. Para ele, a transição Império–República foi uma recomposição das estruturas de poder, ainda sob hegemonia oligárquica, que modernizou a oligarquia agrária sem romper com ela.',
  },
  {
    name: 'q2',
    correct: 'b',
    title: 'A burguesia brasileira e o Estado',
    options: [
      { value: 'a', label: 'Forjou instituições sociais próprias antes de recorrer ao Estado.' },
      { value: 'b', label: 'Convergiu para o Estado, unificando-se politicamente antes de consolidar uma dominação sócio-econômica.' },
      { value: 'c', label: 'Liderou uma revolução democrática e nacionalista radical.' },
      { value: 'd', label: 'Rompeu completamente com a oligarquia agrária desde o início.' },
    ],
    explanation:
      'Diferentemente de outras burguesias, a brasileira não forjou instituições próprias de poder social. Ela convergiu para o Estado e ali firmou seu pacto de dominação, unificando-se politicamente antes de consolidar uma dominação sócio-econômica.',
  },
  {
    name: 'q3',
    correct: 'b',
    title: 'Capitalismo dependente',
    options: [
      { value: 'a', label: 'Imposto exclusivamente de fora para dentro pelas nações hegemônicas.' },
      { value: 'b', label: 'Uma estratégia das elites dominantes que dimensionaram o desenvolvimento capitalista segundo interesses particularistas.' },
      { value: 'c', label: 'Um estágio transitório que levou à industrialização autônoma e à democracia plena.' },
      { value: 'd', label: 'Uma ruptura completa com as formas pré-capitalistas de produção e troca.' },
    ],
    explanation:
      'Florestan argumenta que dependência e subdesenvolvimento não foram apenas impostos de fora. Eles resultaram de uma estratégia repetida das elites dominantes, que dimensionaram o desenvolvimento capitalista conforme seus interesses particularistas.',
  },
  {
    name: 'q4',
    correct: 'b',
    title: 'Modelo autocrático-burguês',
    options: [
      { value: 'a', label: 'À democracia plena e à universalização dos direitos.' },
      { value: 'b', label: 'À autocracia e à repressão de classe como forma de consolidar a dominação burguesa.' },
      { value: 'c', label: 'À ruptura completa com o capitalismo mundial.' },
      { value: 'd', label: 'À industrialização autônoma sem interferência do Estado.' },
    ],
    explanation:
      'No capítulo 7, Florestan mostra que, na periferia, desenvolvimento capitalista e democracia se dissociam. O que se concretiza é uma associação racional entre desenvolvimento capitalista e autocracia, com a repressão das massas e do proletariado.',
  },
  {
    name: 'q5',
    correct: 'b',
    title: 'Espírito modernizador moderado',
    options: [
      { value: 'a', label: 'Uma força revolucionária que destruiu as oligarquias agrárias.' },
      { value: 'b', label: 'Uma burguesia de “espírito modernizador moderado”, que preferia mudanças graduais e acomodações.' },
      { value: 'c', label: 'Um grupo industrializado liderado pelo proletariado urbano.' },
      { value: 'd', label: 'Uma classe que rejeitava totalmente o Estado e criou instituições próprias de poder.' },
    ],
    explanation:
      'A burguesia brasileira não assumiu o papel de paladina da modernidade universal. Ela se ajustou à situação com múltiplos interesses e adaptações ambíguas, preferindo a mudança gradual e a composição a uma modernização impetuosa e avassaladora.',
  },
];

const STORAGE_KEY = 'florestan_quiz_result';

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const stepBlocked = document.getElementById('step-blocked');
const stepEmail = document.getElementById('step-email');
const stepResult = document.getElementById('step-result');
const quizForm = document.getElementById('quiz-form');

const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const btnStart = document.getElementById('btn-start');
const btnSubmit = document.getElementById('btn-submit');

const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const scoreCircle = document.getElementById('score-circle');
const scoreValue = document.getElementById('score-value');
const explanationsEl = document.getElementById('explanations');

let currentStepIndex = 0;

function getAllSteps() {
  return [stepBlocked, stepEmail, ...QUESTIONS.map((_, i) => document.getElementById(`step-q${i + 1}`)), stepResult];
}

function init() {
  renderQuestions();

  const saved = loadResult();
  if (saved) {
    showBlockedScreen(saved);
  } else {
    showStep(1); // começa na tela de e-mail (índice 1, pois 0 é bloqueio)
  }
}

function renderQuestions() {
  QUESTIONS.forEach((q) => {
    const container = document.querySelector(`.options[data-question="${q.name}"]`);
    if (!container) return;

    container.innerHTML = q.options
      .map(
        (opt) => `
        <label class="option">
          <input type="radio" name="${q.name}" value="${opt.value}" required>
          <span class="option-letter">${opt.value.toUpperCase()}</span>
          <span class="option-text">${opt.label}</span>
        </label>
      `
      )
      .join('');

    container.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener('change', () => resetValidation(q.name));
    });
  });

  QUESTIONS.forEach((q, index) => {
    const section = document.getElementById(`step-q${index + 1}`);
    const prevBtn = section.querySelector('.btn-prev');
    const nextBtn = section.querySelector('.btn-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        console.log(`[Quiz] Voltar da pergunta ${index + 1}`);
        showStep(currentStepIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        console.log(`[Quiz] Próxima da pergunta ${index + 1}`);
        if (!validateQuestion(q.name)) {
          console.log(`[Quiz] Pergunta ${index + 1} não respondida`);
          return;
        }
        resetValidation(q.name);
        showStep(currentStepIndex + 1);
      });
    }
  });
}

function showStep(index) {
  currentStepIndex = index;

  getAllSteps().forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });

  updateProgress();
}

function updateProgress() {
  const questionCount = QUESTIONS.length;
  let percent;
  let label;

  if (currentStepIndex === 1) {
    percent = 0;
    label = 'Identificação';
  } else if (currentStepIndex >= 2 && currentStepIndex <= questionCount + 1) {
    percent = ((currentStepIndex - 2) / questionCount) * 100;
    label = `Pergunta ${currentStepIndex - 1} de ${questionCount}`;
  } else {
    percent = 100;
    label = 'Resultado';
  }

  progressBar.style.width = `${percent}%`;
  progressText.textContent = label;
}

function showBlockedScreen(saved) {
  getAllSteps().forEach((step) => step.classList.remove('active'));
  stepBlocked.classList.add('active');

  const blockedScoreCircle = document.getElementById('blocked-score-circle');
  const blockedScoreValue = document.getElementById('blocked-score-value');
  const blockedMessage = document.getElementById('blocked-message');
  const blockedExplanations = document.getElementById('blocked-explanations');

  blockedScoreValue.textContent = saved.score;
  blockedScoreCircle.style.setProperty('--score', saved.score);

  const total = QUESTIONS.length;
  if (saved.score === total) {
    blockedMessage.textContent = 'Parabéns! Você acertou todas as perguntas.';
  } else if (saved.score >= total / 2) {
    blockedMessage.textContent = 'Você foi bem! Confira as explicações para revisar os pontos que errou.';
  } else {
    blockedMessage.textContent = 'Releia o texto de Florestan e acompanhe as explicações abaixo.';
  }

  blockedExplanations.innerHTML = buildExplanations(saved.answers);

  progressBar.style.width = '100%';
  progressText.textContent = 'Resultado salvo';
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = value !== '' && emailRegex.test(value);

  emailInput.classList.toggle('invalid', !isValid && value !== '');
  emailError.classList.toggle('visible', !isValid && value !== '');

  return isValid;
}

function validateQuestion(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  const errorEl = document.getElementById(`${name}-error`);
  const isValid = !!selected;

  errorEl.classList.toggle('visible', !isValid);

  return isValid;
}

function resetValidation(name) {
  const errorEl = document.getElementById(`${name}-error`);
  if (errorEl) errorEl.classList.remove('visible');
}

function getAnswer(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : null;
}

function buildExplanations(answers) {
  return QUESTIONS.map((q) => {
    const userAnswer = answers[q.name];
    const isCorrect = userAnswer === q.correct;
    const statusClass = isCorrect ? 'correct' : 'wrong';
    const statusText = isCorrect ? 'Correto' : 'Incorreto';

    return `
      <div class="explanation">
        <span class="explanation-status ${statusClass}">${statusText}</span>
        <p class="explanation-title">${q.title}</p>
        <p class="explanation-text">${q.explanation}</p>
      </div>
    `;
  }).join('');
}

function loadResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.completed === true) return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

function saveResult(result) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch (e) {
    console.warn('Não foi possível salvar o resultado:', e);
  }
}

// Eventos: e-mail
btnStart.addEventListener('click', () => {
  if (!validateEmail()) {
    emailInput.focus();
    return;
  }
  showStep(2);
});

emailInput.addEventListener('input', validateEmail);
emailInput.addEventListener('blur', validateEmail);
emailInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    btnStart.click();
  }
});

// Eventos: envio
quizForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const lastQuestion = QUESTIONS[QUESTIONS.length - 1];
  if (!validateQuestion(lastQuestion.name)) return;

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Enviando...';

  const answers = {};
  let score = 0;

  QUESTIONS.forEach((q) => {
    answers[q.name] = getAnswer(q.name);
    if (answers[q.name] === q.correct) score += 1;
  });

  const result = {
    completed: true,
    email: emailInput.value.trim(),
    score,
    answers,
    submittedAt: new Date().toISOString(),
  };
  saveResult(result);

  scoreValue.textContent = score;
  scoreCircle.style.setProperty('--score', score);

  const total = QUESTIONS.length;
  if (score === total) {
    resultTitle.textContent = 'Excelente!';
    resultMessage.textContent = 'Você acertou todas as perguntas e demonstrou ótima compreensão do argumento de Florestan Fernandes.';
  } else if (score >= total / 2) {
    resultTitle.textContent = 'Muito bem!';
    resultMessage.textContent = `Você acertou ${score} de ${total}. Revise as explicações abaixo.`;
  } else {
    resultTitle.textContent = 'Estude um pouco mais';
    resultMessage.textContent = `Você acertou ${score} de ${total}. Releia o texto de Florestan. As explicações abaixo ajudam!`;
  }

  explanationsEl.innerHTML = buildExplanations(answers);
  showStep(QUESTIONS.length + 2);

  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Enviar respostas';
});

// Inicializa
document.addEventListener('DOMContentLoaded', init);
