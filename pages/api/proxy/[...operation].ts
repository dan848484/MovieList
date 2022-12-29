import type { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";
import config from "../../../Movielist.config";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const operation = req.query.operation;
  const params = req.query as Record<string, string>;
  delete params.operation;

  const proxy = httpProxyMiddleware(req, res, {
    target: config.apiEndPoint,
    pathRewrite: [
      {
        patternStr: "/api/proxy/",
        replaceStr: "/",
      },
    ],
  });

  return proxy;
}
