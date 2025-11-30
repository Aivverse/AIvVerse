const LEVEL_ID_PREFIX = 'level_';
const DEFAULT_ALLOWED_WRONG_ANSWERS = 2;
window.ALVERSE_TOTAL_LEVELS = window.ALVERSE_TOTAL_LEVELS || 14;
const TOTAL_LEVELS =
  Number(window.ALVERSE_TOTAL_LEVELS) && !Number.isNaN(Number(window.ALVERSE_TOTAL_LEVELS))
    ? Number(window.ALVERSE_TOTAL_LEVELS)
    : 14;

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

const sanitiseLevelId = (value) => {
  if (typeof value === 'number') {
    return `${LEVEL_ID_PREFIX}${value}`;
  }
  if (typeof value === 'string') {
    if (value.startsWith(LEVEL_ID_PREFIX)) return value;
    if (/^\d+$/.test(value)) {
      return `${LEVEL_ID_PREFIX}${value}`;
    }
    return value;
  }
  return `${LEVEL_ID_PREFIX}1`;
};

const parseLevelNumber = (levelId) => {
  if (!levelId) return NaN;
  const match = levelId.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : NaN;
};

const deriveAllowedWrongAnswers = (data) => {
  const explicit =
    toNumber(data.allowedWrongAnswers) ??
    toNumber(data.maxWrongAnswers) ??
    toNumber(data.allowedMistakes);
  if (typeof explicit === 'number') {
    return explicit;
  }
  if (typeof data.totalQuestions === 'number' && data.totalQuestions > 0) {
    return Math.max(0, Math.floor(data.totalQuestions * 0.25));
  }
  return DEFAULT_ALLOWED_WRONG_ANSWERS;
};

const determinePassState = (data) => {
  if (typeof data.passed === 'boolean') return data.passed;
  if (typeof data.levelCompleted === 'boolean') return data.levelCompleted;
  if (typeof data.isComplete === 'boolean') return data.isComplete;

  const videoCompleted = toBoolean(data.videoCompleted);
  if (typeof videoCompleted === 'boolean') {
    return videoCompleted;
  }

  if (typeof data.wrongAnswers === 'number') {
    const allowed = deriveAllowedWrongAnswers(data);
    return data.wrongAnswers <= allowed;
  }

  const finalScore =
    typeof data.finalScore === 'number' ? data.finalScore : toNumber(data.score);

  if (typeof finalScore === 'number') {
    return finalScore > 0;
  }

  return true;
};

const normaliseGameData = (raw = {}) => {
  const totalQuestions = toNumber(raw.totalQuestions ?? raw.total_questions);
  const wrongAnswers = toNumber(raw.wrongAnswers ?? raw.wrong_answers);
  const sceneRuns = toNumber(raw.sceneRuns ?? raw.scene_runs);
  const time3D =
    toNumber(
      raw.timeToFindTrainingZonein3D ??
        raw.time_zone_3d ??
        raw.time3D ??
        raw.timeToFindZone
    );
  const time2D =
    toNumber(
      raw.timeSpendinTraining2D ??
        raw.time_training_2d ??
        raw.time2D ??
        raw.timeInTraining2D ??
        raw.timeSpentInTraining2D
    );
  const startTimestamp =
    raw.initialTimestamp ??
    raw.initial_time ??
    raw.timestamp_start ??
    raw.startTimestamp ??
    raw.startTime;
  const endTimestamp =
    raw.finalTimestamp ??
    raw.final_time ??
    raw.timestamp_end ??
    raw.endTimestamp ??
    raw.endTime ??
    raw.finishTime;
  const hintUsed = toBoolean(raw.hintUsed ?? raw.hint_used ?? raw.usedHint) ?? false;
  const finalScore = toNumber(raw.finalScore ?? raw.score) ?? 0;
  const levelId = sanitiseLevelId(
    raw.levelID ?? raw.levelId ?? raw.level_id ?? raw.level ?? raw.levelNumber ?? `${LEVEL_ID_PREFIX}1`
  );
  const levelNumber = parseLevelNumber(levelId);
  const sessionId = raw.sessionID ?? raw.sessionId ?? raw.session_id ?? raw.session ?? null;
  const userIdFromPayload = raw.userID ?? raw.userId ?? raw.uid ?? raw.user_id ?? null;
  const passed = determinePassState({
    ...raw,
    totalQuestions,
    wrongAnswers,
    finalScore,
  });

  return {
    levelId,
    levelNumber,
    sessionId,
    userIdFromPayload,
    totalQuestions,
    wrongAnswers,
    sceneRuns,
    time3D,
    time2D,
    startTimestamp,
    endTimestamp,
    hintUsed,
    finalScore,
    passed,
  };
};

const dispatchProgressSyncEvent = () => {
  try {
    window.dispatchEvent(new CustomEvent('alvverse:progress-updated'));
  } catch (error) {
    console.warn('Failed to dispatch progress update event', error);
  }
};

window.UnityGameAPI = {
  onLevelStart: function (levelId, sessionId) {
    const normalisedLevelId = sanitiseLevelId(levelId);
    const normalisedSessionId = sessionId || `session_${Date.now()}`;
    console.log(
      `[Unity Bridge] Level started: ${normalisedLevelId}, Session: ${normalisedSessionId}`
    );

    const startData = {
      levelId: normalisedLevelId,
      sessionId: normalisedSessionId,
      startTime: new Date().toISOString(),
      userId: localStorage.getItem('userId'),
    };

    sessionStorage.setItem('currentGameSession', JSON.stringify(startData));

    return JSON.stringify({ success: true, message: 'Level started', sessionId: normalisedSessionId });
  },

  onLevelComplete: async function (gameDataJson) {
    console.log('[Unity Bridge] Level completed, data:', gameDataJson);

    try {
      const rawPayload =
        typeof gameDataJson === 'string' ? JSON.parse(gameDataJson) : gameDataJson;
      const normalisedData = normaliseGameData(rawPayload);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return JSON.stringify({ success: false, error: 'User not authenticated' });
      }

      if (
        normalisedData.userIdFromPayload &&
        normalisedData.userIdFromPayload !== session.user.id
      ) {
        console.warn(
          '[Unity Bridge] Supabase session user does not match payload user ID. Proceeding with authenticated user.'
        );
      }

      const userId = session.user.id;
      const nowIso = new Date().toISOString();
      const sessionDataStr = sessionStorage.getItem('currentGameSession');
      const sessionData = sessionDataStr ? JSON.parse(sessionDataStr) : {};

      const startTimestamp = normalisedData.startTimestamp || sessionData.startTime || nowIso;
      const endTimestamp = normalisedData.endTimestamp || nowIso;
      const sessionIdentifier =
        normalisedData.sessionId || sessionData.sessionId || `session_${Date.now()}`;

      const telemetryPayload = {
        user_id: userId,
        session_id: sessionIdentifier,
        level_id: normalisedData.levelId,
        total_questions: normalisedData.totalQuestions ?? 0,
        wrong_answers: normalisedData.wrongAnswers ?? 0,
        scene_runs: normalisedData.sceneRuns ?? 1,
        time_zone_3d: normalisedData.time3D ?? 0,
        time_training_2d: normalisedData.time2D ?? 0,
        timestamp_start: startTimestamp,
        timestamp_end: endTimestamp,
        hint_used: normalisedData.hintUsed,
        final_score: normalisedData.finalScore ?? 0,
      };

      const { error: telemetryError } = await supabase
        .from('telemetry_sessions')
        .insert([telemetryPayload]);

      if (telemetryError) {
        console.error('[Unity Bridge] Error saving telemetry:', telemetryError);
      }

      sessionStorage.removeItem('currentGameSession');

      if (normalisedData.passed) {
        const { error: scoreError } = await supabase
          .from('scores')
          .insert([
            {
              user_id: userId,
              level_id: normalisedData.levelId,
              score: normalisedData.finalScore ?? 0,
              recorded_at: nowIso,
            },
          ]);

        if (scoreError) {
          throw scoreError;
        }

        if (!Number.isNaN(normalisedData.levelNumber)) {
          localStorage.setItem(`level${normalisedData.levelNumber}Completed`, 'true');
        }

        dispatchProgressSyncEvent();

        return JSON.stringify({
          success: true,
          message: 'Level completed and saved',
          score: normalisedData.finalScore ?? 0,
          canProceed: true,
        });
      }

      return JSON.stringify({
        success: true,
        message: 'Level failed - try again',
        score: normalisedData.finalScore ?? 0,
        canProceed: false,
      });
    } catch (error) {
      console.error('[Unity Bridge] Error processing game completion:', error);
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save game data',
      });
    }
  },

  getUserInfo: function () {
    const username = localStorage.getItem('username') || 'Player';
    const email = localStorage.getItem('userEmail') || '';
    const userId = localStorage.getItem('userId') || '';

    return JSON.stringify({
      username,
      email,
      userId,
    });
  },

  canPlayLevel: async function (levelId) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return JSON.stringify({ canPlay: false, reason: 'User not authenticated' });
    }

    const normalisedLevelId = sanitiseLevelId(levelId);
    const targetLevelNumber = parseLevelNumber(normalisedLevelId);

    const progress = await window.UnityGameData.getUserProgress();
    const completedIds = new Set(progress.completedLevelIds || []);
    const completedNumbers = progress.completedLevels || [];

    const hasCompletedLevel =
      completedIds.has(normalisedLevelId) || completedNumbers.includes(targetLevelNumber);
    const allCompleted =
      completedNumbers.length >= TOTAL_LEVELS || completedIds.size >= TOTAL_LEVELS;

    if (hasCompletedLevel && !allCompleted) {
      return JSON.stringify({
        canPlay: false,
        reason: 'Level already completed. Finish all levels to unlock replay mode.',
      });
    }

    return JSON.stringify({
      canPlay: true,
      reason: allCompleted ? 'Replay mode active' : 'First time play',
    });
  },

  returnToMap: function () {
    localStorage.removeItem('replayMode');
    window.location.href = '/LevelMap/dist/index.html';
  },
};

window.UnityGameData = {
  ...(window.UnityGameData || {}),
  saveLevelCompletion: window.UnityGameAPI.onLevelComplete,
  getUserProgress: async function () {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { completedLevels: [], completedLevelIds: [], highScores: {}, totalScore: 0 };
    }

    const userId = session.user.id;

    try {
      const { data: scores, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: true });

      if (error) {
        throw error;
      }

      const completedLevelIds = new Set();
      const completedLevelNumbers = new Set();
      const highScores = {};

      (scores || []).forEach((score) => {
        const levelId = sanitiseLevelId(score.level_id);
        completedLevelIds.add(levelId);
        const levelNumber = parseLevelNumber(levelId);
        if (!Number.isNaN(levelNumber)) {
          completedLevelNumbers.add(levelNumber);
        }

        const scoreValue = toNumber(score.score) ?? 0;
        if (!highScores[levelId] || scoreValue > highScores[levelId]) {
          highScores[levelId] = scoreValue;
        }
      });

      const numericLevels = Array.from(completedLevelNumbers).sort((a, b) => a - b);

      return {
        completedLevels: numericLevels,
        completedLevelIds: Array.from(completedLevelIds),
        highScores,
        totalScore: Object.values(highScores).reduce((acc, value) => acc + value, 0),
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return { completedLevels: [], completedLevelIds: [], highScores: {}, totalScore: 0 };
    }
  },

  getLeaderboard: async function (levelId = null, limit = 10) {
    try {
      let query = supabase
        .from('scores')
        .select('
                *,
                users (username, school_name)
            ')
        .order('score', { ascending: false })
        .limit(limit);

      if (levelId) {
        query = query.eq('level_id', sanitiseLevelId(levelId));
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  },
};

console.log('[Unity Bridge] Initialised successfully');
