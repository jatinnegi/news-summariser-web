import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split("Bearer ").pop();
    if (!token) return NextResponse.json({}, { status: 400 });

    const user = jwt.decode(token);
    if (!user) return NextResponse.json({}, { status: 400 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { googleAccessToken, password } = data;

    if (
      !googleAccessToken ||
      !password ||
      password !== process.env.APPLICATION_PASSWORD
    )
      return NextResponse.json({}, { status: 400 });

    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
        method: "GET",
      }
    );

    if (googleUserResponse.status === 401)
      return NextResponse.json({}, { status: 400 });

    const googleUserData = await googleUserResponse.json();
    if (!googleUserData) return NextResponse.json({}, { status: 400 });

    const user = {
      email: googleUserData.email || "",
      name: googleUserData.name || "",
      picture: googleUserData.picture || "",
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    return NextResponse.json({
      token,
      user,
    });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
