#include <drogon/drogon.h>
#include "AuthController.hpp"
#include "GameController.hpp"
#include "SupabaseClient.hpp"
#include <cstdlib>

using namespace drogon;

int main() {
    std::cout << "Starting Unity Backend Server..." << std::endl;

    // 1. SUPABASE CONFIGURATION
    // Get environment variables or use defaults for testing
    std::string supabaseUrl = std::getenv("SUPABASE_URL") ? std::getenv("SUPABASE_URL") : "";
    std::string supabaseAnonKey = std::getenv("SUPABASE_ANON_KEY") ? std::getenv("SUPABASE_ANON_KEY") : "";
    std::string supabaseServiceKey = std::getenv("SUPABASE_SERVICE_KEY") ? std::getenv("SUPABASE_SERVICE_KEY") : "";
    
    std::string dbHost = std::getenv("SUPABASE_DB_HOST") ? std::getenv("SUPABASE_DB_HOST") : "127.0.0.1";
    std::string dbPortStr = std::getenv("SUPABASE_DB_PORT") ? std::getenv("SUPABASE_DB_PORT") : "5432";
    std::string dbName = std::getenv("SUPABASE_DB_NAME") ? std::getenv("SUPABASE_DB_NAME") : "postgres";
    std::string dbUser = std::getenv("SUPABASE_DB_USER") ? std::getenv("SUPABASE_DB_USER") : "postgres";
    std::string dbPassword = std::getenv("SUPABASE_DB_PASSWORD") ? std::getenv("SUPABASE_DB_PASSWORD") : "password";
    
    int dbPort = std::stoi(dbPortStr);

    // Initialize Supabase Client
    if (!supabaseUrl.empty() && !supabaseAnonKey.empty()) {
        SupabaseClient::getInstance().initialize(supabaseUrl, supabaseAnonKey, supabaseServiceKey);
        std::cout << "Supabase client initialized" << std::endl;
    } else {
        std::cout << "Warning: Supabase credentials not found. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables." << std::endl;
    }

    // 2. DATABASE CONNECTION TO SUPABASE POSTGRESQL
    // Connect to Supabase's PostgreSQL database
    // Format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
    drogon::app().createDbClient("postgresql", dbHost, dbPort, dbName, dbUser, dbPassword);
    std::cout << "Connected to Supabase PostgreSQL database" << std::endl;

    // 2. ENABLE CORS (Crucial for Frontend Connection)
    // This allows your HTML/Unity WebGL to send POST requests to this server.
    drogon::app().registerPostHandlingAdvice(
        [](const HttpRequestPtr &req, const HttpResponsePtr &resp) {
            // Allow requests from ANY origin ("*")
            resp->addHeader("Access-Control-Allow-Origin", "*");
            // Allow specific HTTP methods
            resp->addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            // Allow specific headers (needed for JSON)
            resp->addHeader("Access-Control-Allow-Headers", "Content-Type");
        }
    );

    // 3. LISTEN & RUN
    // Listen on 0.0.0.0 so it is accessible from outside localhost if needed
    drogon::app().addListener("0.0.0.0", 8080);
    
    drogon::app().run();
    return 0;
}