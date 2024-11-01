// app/api/papago/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { naverService } from '@/app/services/naver.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await naverService.papagoMessage(body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing translation' },
      { status: 500 }
    );
  }
}