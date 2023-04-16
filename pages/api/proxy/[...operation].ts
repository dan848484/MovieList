import type { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const params = req.query as Record<string, string>;
  delete params.operation;

  const proxy = httpProxyMiddleware(req, res, {
    target: process.env.API,
    pathRewrite: [
      {
        patternStr: "/api/proxy/",
        replaceStr: "/",
      },
    ],
  });

  return proxy;
}
