-- Nata Group Monitoring System Database Initialization
-- This script creates the database structure for PostgreSQL

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "plpgsql";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path
SET search_path TO public;

-- This file will be used with Prisma migrations
-- The actual table creation is handled by Prisma schema.prisma
-- Run: npx prisma migrate dev --name init
