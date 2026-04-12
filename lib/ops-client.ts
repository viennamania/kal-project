import "server-only";

import { env } from "@/lib/env";

type OpsJobResponse = {
  jobId: string | number;
  status: string;
};

function getOpsApiConfig() {
  if (!env.RAILWAY_OPS_API_URL || !env.RAILWAY_OPS_API_TOKEN) {
    throw new Error("Railway ops API is not configured.");
  }

  return {
    token: env.RAILWAY_OPS_API_TOKEN,
    url: env.RAILWAY_OPS_API_URL.replace(/\/$/, "")
  };
}

export async function enqueueOpsJob<TPayload>(
  path: string,
  payload: TPayload
): Promise<OpsJobResponse> {
  const { token, url } = getOpsApiConfig();

  const response = await fetch(`${url}${path}`, {
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    let errorMessage = "Failed to enqueue operation.";

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Ignore JSON parse failures and use the fallback message.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as OpsJobResponse;
}
