import { describe, expect, it } from 'vitest';
import { canonicalRedirect } from './redirects';

const redirect = (url: string) => canonicalRedirect(new Request(url));

describe('canonicalRedirect', () => {
  it('www vai para https sem www, mantendo caminho e query', () => {
    const r = redirect('https://www.eucarollimah.com.br/en/media-kit/?a=1')!;
    expect(r.status).toBe(301);
    expect(r.headers.get('location')).toBe('https://eucarollimah.com.br/en/media-kit/?a=1');
  });

  it('http no domínio principal vai para https', () => {
    expect(redirect('http://eucarollimah.com.br/')!.headers.get('location')).toBe('https://eucarollimah.com.br/');
  });

  it('http com www resolve num salto só', () => {
    expect(redirect('http://www.eucarollimah.com.br/x')!.headers.get('location')).toBe('https://eucarollimah.com.br/x');
  });

  it('endereço canônico e outros hosts (localhost, prévias) não redirecionam', () => {
    expect(redirect('https://eucarollimah.com.br/')).toBeUndefined();
    expect(redirect('http://localhost:8787/app/')).toBeUndefined();
    expect(redirect('https://carol.conta.workers.dev/')).toBeUndefined();
  });
});
