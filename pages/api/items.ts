// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Movie } from "../../model/Movie.model";
import config from "../../Movielist.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Movie[] | string>
) {
  if (req.method !== "GET") {
    res.status(502).json("<h1>bad request</h1>");
    return;
  }
  const response = await (await fetch(config.apiEndPoint + "/items")).json();

  res.status(200).json(response);
}
