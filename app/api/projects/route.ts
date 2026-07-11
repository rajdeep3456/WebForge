import { db } from "@/config/db";
import {
  chatTable,
  frameTable,
  projectTable,
  usersTable,
} from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId, frameId, messages, credits } = await req.json();
    const user = await currentUser();
    const { has } = await auth();
    const hasUnlimitedAccess = has && has({ plan: "unlimited" });

    // create project
    const projectResult = await db
      .insert(projectTable)
      .values({ projectId, createdBy: user?.primaryEmailAddress?.emailAddress })
      .returning();

    // create frame
    const frameResult = await db
      .insert(frameTable)
      .values({ projectId, frameId })
      .returning();

    // save user message
    const chatResult = await db
      .insert(chatTable)
      .values({
        chatMessage: messages,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        frameId,
      })
      .returning();

    //update user credits
    if (!hasUnlimitedAccess) {
      await db
        .update(usersTable)
        .set({ credits: credits - 1 })
        //@ts-ignore
        .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));
    }

    return NextResponse.json({ projectResult, frameResult, chatResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
