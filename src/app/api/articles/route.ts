import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Article from "@/models/Article.model";

export async function OPTIONS(_: Request) {
  return NextResponse.json({}, { status: 200 });
}

export async function GET() {
  try {
    await connectMongoDB();
    const articles = await Article.find();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { url, title, content } = data;

    if (!url || !title || !content)
      return NextResponse.json({}, { status: 400 });

    await connectMongoDB();

    const article = await Article.findOne({ url });
    if (article) return NextResponse.json(article);

    // Generate Mini Rhyme
    let body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Convert "${title}" to a mini rhyme of less than 20 words`,
        },
      ],
    });
    let chatGPTResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHAT_GPT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body,
      }
    );
    let chatGPTData = await chatGPTResponse.json();
    const miniRhymeTitle = chatGPTData.choices[0].message.content || "";

    // Generate Summary
    body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          // content: `Summarise the following text \"${content}\"`,
          content: `Generate a brief summary of the bias if any in the following text \"${content}\"`,
        },
      ],
    });
    chatGPTResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHAT_GPT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body,
      }
    );
    chatGPTData = await chatGPTResponse.json();
    const summary = chatGPTData.choices[0].message.content || "";

    const newArticle = await Article.create({
      url,
      title: miniRhymeTitle,
      summary,
    });

    return NextResponse.json(newArticle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
