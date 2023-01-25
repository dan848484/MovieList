// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(502).json("<h1>bad request</h1>");
    return;
  }
  require("dotenv").config();

  res.status(200).json({
    pool_id: process.env.POOL_ID,
    client_id: process.env.CLIENT_ID,
  });
}
