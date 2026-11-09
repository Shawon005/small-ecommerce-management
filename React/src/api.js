let csrf = "";
export async function api(path, method = "GET", body, retry = true) {
  if (method !== "GET" && !csrf) await api("session");
  const response = await fetch(`/api/${path}`, {
    method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrf,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (response.status === 204) return null;
  if (response.status === 419 && retry) {
    await api("session");
    return api(path, method, body, false);
  }
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(
      data.message || "Something went wrong. Please try again.",
    );
    error.errors = data.errors || {};
    error.status = response.status;
    throw error;
  }
  if (data.csrf_token) csrf = data.csrf_token;
  return data;
}
export const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value),
  );
