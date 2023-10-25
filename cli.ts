// deno-lint-ignore-file no-explicit-any
import { parse } from 'https://deno.land/std@0.204.0/flags/mod.ts';

const opt = parse(Deno.args, {
  string: ['tag', 'id', 'service'],
});

if (!opt.id) {
  throw new Error('Missing --id, please specify digitalocean app id');
}

if (!opt.tag) {
  throw new Error(
    'Missing --tag, please specify docker image tag to use for deployment',
  );
}

if (!opt.service) {
  throw new Error('Missing --service, please specify service name to update');
}

if (!Deno.env.has('DO_ACCESS_TOKEN')) {
  throw new Error('Missing DO_ACCESS_TOKEN env var');
}

const spec = await getAppSpec(opt.id);
const index = spec.services.findIndex((s: any) => s.name === opt.service);
if (index === -1) {
  throw new Error(`Service ${opt.service} could not be found`);
}
spec.services[index].image.tag = opt.tag;
await updateAppSpec(opt.id, spec);

// -------------------------------------------------------------------
// functions

async function getAppSpec(id: string): Promise<any> {
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

async function updateAppSpec(id: string, spec: any) {
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
