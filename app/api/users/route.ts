import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  // if user exists ? select the user
  const userResult = await db
    .select()
    .from(usersTable)
    //@ts-ignore
    .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));
  // if user doesn't exist? create user
  if (userResult.length === 0) {
    const data = {
      name: user?.fullName ?? "N/A",
      email: user?.primaryEmailAddress?.emailAddress ?? "N/A",
      credits: 2,
    };

    const result = await db.insert(usersTable).values({
      ...data,
    });
    return NextResponse.json({ message: "success", user: data });
  }
  return NextResponse.json({ message: "success", user: userResult[0] });
}
