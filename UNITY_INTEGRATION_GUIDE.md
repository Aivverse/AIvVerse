# 🎮 Unity WebGL Integration Guide for ALvVERSE

## Overview

This guide shows you how to integrate Unity WebGL games with your ALvVERSE platform, including:
- ✅ Sending game data to Supabase database
- ✅ One-time play restriction (play each level once)
- ✅ Replay mode after completing all levels
- ✅ Tracking time taken, hints used, pass/fail status
- ✅ Level progression management

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Flow                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                    Home/About/FAQ
                              │
                    Click "MAP" button
                              │
                    Login with Google
                              │
                    See Level Map (14 levels)
                              │
                    Click Current Level
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
     First Time Play                    Replay Mode
      (Level locked                  (All levels completed,
       after completion)               can replay any)
            │                                   │
            └─────────────────┬─────────────────┘
                              │
                    Unity WebGL Game Loads
                              │
                    User plays game
                              │
                ┌─────────────┴─────────────┐
                │                           │
             Pass                        Fail
                │                           │
        Save to Database          Save telemetry only
        Mark as completed           No progression
        Unlock next level          Can retry
                │                           │
                └─────────────┬─────────────┘
                              │
                    Return to Level Map
                              │
                    Level status updated
```

---

## 📊 Data Flow

```
Unity Game (C#)
    │
    │ 1. Game starts → Call onLevelStart()
    │
    │ 2. User plays
    │
    │ 3. Game ends → Call onLevelComplete(data)
    │
    ▼
unity-bridge.js (JavaScript)
    │
    │ Process game data
    │ Validate user session
    │
    ▼
Supabase Database
    │
    ├─→ scores table (if passed)
    │   • user_id
    │   • level_id
    │   • score
    │   • recorded_at
    │
    └─→ telemetry_sessions table
        • user_id
        • session_id
        • level_id
        • total_questions
        • wrong_answers
        • scene_runs
        • time_zone_3d (3D gameplay time)
        • time_training_2d (2D training time)
        • timestamp_start
        • timestamp_end
        • hint_used
        • final_score
```

---

## 🎯 Unity C# Implementation

### Step 1: Create WebGL Bridge Script

Create a new C# script: `WebGLBridge.cs`

```csharp
using UnityEngine;
using System.Runtime.InteropServices;
using System;

public class WebGLBridge : MonoBehaviour
{
    // Import JavaScript functions
    [DllImport("__Internal")]
    private static extern string UnityGameAPI_onLevelStart(string levelId, string sessionId);
    
    [DllImport("__Internal")]
    private static extern string UnityGameAPI_onLevelComplete(string gameDataJson);
    
    [DllImport("__Internal")]
    private static extern string UnityGameAPI_getUserInfo();
    
    [DllImport("__Internal")]
    private static extern string UnityGameAPI_canPlayLevel(string levelId);
    
    [DllImport("__Internal")]
    private static extern void UnityGameAPI_returnToMap();

    // Singleton instance
    public static WebGLBridge Instance { get; private set; }

    private string currentLevelId;
    private string currentSessionId;
    private DateTime startTime;
    private float time3D = 0f;
    private float time2D = 0f;

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    /// <summary>
    /// Call this when level starts
    /// </summary>
    public void StartLevel(string levelId)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        currentLevelId = levelId;
        currentSessionId = "session_" + DateTime.Now.Ticks;
        startTime = DateTime.Now;
        
        try
        {
            string result = UnityGameAPI_onLevelStart(levelId, currentSessionId);
            Debug.Log("Level started: " + result);
        }
        catch (Exception e)
        {
            Debug.LogError("Error calling onLevelStart: " + e.Message);
        }
        #else
        Debug.Log("WebGL Bridge: StartLevel called (Editor mode)");
        #endif
    }

    /// <summary>
    /// Track 3D gameplay time
    /// </summary>
    public void AddTime3D(float deltaTime)
    {
        time3D += deltaTime;
    }

    /// <summary>
    /// Track 2D training time
    /// </summary>
    public void AddTime2D(float deltaTime)
    {
        time2D += deltaTime;
    }

    /// <summary>
    /// Call this when level is completed
    /// </summary>
    public void CompleteLevel(bool passed, int score, int totalQuestions, 
                             int wrongAnswers, bool hintUsed, int sceneRuns = 1)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        try
        {
            // Calculate total time taken
            float totalTime = (float)(DateTime.Now - startTime).TotalSeconds;
            
            // Create game data object
            GameCompletionData data = new GameCompletionData
            {
                levelId = currentLevelId,
                sessionId = currentSessionId,
                passed = passed,
                score = score,
                timeTaken = totalTime,
                totalQuestions = totalQuestions,
                wrongAnswers = wrongAnswers,
                hintUsed = hintUsed,
                time3D = time3D,
                time2D = time2D,
                sceneRuns = sceneRuns
            };
            
            // Convert to JSON
            string jsonData = JsonUtility.ToJson(data);
            Debug.Log("Sending game data: " + jsonData);
            
            // Call JavaScript function
            string result = UnityGameAPI_onLevelComplete(jsonData);
            Debug.Log("Level completion result: " + result);
            
            // Wait 2 seconds then return to map
            Invoke("ReturnToMap", 2f);
        }
        catch (Exception e)
        {
            Debug.LogError("Error calling onLevelComplete: " + e.Message);
        }
        #else
        Debug.Log($"WebGL Bridge: CompleteLevel called (Editor mode) - Passed: {passed}, Score: {score}");
        #endif
    }

    /// <summary>
    /// Return to level map
    /// </summary>
    public void ReturnToMap()
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        UnityGameAPI_returnToMap();
        #else
        Debug.Log("WebGL Bridge: ReturnToMap called (Editor mode)");
        #endif
    }

    /// <summary>
    /// Get user information from browser
    /// </summary>
    public UserInfo GetUserInfo()
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        try
        {
            string json = UnityGameAPI_getUserInfo();
            return JsonUtility.FromJson<UserInfo>(json);
        }
        catch (Exception e)
        {
            Debug.LogError("Error getting user info: " + e.Message);
            return new UserInfo { username = "Player" };
        }
        #else
        return new UserInfo { username = "TestPlayer", email = "test@example.com" };
        #endif
    }
}

// Data structures
[Serializable]
public class GameCompletionData
{
    public string levelId;
    public string sessionId;
    public bool passed;
    public int score;
    public float timeTaken;
    public int totalQuestions;
    public int wrongAnswers;
    public bool hintUsed;
    public float time3D;
    public float time2D;
    public int sceneRuns;
}

[Serializable]
public class UserInfo
{
    public string username;
    public string email;
    public string userId;
}
```

---

### Step 2: Create Game Manager

Create `GameManager.cs`:

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class GameManager : MonoBehaviour
{
    [Header("Game Settings")]
    public string levelId = "level_1"; // Set this in inspector
    
    [Header("UI")]
    public TextMeshProUGUI usernameText;
    public TextMeshProUGUI scoreText;
    public GameObject completionPanel;
    public TextMeshProUGUI resultText;
    
    // Game state
    private int currentScore = 0;
    private int totalQuestions = 10;
    private int wrongAnswers = 0;
    private bool hintUsed = false;
    private bool isIn3DMode = true;
    
    void Start()
    {
        // Start the level
        WebGLBridge.Instance.StartLevel(levelId);
        
        // Get and display user info
        UserInfo userInfo = WebGLBridge.Instance.GetUserInfo();
        if (usernameText != null)
        {
            usernameText.text = "Player: " + userInfo.username;
        }
        
        // Hide completion panel
        if (completionPanel != null)
        {
            completionPanel.SetActive(false);
        }
    }
    
    void Update()
    {
        // Track time based on game mode
        if (isIn3DMode)
        {
            WebGLBridge.Instance.AddTime3D(Time.deltaTime);
        }
        else
        {
            WebGLBridge.Instance.AddTime2D(Time.deltaTime);
        }
    }
    
    // Call this when switching between 3D and 2D modes
    public void SetGameMode(bool is3D)
    {
        isIn3DMode = is3D;
    }
    
    // Call this when player answers correctly
    public void OnCorrectAnswer(int points)
    {
        currentScore += points;
        UpdateScoreDisplay();
    }
    
    // Call this when player answers incorrectly
    public void OnWrongAnswer()
    {
        wrongAnswers++;
    }
    
    // Call this when player uses a hint
    public void OnHintUsed()
    {
        hintUsed = true;
    }
    
    // Call this when level is completed successfully
    public void OnLevelPassed()
    {
        bool passed = true;
        WebGLBridge.Instance.CompleteLevel(
            passed,
            currentScore,
            totalQuestions,
            wrongAnswers,
            hintUsed
        );
        
        ShowCompletionScreen("Level Passed!", true);
    }
    
    // Call this when level is failed
    public void OnLevelFailed()
    {
        bool passed = false;
        WebGLBridge.Instance.CompleteLevel(
            passed,
            0, // No score for failed
            totalQuestions,
            wrongAnswers,
            hintUsed
        );
        
        ShowCompletionScreen("Level Failed - Try Again!", false);
    }
    
    void ShowCompletionScreen(string message, bool passed)
    {
        if (completionPanel != null)
        {
            completionPanel.SetActive(true);
        }
        
        if (resultText != null)
        {
            resultText.text = message;
            resultText.color = passed ? Color.green : Color.red;
        }
    }
    
    void UpdateScoreDisplay()
    {
        if (scoreText != null)
        {
            scoreText.text = "Score: " + currentScore;
        }
    }
    
    // Button handler to return to map
    public void OnReturnToMapClicked()
    {
        WebGLBridge.Instance.ReturnToMap();
    }
}
```

---

### Step 3: Setup in Unity

1. **Create Empty GameObject:**
   - Name it "WebGLBridge"
   - Add `WebGLBridge.cs` component
   - This persists across scenes

2. **Create Game Manager:**
   - Name it "GameManager"
   - Add `GameManager.cs` component
   - Set `levelId` in inspector (e.g., "level_1", "level_2", etc.)

3. **Connect UI:**
   - Assign UI elements in GameManager inspector
   - Create completion panel with result text
   - Add "Return to Map" button

4. **Build Settings:**
   - File → Build Settings
   - Platform: WebGL
   - Add your game scenes
   - Click "Build"

---

## 🌐 Web Integration

### Step 1: Create Level HTML Page

For each level, create `level1.html` (example):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Level 1 - ALvVERSE</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #1a1a1a;
            overflow: hidden;
        }
        
        #unity-container {
            width: 100vw;
            height: 100vh;
        }
        
        #unity-canvas {
            width: 100%;
            height: 100%;
        }
        
        #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div id="unity-container">
        <canvas id="unity-canvas"></canvas>
        <div id="loading">Loading Game...</div>
    </div>

    <!-- Supabase Client -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <!-- Your Config -->
    <script src="/js/supabase-config.js"></script>
    <script src="/js/unity-bridge.js"></script>
    
    <!-- Unity Loader (from your build) -->
    <script src="/unity-builds/level1/Build/level1.loader.js"></script>
    
    <script>
        // Check authentication
        (async function() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('Please login first!');
                window.location.href = '/login.html';
                return;
            }
            
            // Load Unity
            createUnityInstance(document.querySelector("#unity-canvas"), {
                dataUrl: "/unity-builds/level1/Build/level1.data",
                frameworkUrl: "/unity-builds/level1/Build/level1.framework.js",
                codeUrl: "/unity-builds/level1/Build/level1.wasm",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "ALvVERSE",
                productName: "Level 1",
                productVersion: "1.0",
            }).then((unityInstance) => {
                document.getElementById('loading').style.display = 'none';
            }).catch((message) => {
                alert('Failed to load game: ' + message);
            });
        })();
    </script>
</body>
</html>
```

---

## 📋 Implementation Checklist

### Unity Side:
- [ ] Create WebGLBridge.cs script
- [ ] Create GameManager.cs script
- [ ] Set up WebGLBridge GameObject (DontDestroyOnLoad)
- [ ] Set up GameManager in each level scene
- [ ] Set correct levelId in inspector
- [ ] Call StartLevel() at scene start
- [ ] Call CompleteLevel() when game ends
- [ ] Track time with AddTime3D() and AddTime2D()
- [ ] Build as WebGL

### Web Side:
- [ ] Create level HTML files (level1.html, level2.html, etc.)
- [ ] Include unity-bridge.js in each level page
- [ ] Place Unity build files in /unity-builds/ folder
- [ ] Test authentication check
- [ ] Test data saving to Supabase

### Database:
- [ ] Run schema.sql in Supabase (if not done)
- [ ] Verify tables exist: users, scores, telemetry_sessions
- [ ] Disable RLS for testing
- [ ] Test data insertion

---

## 🧪 Testing

### Test Flow:

1. **Login:**
   - Go to `http://localhost:8080/login.html`
   - Login with Google
   - Redirected to Level Map

2. **Play Level:**
   - Click on level 1 (current level)
   - Unity game loads
   - Play and complete game
   - Data saved to Supabase

3. **Verify Data:**
   - Go to Supabase Dashboard
   - Check `scores` table - should see new entry
   - Check `telemetry_sessions` table - should see session data

4. **Check Progression:**
   - Return to Level Map
   - Level 1 should show as completed
   - Level 2 should be unlocked
   - Try clicking level 1 again - should be locked

5. **Complete All Levels:**
   - Complete levels 1-14
   - Return to map
   - All levels completed
   - Click any level - should allow replay

---

## 📊 Example Game Data

### When Level is Passed:

```json
{
  "levelId": "level_1",
  "sessionId": "session_1234567890",
  "passed": true,
  "score": 850,
  "timeTaken": 125.5,
  "totalQuestions": 10,
  "wrongAnswers": 2,
  "hintUsed": true,
  "time3D": 75.5,
  "time2D": 50.0,
  "sceneRuns": 1
}
```

### When Level is Failed:

```json
{
  "levelId": "level_1",
  "sessionId": "session_1234567891",
  "passed": false,
  "score": 0,
  "timeTaken": 90.0,
  "totalQuestions": 10,
  "wrongAnswers": 6,
  "hintUsed": false,
  "time3D": 60.0,
  "time2D": 30.0,
  "sceneRuns": 1
}
```

---

## 🐛 Troubleshooting

### Unity game doesn't load:
- Check browser console for errors
- Verify Unity build files are in correct folder
- Check file paths in HTML

### Data not saving:
- Check browser console for Supabase errors
- Verify user is authenticated
- Check RLS is disabled in Supabase
- Check table permissions

### Level restriction not working:
- Clear localStorage and try again
- Check localStorage in browser DevTools
- Verify levelId matches in Unity and database

### JavaScript functions not found:
- Make sure unity-bridge.js is loaded before Unity
- Check browser console for errors
- Verify function names match in C# and JS

---

## 🎯 Your Complete System

```
Home Page (index.html)
    └─→ Click MAP
        └─→ Login Page (login.html)
            └─→ Google OAuth
                └─→ Level Map (LevelMap/dist/index.html)
                    └─→ Click Level (level1.html)
                        └─→ Unity WebGL Game
                            ├─→ Game Passed
                            │   ├─→ Save to scores table
                            │   ├─→ Save to telemetry_sessions
                            │   ├─→ Mark level completed
                            │   ├─→ Unlock next level
                            │   └─→ Return to map
                            │
                            └─→ Game Failed
                                ├─→ Save to telemetry_sessions only
                                ├─→ No progression
                                └─→ Return to map (can retry)
```

---

## 🎉 Summary

✅ **One-time play per level** - Users can only play each level once  
✅ **Replay after completion** - After all 14 levels, can replay any  
✅ **Complete data tracking** - Time, hints, questions, pass/fail  
✅ **Automatic progression** - Next level unlocks on pass  
✅ **Supabase integration** - All data saved to database  
✅ **Unity WebGL ready** - Full C# integration code provided  

---

*Your system is now fully configured for Unity WebGL integration!*

