import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }, // Some sites block bots
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const getMeta = (prop: string) =>
      $(`meta[property="${prop}"]`).attr("content") ||
      $(`meta[name="${prop}"]`).attr("content");

    const metadata = {
      imageUrl: getMeta("og:image"),
      title: getMeta("og:title") || $("title").text(),
      price: getMeta("product:price:amount") || "$--", // fallback
      url,
    };

    return NextResponse.json(metadata);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
