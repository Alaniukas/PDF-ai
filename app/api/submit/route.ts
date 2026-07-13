import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { fullFormSchema } from "@/lib/form-schema";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const sessionId = formData.get("session_id") as string;
    const answersRaw = formData.get("answers") as string;

    if (!sessionId || !answersRaw) {
      return NextResponse.json({ error: "Trūksta duomenų" }, { status: 400 });
    }

    const parsed = JSON.parse(answersRaw);
    const validation = fullFormSchema.safeParse(parsed);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Formos validacijos klaida", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("stripe_session_id", sessionId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Užsakymas nerastas" }, { status: 404 });
    }

    if (order.status === "form_submitted" || order.status === "pdf_sent") {
      return NextResponse.json({ error: "Forma jau pateikta" }, { status: 409 });
    }

    const { error: responseError } = await supabase.from("form_responses").insert({
      order_id: order.id,
      answers: validation.data,
    });

    if (responseError) {
      console.error("Form response error:", responseError);
      return NextResponse.json({ error: "Nepavyko išsaugoti atsakymų" }, { status: 500 });
    }

    const files = formData.getAll("photos") as File[];
    const comments = formData.getAll("photo_comments") as string[];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || file.size === 0) continue;

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${order.id}/${Date.now()}-${i}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("intake-uploads")
        .upload(path, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      await supabase.from("uploads").insert({
        order_id: order.id,
        file_path: path,
        comment: comments[i] || "",
      });
    }

    await supabase
      .from("orders")
      .update({ status: "form_submitted" })
      .eq("id", order.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Serverio klaida" }, { status: 500 });
  }
}
