import { NextResponse } from "next/server";
import admin from "@/services/firebaseAdmin/firebase";

const API_KEY = process.env.OPENCAGE_API_KEY;

async function fetchCoordinates(input: string) {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      input
    )}&key=${API_KEY}&language=pt&pretty=1`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar coordenadas");
  }

  const data = await response.json();
  return data;
}

export async function POST(request: Request) {
  const { query, tokenId } = await request.json();

  try {
    await admin.auth().verifyIdToken(tokenId);
  } catch {
    return NextResponse.json({ error: "Erro ao validar uid" }, { status: 500 });
  }

  try {
    const response = await fetchCoordinates(query);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição." },
      { status: 500 }
    );
  }
}
