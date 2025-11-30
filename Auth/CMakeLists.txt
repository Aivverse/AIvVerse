cmake_minimum_required(VERSION 3.14)
project(UnityBackend)

# Use C++20
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 1. Fetch Drogon
include(FetchContent)
FetchContent_Declare(
  drogon
  GIT_REPOSITORY https://github.com/drogonframework/drogon
  GIT_TAG        v1.9.7
)
# This ensures Drogon and its dependencies (Trantor) are available
FetchContent_MakeAvailable(drogon)

# 2. Find Postgres
find_package(PostgreSQL REQUIRED)

# 3. Create Executable
add_executable(GameServer main.cpp)

# 4. Link Libraries (CHANGED: 'Drogon::Drogon' to 'drogon')
target_link_libraries(GameServer 
    PRIVATE 
    drogon
    pq
)
