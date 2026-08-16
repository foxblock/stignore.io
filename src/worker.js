import { IGNORE_BLOCKS } from "../public/js/blocks.js";
import { generateIgnoreFile, normalizePatternIds } from "../public/js/generator.js";

const API_HEADERS = Object.freeze({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
});

// Return consistent plain-text API responses without exposing internal errors.
function apiResponse(body, status, additionalHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      ...API_HEADERS,
      ...additionalHeaders,
    },
  });
}

// Handle one request so unit tests can exercise routing without a Worker runtime.
export async function handleRequest(
  request,
  env,
  generate = generateIgnoreFile,
) {
  const url = new URL(request.url);
  const isApiRoot = url.pathname === "/api" || url.pathname === "/api/";
  const isApiList =
    url.pathname === "/api/list" || url.pathname === "/api/list/";
  const isApiBlocks =
    url.pathname === "/api/blocks" || url.pathname === "/api/blocks/";
  const isApiPath =
    isApiRoot || isApiList || isApiBlocks || url.pathname.startsWith("/api/");

  if (!isApiPath) {
    return env.ASSETS.fetch(request);
  }

  if (!isApiRoot && !isApiList && !isApiBlocks) {
    return apiResponse("API endpoint not found.\n", 404, {
      "Cache-Control": "no-store",
    });
  }

  if (request.method !== "GET") {
    return apiResponse("Method not allowed. Use GET.\n", 405, {
      Allow: "GET",
      "Cache-Control": "no-store",
    });
  }

  if (isApiList) {
    return apiResponse(
      `${IGNORE_BLOCKS.map((block) => block.id).join(",")}\n`,
      200,
      { "Cache-Control": "public, max-age=86400" },
    );
  }

  if (isApiBlocks) {
    const blocks = IGNORE_BLOCKS.map(({ id, name }) => ({ id, name }));
    return apiResponse(`${JSON.stringify(blocks)}\n`, 200, {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "application/json; charset=utf-8",
    });
  }

  const rawPatterns = url.searchParams.get("patterns");
  if (normalizePatternIds(rawPatterns).length === 0) {
    return apiResponse(
      "Missing patterns. Usage: /api?patterns=windows,unity\n",
      400,
      { "Cache-Control": "no-store" },
    );
  }

  try {
    const result = generate(rawPatterns, url.href);
    if (result.selectedIds.length === 0) {
      return apiResponse(
        `No known block IDs requested: ${result.unknownIds.join(", ")}\n`,
        400,
        { "Cache-Control": "no-store" },
      );
    }

    return apiResponse(result.text, 200, {
      "Cache-Control": "public, max-age=300",
      "Content-Disposition": 'inline; filename=".stignore"',
    });
  } catch {
    return apiResponse("Internal server error.\n", 500, {
      "Cache-Control": "no-store",
    });
  }
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
