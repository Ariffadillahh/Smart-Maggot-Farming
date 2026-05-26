import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch('URL_API_PLATFORM_IOT_BARI', {
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error('Gagal fetch data dari IoT Platform');
    const rawData = await response.json();

    const formattedData = {
      temperature: parseFloat(rawData.field_suhu),
      humidity: parseFloat(rawData.field_kelembaban),
      maggot_weight: parseFloat(rawData.field_berat),
      trash_input: parseFloat(rawData.field_sampah)
    };

    const { data: insertedData, error: supabaseError } = await supabase
      .from('sensor_logs') 
      .insert([formattedData])
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase Error:', supabaseError.message);
    }

    return NextResponse.json({ 
      success: true, 
      data: insertedData || formattedData 
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memproses data' }, { status: 500 });
  }
}

