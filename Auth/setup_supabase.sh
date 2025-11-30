#!/bin/bash
# Supabase Configuration Script
# Run this script to set up your environment variables

export SUPABASE_URL="https://okumswphgekymmgqbxwf.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdW1zd3BoZ2VreW1tZ3FieHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTQ3MjksImV4cCI6MjA3OTgzMDcyOX0.mmKJB7UPuJtChIFBYlDFMHLp9LnmfygZ64FgGEui_Pc"
export SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdW1zd3BoZ2VreW1tZ3FieHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDI1NDcyOSwiZXhwIjoyMDc5ODMwNzI5fQ.Yt-zdfnf72UqU0_7x-jIooRXx395Kq0d9e37dkGxGP4"

# Database connection - YOU NEED TO GET THESE FROM SUPABASE DASHBOARD
# Go to Settings -> Database -> Connection string
# The host should be: db.okumswphgekymmgqbxwf.supabase.co
export SUPABASE_DB_HOST="db.okumswphgekymmgqbxwf.supabase.co"
export SUPABASE_DB_PORT="5432"
export SUPABASE_DB_NAME="postgres"
export SUPABASE_DB_USER="postgres"
# IMPORTANT: Replace with your actual database password (the one you set when creating the project)
export SUPABASE_DB_PASSWORD="YOUR_DATABASE_PASSWORD_HERE"

echo "Supabase environment variables set!"
echo ""
echo "IMPORTANT: You still need to:"
echo "1. Replace SUPABASE_DB_PASSWORD with your actual database password"
echo "2. Get your database password from Supabase Dashboard -> Settings -> Database"
echo ""
echo "To use these variables, run: source setup_supabase.sh"
echo "Or add them to your ~/.zshrc or ~/.bashrc for permanent setup"

