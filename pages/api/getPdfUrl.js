import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://george.barbu.es/api/pdf/george-barbu-general.pdf?role=general"
    );
    const data = await response.json();

    res.status(200).json({ pdfUrl: data.url });
  } catch (error) {
    console.error("Error fetching PDF URL:", error);
    res.status(500).json({ error: "Failed to fetch PDF URL" });
  }
}
