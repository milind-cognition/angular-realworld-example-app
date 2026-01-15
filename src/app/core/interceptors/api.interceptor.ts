import { HttpInterceptorFn } from "@angular/common/http";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip URL transformation for requests that already have a full URL (e.g., localhost)
  if (req.url.startsWith("http://") || req.url.startsWith("https://")) {
    return next(req);
  }
  const apiReq = req.clone({ url: `https://api.realworld.show/api${req.url}` });
  return next(apiReq);
};
