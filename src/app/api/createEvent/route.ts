// app/api/events/route.js
import { NextResponse } from "next/server";
import admin from "@/services/firebaseAdmin/firebase"; // Ajuste o caminho conforme necessário
import stripe from "@/services/stripe/stripe"; // Ajuste o caminho conforme necessário

export async function GET() {
  return NextResponse.json("🤨?");
}

export async function POST(request: Request) {
  const { tokenId, event } = await request.json();

  console.log(tokenId, event);

  try {
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const uid = decodedToken.uid;

    console.log("conseguimos indenticiar que é o uid:", uid);

    const userRef = admin.firestore().collection("Users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const eventsRef = admin.firestore().collection("Events");

    if (!userData) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const eventsCreated = (userData?.events as string[]).length || 0;

    console.log("o usuário tem ", eventsCreated, " eventos");

    const purchasedEvents = userData?.purchasedEvents || 0;

    console.log("e ", purchasedEvents, " eventos comprados");

    // Se o usuário tem menos de 3 eventos criados
    if (eventsCreated < 3) {
      // Criação do evento
      console.log(
        "ele tem < 3 eventos então poderamos criar um evento para ele sem problema"
      );
      const newEventDocRef = eventsRef.doc();
      await newEventDocRef.set(event);
      userRef.update({
        events: [...(userData?.events ?? []), newEventDocRef.id],
      });
      return NextResponse.json(
        {
          success: true,
          message: "Evento criado com sucesso.",
          id: newEventDocRef.id,
        },
        { status: 200 }
      );
    } else {
      // O usuário atingiu o limite de eventos gratuitos
      console.log("o user atingiu o limite");
      if (purchasedEvents > 0) {
        console.log(
          "hummm mas aq consta q ele tem mais q zero eventos comprados, ent ele pode criar mais"
        );
        // Se o usuário já comprou eventos, pode criar mais
        const newEventDocRef = eventsRef.doc();
        await newEventDocRef.set(event);
        userRef.update({
          events: [...(userData?.events ?? []), newEventDocRef.id],
        });
        return NextResponse.json(
          {
            success: true,
            message: "Evento criado com sucesso.",
            id: newEventDocRef.id,
          },
          { status: 200 }
        );
      } else {
        // O usuário precisa pagar
        console.log("opa opa, ele n tem eventos comprados, ent precisa pagar");
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Evento",
                  // Adicione outras propriedades do produto se necessário
                },
                unit_amount: 1000, // valor em centavos
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          metadata: {
            firebaseId: uid,
          },
        });

        console.log("ele deve ir até ", session.url);

        return NextResponse.json(
          {
            url: session.url,
            message: "Redirecionando para o pagamento...",
          },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Erro ao verificar o token ID:", error);
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}
