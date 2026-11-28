// Byte ranges for cached films, shared by the service worker (importScripts)
// and tests/filmvideo.test.js (run in a vm context). A classic script on
// purpose: no import or export, only function declarations.
//
// A <video> asks for its file in byte ranges ("Range: bytes=0-" first, then
// jumps when the viewer scrubs). A cached film is one whole response, so the
// worker cuts the range out of it and answers 206 Partial Content.

// "bytes=a-b", "bytes=a-" or "bytes=-n" against a file of `size` bytes.
// Null when there is no range (send it all); { unsatisfiable: true } when it
// cannot be met (or asks for several ranges); else the inclusive { start, end }.
function parseRange(header, size) {
  if (header == null || String(header).trim() === '') return null;
  var m = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!m || (m[1] === '' && m[2] === '')) return { unsatisfiable: true };
  var start;
  var end;
  if (m[1] === '') {
    var n = Number(m[2]);
    if (n === 0) return { unsatisfiable: true };
    start = Math.max(0, size - n);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || end < start) return { unsatisfiable: true };
  return { start: start, end: end };
}

// The status, the slice [start, end) to send and the headers.
function rangeParts(header, size, type) {
  var r = parseRange(header, size);
  if (r && r.unsatisfiable) return { status: 416, start: 0, end: 0, headers: { 'Content-Range': 'bytes */' + size, 'Accept-Ranges': 'bytes' } };
  if (!r) return { status: 200, start: 0, end: size, headers: { 'Content-Type': type, 'Content-Length': String(size), 'Accept-Ranges': 'bytes' } };
  return {
    status: 206,
    start: r.start,
    end: r.end + 1,
    headers: { 'Content-Type': type, 'Content-Length': String(r.end + 1 - r.start), 'Content-Range': 'bytes ' + r.start + '-' + r.end + '/' + size, 'Accept-Ranges': 'bytes' },
  };
}

// Only the films bucket of the app's own Supabase project.
function isFilmUrl(href) {
  try {
    var u = new URL(href);
    return u.protocol === 'https:' && u.hostname === 'ysybqtdzcutmyabfwijl.supabase.co' && u.pathname.indexOf('/storage/v1/object/public/films/') === 0;
  } catch (e) {
    return false;
  }
}

// A Response for the request's range, cut from the cached whole film.
async function rangeResponse(request, cached) {
  var blob = await cached.blob();
  var p = rangeParts(request.headers.get('range'), blob.size, cached.headers.get('content-type') || 'video/mp4');
  return new Response(p.status === 416 ? null : blob.slice(p.start, p.end), { status: p.status, headers: p.headers });
}
