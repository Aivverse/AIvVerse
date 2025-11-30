#pragma once
#include <drogon/HttpClient.h>
#include <drogon/drogon.h>
#include <memory>
#include <string>

using namespace drogon;

class SupabaseClient {
public:
    static SupabaseClient& getInstance() {
        static SupabaseClient instance;
        return instance;
    }

    void initialize(const std::string& url, const std::string& anonKey, const std::string& serviceKey) {
        supabaseUrl_ = url;
        anonKey_ = anonKey;
        serviceKey_ = serviceKey;
    }

    // Sign up a new user using Supabase Auth
    void signUp(const std::string& email, const std::string& password,
                const std::function<void(const Json::Value&)>& successCallback,
                const std::function<void(const std::string&)>& errorCallback) {
        
        auto client = HttpClient::newHttpClient(supabaseUrl_);
        auto req = HttpRequest::newHttpJsonRequest(Json::Value());
        
        Json::Value json;
        json["email"] = email;
        json["password"] = password;
        req->setMethod(drogon::Post);
        req->setPath("/auth/v1/signup");
        req->setBody(json.toStyledString());
        req->addHeader("apikey", anonKey_);
        req->addHeader("Content-Type", "application/json");
        
        client->sendRequest(req, [successCallback, errorCallback](ReqResult result, const HttpResponsePtr& resp) {
            if (result == ReqResult::Ok && resp) {
                auto json = resp->getJsonObject();
                if (resp->statusCode() == k200OK || resp->statusCode() == k201Created) {
                    if (json && (*json)["user"].isObject()) {
                        successCallback(*json);
                    } else {
                        errorCallback("Signup failed: Invalid response format");
                    }
                } else {
                    // Supabase returns error in response body
                    std::string errorMsg = "Signup failed";
                    if (json && (*json)["message"].isString()) {
                        errorMsg = (*json)["message"].asString();
                    } else if (json && (*json)["error_description"].isString()) {
                        errorMsg = (*json)["error_description"].asString();
                    }
                    errorCallback(errorMsg);
                }
            } else {
                errorCallback("Network error during signup");
            }
        });
    }

    // Sign in a user
    void signIn(const std::string& email, const std::string& password,
                const std::function<void(const Json::Value&)>& successCallback,
                const std::function<void(const std::string&)>& errorCallback) {
        
        auto client = HttpClient::newHttpClient(supabaseUrl_);
        auto req = HttpRequest::newHttpJsonRequest(Json::Value());
        
        Json::Value json;
        json["email"] = email;
        json["password"] = password;
        req->setMethod(drogon::Post);
        req->setPath("/auth/v1/token?grant_type=password");
        req->setBody(json.toStyledString());
        req->addHeader("apikey", anonKey_);
        req->addHeader("Content-Type", "application/json");
        
        client->sendRequest(req, [successCallback, errorCallback](ReqResult result, const HttpResponsePtr& resp) {
            if (result == ReqResult::Ok && resp) {
                auto json = resp->getJsonObject();
                if (resp->statusCode() == k200OK) {
                    if (json) {
                        successCallback(*json);
                    } else {
                        errorCallback("Sign in failed: Invalid response format");
                    }
                } else {
                    // Supabase returns error in response body
                    std::string errorMsg = "Sign in failed";
                    if (json && (*json)["error_description"].isString()) {
                        errorMsg = (*json)["error_description"].asString();
                    } else if (json && (*json)["message"].isString()) {
                        errorMsg = (*json)["message"].asString();
                    }
                    errorCallback(errorMsg);
                }
            } else {
                errorCallback("Network error during sign in");
            }
        });
    }

    // Get user by JWT token
    void getUser(const std::string& accessToken,
                 const std::function<void(const Json::Value&)>& successCallback,
                 const std::function<void(const std::string&)>& errorCallback) {
        
        auto client = HttpClient::newHttpClient(supabaseUrl_);
        auto req = HttpRequest::newHttpRequest();
        req->setMethod(drogon::Get);
        req->setPath("/auth/v1/user");
        req->addHeader("apikey", anonKey_);
        req->addHeader("Authorization", "Bearer " + accessToken);
        
        client->sendRequest(req, [successCallback, errorCallback](ReqResult result, const HttpResponsePtr& resp) {
            if (result == ReqResult::Ok && resp) {
                auto json = resp->getJsonObject();
                if (json) {
                    successCallback(*json);
                } else {
                    errorCallback("Get user failed: Invalid response");
                }
            } else {
                errorCallback("Network error getting user");
            }
        });
    }

    std::string getServiceKey() const { return serviceKey_; }
    std::string getAnonKey() const { return anonKey_; }
    std::string getUrl() const { return supabaseUrl_; }

private:
    std::string supabaseUrl_;
    std::string anonKey_;
    std::string serviceKey_;
    
    SupabaseClient() = default;
    ~SupabaseClient() = default;
    SupabaseClient(const SupabaseClient&) = delete;
    SupabaseClient& operator=(const SupabaseClient&) = delete;
};

