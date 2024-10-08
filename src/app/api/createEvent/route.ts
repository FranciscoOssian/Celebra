import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import admin from "@/services/firebaseAdmin/firebase";
import stripe from "@/services/stripe/stripe";

export async function GET() {
  return NextResponse.json("🤨?");
}

import { createHash } from "crypto"; // Para criar o hash MD5

const upFile = async (file: FormDataEntryValue | null, eventId: string) => {
  if (!file) return;

  if (file instanceof Blob) {
    // Função para gerar hash MD5 com o nome do arquivo e um salt
    const generateHash = (fileName: string) => {
      const salt = randomBytes(8).toString("hex"); // Salt para adicionar variabilidade
      const timestamp = Date.now().toString(); // Timestamp atual
      return (
        createHash("md5")
          .update(fileName + salt + timestamp) // Usar nome do arquivo, salt e timestamp para gerar o hash
          .digest("base64")
          .replace(/[/+=]/g, "") +
        "." +
        file.name.split(".")[1]
      );
    };

    const bucket = admin.storage().bucket("gs://celebra-edbb4.appspot.com");
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name; // Nome original do arquivo
    const fileHash = generateHash(fileName); // Gera o hash do nome do arquivo com o salt
    const filePath = `Events/${eventId}/${fileHash}`; // Nome do arquivo será o hash gerado

    const storageFile = bucket.file(filePath);

    await storageFile.save(fileBuffer, {
      metadata: { contentType: file.type, originalFileName: fileHash },
    });

    // Retornar apenas o hash (ID) gerado
    return fileHash;
  }
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const tokenId = formData.get("tokenId");
  const event = JSON.parse(formData.get("event")?.toString() ?? "");

  console.log(tokenId);

  // Verifique se o tokenId não é nulo antes de usá-lo
  if (typeof tokenId !== "string") {
    return new Response("tokenId inválido", { status: 400 });
  }

  // Se precisar, faça o mesmo para o event
  if (!event) {
    return new Response("event inválido", { status: 400 });
  }

  console.log(tokenId, event);

  try {
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const uid = decodedToken.uid;

    console.log("conseguimos indenticiar que é o uid:", uid);

    const userRef = admin.firestore().collection("Users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const eventsRef = admin.firestore().collection("Events");
    //const bucket = storage.getStorage().bucket().

    if (!userData) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const eventsCreated = (userData?.events as string[])?.length || 0;

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
      await newEventDocRef.update({
        fileHero: await upFile(file, newEventDocRef.id),
      });
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
        await newEventDocRef.update({
          fileHero: await upFile(file, newEventDocRef.id),
        });
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
