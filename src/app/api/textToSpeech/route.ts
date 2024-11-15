import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// API KEY
const TTS_API_KEY = process.env.OPEN_AI_KEY as string;

// open AI 통신연결
const openai = new OpenAI({
  apiKey: TTS_API_KEY
});

export const POST = async (reqeust: NextRequest) => {
  const { text } = await reqeust.json();

  const mp3 = await openai.audio.speech.create({
    model: "tts-1", // 사용할 TTS 모델을 지정
    voice: "nova", // 음성 모델을 지정
    input: text
  });

  // mp3 데이터를 ArrayBuffer 형식으로 가져와, Buffer 객체로 변환
  const buffer = Buffer.from(await mp3.arrayBuffer());

  return NextResponse.json({ buffer: buffer.toString("base64") });
};
