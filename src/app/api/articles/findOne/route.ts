import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Article from "@/models/Article.model";

export async function OPTIONS(_: Request) {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) return NextResponse.json({});
    await connectMongoDB();
    const article = await Article.findOne({ url });

    return NextResponse.json({ data: article });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
