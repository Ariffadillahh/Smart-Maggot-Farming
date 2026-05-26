import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { temperature, humidity, maggot_weight, trash_input } = body;

    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("sensor_logs")
      .insert([{ temperature, humidity, maggot_weight, trash_input }])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Data tersinkronisasi ke Supabase", data },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
