// deno-lint-ignore-file no-explicit-any
export async function getAppSpec(id: string): Promise<any> {
  const response = await fetch(`https://api.digitalocean.com/v2/apps/${id}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('DO_ACCESS_TOKEN')}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return data.app.spec;
}

export async function updateAppSpec(id: string, spec: any) {
  const response = await fetch(`https://api.digitalocean.com/v2/apps/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Deno.env.get('DO_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ spec }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return data.app.spec;
}
