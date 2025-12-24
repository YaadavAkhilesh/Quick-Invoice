// middleware/desktopGuard.js
/**
 * Blocks requests that come from a viewport smaller than the defined breakpoint.
 * The client must send the size in custom headers:
 *   X-Viewport-Width  – window.innerWidth
 *   X-Viewport-Height – window.innerHeight
 *
 * Public routes (home, about, static uploads, the tiny “desktop‑required” page)
 * are always allowed.
 */
function desktopGuard(req, res, next) {
  // -----------------------------------------------------------------
  // 1️⃣  Public paths that must stay reachable on any device
  // -----------------------------------------------------------------
  const publicPaths = [
    '/',               // health endpoint
    '/About',          // about page (served by React router)
    '/desktop-required',
    '/uploads',        // static uploads
  ];

  // If the request URL starts with any of the public paths, skip the guard
  if (publicPaths.some(p => req.path.startsWith(p))) {
    return next();
  }

  // -----------------------------------------------------------------
  // 2️⃣  Read viewport size from custom headers (sent by the client script)
  // -----------------------------------------------------------------
  const width  = parseInt(req.headers['x-viewport-width']  || '0', 10);
  const height = parseInt(req.headers['x-viewport-height'] || '0', 10);

  // -----------------------------------------------------------------
  // 3️⃣  Decision – desktop or not
  // -----------------------------------------------------------------
  const MIN_WIDTH  = 1024;
  const MIN_HEIGHT = 600;

  if (width >= MIN_WIDTH && height >= MIN_HEIGHT) {
    // Desktop – allow the request to continue
    return next();
  }

  // -----------------------------------------------------------------
  // 4️⃣  Not a desktop – send a lightweight response
  // -----------------------------------------------------------------
  // Redirect to a tiny page that tells the user to use a desktop.
  return res.redirect('/desktop-required');
}

module.exports = desktopGuard;
