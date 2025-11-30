#pragma once
#include <drogon/HttpController.h>
#include <drogon/utils/Utilities.h>
#include "SupabaseClient.hpp"

using namespace drogon;

class AuthController : public drogon::HttpController<AuthController>
{
  public:
    METHOD_LIST_BEGIN
        // Define API Endpoints
        ADD_METHOD_TO(AuthController::signup, "/api/auth/signup", Post);
        ADD_METHOD_TO(AuthController::get_courses, "/api/courses", Get);
        ADD_METHOD_TO(AuthController::generate_game_link, "/api/play/launch", Post);
    METHOD_LIST_END

    // 1. Sign Up Logic - Now uses Supabase Auth
    void signup(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) {
        auto json = req->getJsonObject();
        if(!json) {
            auto resp = HttpResponse::newHttpResponse(k400BadRequest, CT_APPLICATION_JSON);
            callback(resp);
            return;
        }

        // Parse JSON
        std::string email = (*json)["email"].asString();
        std::string password = (*json)["password"].asString();
        std::string school = (*json)["school"].asString();
        std::string username = (*json)["username"].asString();

        // Use Supabase Auth to create user (handles password hashing automatically)
        SupabaseClient::getInstance().signUp(
            email, password,
            [callback, username, school, email](const Json::Value& supabaseResponse) {
                // Supabase creates the auth user, now we need to add to our users table
                std::string userId;
                if (supabaseResponse["user"].isObject() && supabaseResponse["user"]["id"].isString()) {
                    userId = supabaseResponse["user"]["id"].asString();
                } else {
                    // Fallback: generate UUID if Supabase didn't return one
                    userId = utils::getUuid();
                }

                // Insert into our custom users table with additional fields
                auto db = app().getDbClient();
                db->execSqlAsync(
                    "INSERT INTO users (uid, username, email, school_name) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING",
                    [callback](const drogon::orm::Result &r) {
                        Json::Value ret;
                        ret["status"] = "success";
                        ret["message"] = "Account created successfully.";
                        ret["userId"] = r.affectedRows() > 0 ? "created" : "exists";
                        callback(HttpResponse::newHttpJsonResponse(ret));
                    },
                    [callback](const drogon::orm::DrogonDbException &e) {
                        Json::Value ret;
                        ret["status"] = "error";
                        ret["message"] = "Database error: " + std::string(e.base().what());
                        callback(HttpResponse::newHttpJsonResponse(ret));
                    },
                    userId, username, email, school
                );
            },
            [callback](const std::string& error) {
                Json::Value ret;
                ret["status"] = "error";
                ret["message"] = "Signup failed: " + error;
                callback(HttpResponse::newHttpJsonResponse(ret));
            }
        );
    }

    // 2. Get Courses (For Frontend UI)
    void get_courses(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) {
        Json::Value courses;
        Json::Value lvl;
        lvl["id"] = "lvl_01";
        lvl["title"] = "Training Zone";
        lvl["videoUrl"] = "http://mysite.com/intro.mp4";
        courses.append(lvl);
        callback(HttpResponse::newHttpJsonResponse(courses));
    }

    // 3. Generate Game Link (Sets token and returns URL)
    // Note: With Supabase, you might want to use JWT tokens instead of custom auth_token
    void generate_game_link(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) {
        auto json = req->getJsonObject();
        if (!json) {
            callback(HttpResponse::newHttpResponse(k400BadRequest, CT_NONE));
            return;
        }
        
        std::string userId = (*json)["userId"].asString();
        
        // Generate session token (you can also use Supabase JWT tokens here)
        std::string token = utils::getUuid();

        auto db = app().getDbClient();
        db->execSqlAsync(
            "UPDATE users SET auth_token = $1 WHERE uid = $2",
            [callback, userId, token](const drogon::orm::Result &r) {
                Json::Value ret;
                // Returns: gamelocation/#/play?userID=X&authToken=Y
                ret["gameUrl"] = "https://game.com/build/#/play?userID=" + userId + "&authToken=" + token;
                callback(HttpResponse::newHttpJsonResponse(ret));
            },
            [callback](const drogon::orm::DrogonDbException &e) {
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_NONE));
            },
            token, userId
        );
    }
};
