/**
 * Health Check API Route
 * 
 * GET /api/health
 * 
 * Simple health check endpoint to verify API is running
 * Used by monitoring and deployment systems
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
