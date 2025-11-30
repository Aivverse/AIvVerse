#pragma once
#include <drogon/HttpController.h>
using namespace drogon;

class GameController : public drogon::HttpController<GameController>
{
  public:
    METHOD_LIST_BEGIN
        ADD_METHOD_TO(GameController::validate_token, "/api/game/validate", Post);
        ADD_METHOD_TO(GameController::submit_telemetry, "/api/game/telemetry", Post);
        ADD_METHOD_TO(GameController::update_score, "/api/game/score", Post);
    METHOD_LIST_END

    // 1. Validate Token (Unity calls this on start)
    void validate_token(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) {
        auto json = req->getJsonObject();
        if (!json) { callback(HttpResponse::newHttpResponse(k400BadRequest, CT_NONE)); return; }

        std::string userId = (*json)["userID"].asString();
        std::string token = (*json)["authToken"].asString();

        auto db = app().getDbClient();
        db->execSqlAsync(
            "SELECT * FROM users WHERE uid = $1 AND auth_token = $2",
            [callback](const drogon::orm::Result &r) {
                Json::Value ret;
                // Returns true if a matching user/token pair is found
                ret["valid"] = (r.size() > 0); 
                callback(HttpResponse::newHttpJsonResponse(ret));
            },
            [callback](const drogon::orm::DrogonDbException &e) {
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_NONE));
            },
            userId, token
        );
    }

    // 2. Save Telemetry (The Big JSON from Unity)
    void submit_telemetry(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) {
        auto json = req->getJsonObject();
        if (!json) { callback(HttpResponse::newHttpResponse(k400BadRequest, CT_NONE)); return; }

        // Extract fields matching your C# JSON string
        std::string uid = (*json)["userID"].asString();
        std::string sId = (*json)["sessionID"].asString();
        std::string lId = (*json)["levelID"].asString();
        int totalQ = (*json)["totalQuestions"].asInt();
        int wrongA = (*json)["wrongAnswers"].asInt();
        int runs = (*json)["sceneRuns"].asInt();
        
        // Handle the timeToFindZone logic
        float t3d = (*json).get("timeToFindZone", 0.0).asFloat(); 
        
        std::string tStart = (*json)["initialTimestamp"].asString();
        std::string tEnd = (*json)["finalTimestamp"].asString();
        
        // Handle boolean or string for hint
        bool hint = false;
        if((*json)["hintUsed"].isString()) {
             hint = ((*json)["hintUsed"].asString() == "true");
        } else {
             hint = (*json)["hintUsed"].asBool();
        }
        
        int score = (*json)["finalScore"].asInt();

        auto db = app().getDbClient();
        db->execSqlAsync(
            "INSERT INTO telemetry_sessions (user_id, session_id, level_id, total_questions, wrong_answers, scene_runs, time_zone_3d, timestamp_start, timestamp_end, hint_used, final_score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [callback](const drogon::orm::Result &r) {
                Json::Value ret; 
                ret["status"] = "saved";
                callback(HttpResponse::newHttpJsonResponse(ret));
            },
            [callback](const drogon::orm::DrogonDbException &e) {
                std::cerr << "DB Error: " << e.base().what() << std::endl;
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_NONE));
            },
            uid, sId, lId, totalQ, wrongA, runs, t3d, tStart, tEnd, hint, score
        );
    }

    // 3. Update Score (The Small JSON)
    void update_score(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) {
        auto json = req->getJsonObject();
        std::string uid = (*json)["userID"].asString();
        std::string lId = (*json)["levelID"].asString();
        int score = (*json)["finalScore"].asInt();

        auto db = app().getDbClient();
        db->execSqlAsync(
            "INSERT INTO scores (user_id, level_id, score) VALUES ($1, $2, $3)",
            [callback](const drogon::orm::Result &r) {
                Json::Value ret; 
                ret["success"] = true;
                callback(HttpResponse::newHttpJsonResponse(ret));
            },
            [callback](const drogon::orm::DrogonDbException &e) {
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_NONE));
            },
            uid, lId, score
        );
    }
};
