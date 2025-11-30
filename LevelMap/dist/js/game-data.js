// Game Data Management with Supabase
// This file handles saving game progress, scores, and telemetry data

// Save level completion
async function saveLevelCompletion(levelId, score, telemetryData = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        console.error('User not authenticated');
        return { success: false, error: 'Not authenticated' };
    }
    
    const userId = session.user.id;
    
    try {
        // Save score to scores table
        const { data: scoreData, error: scoreError } = await supabase
            .from('scores')
            .insert([
                {
                    user_id: userId,
                    level_id: levelId,
                    score: score,
                    recorded_at: new Date().toISOString()
                }
            ])
            .select();
        
        if (scoreError) throw scoreError;
        
        // If telemetry data is provided, save it
        if (Object.keys(telemetryData).length > 0) {
            const { error: telemetryError } = await supabase
                .from('telemetry_sessions')
                .insert([
                    {
                        user_id: userId,
                        session_id: telemetryData.session_id || generateSessionId(),
                        level_id: levelId,
                        total_questions: telemetryData.total_questions || 0,
                        wrong_answers: telemetryData.wrong_answers || 0,
                        scene_runs: telemetryData.scene_runs || 1,
                        time_zone_3d: telemetryData.time_zone_3d || 0,
                        time_training_2d: telemetryData.time_training_2d || 0,
                        timestamp_start: telemetryData.timestamp_start || new Date().toISOString(),
                        timestamp_end: telemetryData.timestamp_end || new Date().toISOString(),
                        hint_used: telemetryData.hint_used || false,
                        final_score: score
                    }
                ]);
            
            if (telemetryError) {
                console.warn('Error saving telemetry:', telemetryError);
            }
        }
        
        // Mark level as completed in localStorage (for immediate UI update)
        localStorage.setItem(`level${levelId}Completed`, 'true');
        
        return { success: true, data: scoreData };
        
    } catch (error) {
        console.error('Error saving level completion:', error);
        return { success: false, error: error.message };
    }
}

// Get user's level progress
async function getUserProgress() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        return { completedLevels: [], highScores: {} };
    }
    
    const userId = session.user.id;
    
    try {
        // Get all scores for this user
        const { data: scores, error } = await supabase
            .from('scores')
            .select('*')
            .eq('user_id', userId)
            .order('recorded_at', { ascending: false });
        
        if (error) throw error;
        
        // Process scores to get completed levels and high scores
        const completedLevels = new Set();
        const highScores = {};
        
        scores.forEach(score => {
            completedLevels.add(score.level_id);
            
            if (!highScores[score.level_id] || score.score > highScores[score.level_id]) {
                highScores[score.level_id] = score.score;
            }
        });
        
        return {
            completedLevels: Array.from(completedLevels),
            highScores: highScores,
            totalScore: Object.values(highScores).reduce((a, b) => a + b, 0)
        };
        
    } catch (error) {
        console.error('Error getting user progress:', error);
        return { completedLevels: [], highScores: {} };
    }
}

// Get leaderboard data
async function getLeaderboard(levelId = null, limit = 10) {
    try {
        let query = supabase
            .from('scores')
            .select(`
                *,
                users (username, school_name)
            `)
            .order('score', { ascending: false })
            .limit(limit);
        
        if (levelId) {
            query = query.eq('level_id', levelId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return [];
    }
}

// Generate unique session ID
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Save telemetry data from Unity game
async function saveTelemetryData(telemetryData) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        console.error('User not authenticated');
        return { success: false, error: 'Not authenticated' };
    }
    
    const userId = session.user.id;
    
    try {
        const { data, error } = await supabase
            .from('telemetry_sessions')
            .insert([
                {
                    user_id: userId,
                    ...telemetryData
                }
            ])
            .select();
        
        if (error) throw error;
        
        return { success: true, data };
        
    } catch (error) {
        console.error('Error saving telemetry:', error);
        return { success: false, error: error.message };
    }
}

// Unity WebGL can call this function to save game data
window.UnityGameData = {
    saveLevelCompletion,
    saveTelemetryData,
    getUserProgress,
    getLeaderboard
};

