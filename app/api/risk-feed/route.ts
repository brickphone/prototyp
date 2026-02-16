import { NextRequest, NextResponse } from "next/server";
import { getMockSnapshot } from "@/lib/risk/mock-data";
import { TimePeriod } from "@/types/risk";

const periodMap: Record<string, TimePeriod> = {
  today: "TODAY",
  week: "WEEK",
  month: "MONTH",
  year: "YEAR"
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const periodParam = request.nextUrl.searchParams.get("period") ?? "today";
  const period = periodMap[periodParam.toLowerCase()] ?? "TODAY";

  return NextResponse.json(getMockSnapshot(period));
}
