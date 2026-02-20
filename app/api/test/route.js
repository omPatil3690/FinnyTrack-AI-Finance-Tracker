import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if Clerk environment variables are set
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      return NextResponse.json({ 
        error: "Clerk environment variables not configured",
        missing: [
          !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
          !process.env.CLERK_SECRET_KEY && "CLERK_SECRET_KEY"
        ].filter(Boolean)
      }, { status: 500 });
    }

    const { userId } = auth();
    
    return NextResponse.json({ 
      message: "API is working correctly",
      environment: process.env.NODE_ENV,
      hasUserId: !!userId,
      userId: userId || "Not authenticated",
      clerkConfigured: true
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
