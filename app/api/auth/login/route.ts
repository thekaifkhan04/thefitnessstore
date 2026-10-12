import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAdminToken, setAdminSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { email, password } = loginSchema.parse(json);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 });
    }

    // Sign JWT
    const token = await signAdminToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please enter a valid email and password" }, { status: 400 });
    }
    console.error("Login error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
