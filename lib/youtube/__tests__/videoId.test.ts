import { describe, expect, it } from 'vitest';
import { extractYouTubeId, isValidYouTubeId, parseYouTubeId, youtubeEmbedUrl, youtubeWatchUrl } from '@/lib/youtube/videoId';

const ID = 'dQw4w9WgXcQ';

describe('parseYouTubeId — accepted formats', () => {
  const valid: [string, string][] = [
    ['youtu.be short link', `https://youtu.be/${ID}`],
    ['youtu.be with si=', `https://youtu.be/${ID}?si=AbCdEfGhIjKlMnOp`],
    ['youtu.be with t= and si=', `https://youtu.be/${ID}?si=xyz123&t=42`],
    ['youtu.be without protocol', `youtu.be/${ID}`],
    ['youtu.be over http', `http://youtu.be/${ID}`],
    ['watch?v=', `https://www.youtube.com/watch?v=${ID}`],
    ['watch?v= without www', `https://youtube.com/watch?v=${ID}`],
    ['watch?v= without protocol', `www.youtube.com/watch?v=${ID}`],
    ['watch with v not first', `https://www.youtube.com/watch?feature=share&v=${ID}`],
    ['watch with list + index', `https://www.youtube.com/watch?v=${ID}&list=PL1234567890&index=3`],
    ['watch with si=', `https://www.youtube.com/watch?v=${ID}&si=AbCdEfGh`],
    ['watch with fragment', `https://www.youtube.com/watch?v=${ID}#t=30`],
    ['mobile site', `https://m.youtube.com/watch?v=${ID}`],
    ['YouTube Music', `https://music.youtube.com/watch?v=${ID}&si=abc`],
    ['embed/', `https://www.youtube.com/embed/${ID}`],
    ['embed/ with params', `https://www.youtube.com/embed/${ID}?rel=0&start=10`],
    ['youtube-nocookie embed', `https://www.youtube-nocookie.com/embed/${ID}?rel=0`],
    ['shorts/', `https://www.youtube.com/shorts/${ID}`],
    ['shorts/ with si=', `https://youtube.com/shorts/${ID}?si=Qwerty123`],
    ['live/', `https://www.youtube.com/live/${ID}?si=abc`],
    ['/v/ legacy', `https://www.youtube.com/v/${ID}`],
    ['upper-case host', `HTTPS://WWW.YOUTUBE.COM/watch?v=${ID}`],
    ['surrounding whitespace', `   https://youtu.be/${ID}  `],
    ['trailing slash', `https://youtu.be/${ID}/`],
    ['id with - and _', 'https://youtu.be/a-B_c1D2e3F'],
  ];
  it.each(valid)('%s', (_name, url) => {
    const result = parseYouTubeId(url);
    expect(result).toEqual({ ok: true, id: url.includes('a-B_c1D2e3F') ? 'a-B_c1D2e3F' : ID });
  });
});

describe('parseYouTubeId — rejected input', () => {
  const invalid: [string, unknown][] = [
    ['empty string', ''],
    ['whitespace', '   '],
    ['undefined', undefined],
    ['null', null],
    ['a number', 12345678901],
    ['bare id (not a link)', ID],
    ['plain words', 'not a url at all'],
    ['other site', `https://vimeo.com/${ID}`],
    ['look-alike host', `https://youtube.com.evil.example/watch?v=${ID}`],
    ['look-alike short host', `https://youtu.be.evil.example/${ID}`],
    ['host containing youtube', `https://notyoutube.com/watch?v=${ID}`],
    ['javascript: scheme', `javascript:alert('${ID}')`],
    ['ftp scheme', `ftp://youtu.be/${ID}`],
    ['credentials in URL', `https://user:pass@youtu.be/${ID}`],
    ['custom port', `https://youtu.be:8443/${ID}`],
    ['id too short', 'https://youtu.be/abc123'],
    ['id too long', `https://youtu.be/${ID}X`],
    ['id with illegal char', 'https://youtu.be/dQw4w9WgXc!'],
    ['watch without v', 'https://www.youtube.com/watch?list=PL123'],
    ['watch with empty v', 'https://www.youtube.com/watch?v='],
    ['channel link', 'https://www.youtube.com/@ashphys'],
    ['playlist link', 'https://www.youtube.com/playlist?list=PL1234567890'],
    ['home page', 'https://www.youtube.com/'],
    ['short link with extra path', `https://youtu.be/${ID}/extra`],
    ['embed without id', 'https://www.youtube.com/embed/'],
    ['shorts with extra path', `https://www.youtube.com/shorts/${ID}/more`],
    ['nocookie watch page', `https://www.youtube-nocookie.com/watch?v=${ID}`],
    ['space inside', `https://youtu.be/ ${ID}`],
  ];
  it.each(invalid)('%s', (_name, input) => {
    const result = parseYouTubeId(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.length).toBeGreaterThan(10);
  });

  it('explains what kind of link is expected', () => {
    const result = parseYouTubeId('https://example.com/video');
    expect(result).toMatchObject({ ok: false, error: expect.stringMatching(/youtu\.be/) });
  });

  it('says why an id is wrong', () => {
    expect(parseYouTubeId('https://youtu.be/abc')).toMatchObject({ ok: false, error: expect.stringMatching(/11 characters/) });
  });
});

describe('extractYouTubeId', () => {
  it('returns the id', () => {
    expect(extractYouTubeId(`https://youtu.be/${ID}?si=x`)).toBe(ID);
  });
  it('throws a readable error on bad input', () => {
    expect(() => extractYouTubeId('https://vimeo.com/1')).toThrow(/YouTube/);
  });
});

describe('URL builders', () => {
  it('builds the privacy-enhanced embed URL with the required params', () => {
    expect(youtubeEmbedUrl(ID)).toBe(`https://www.youtube-nocookie.com/embed/${ID}?rel=0&modestbranding=1&playsinline=1`);
  });
  it('builds the fallback watch URL', () => {
    expect(youtubeWatchUrl(ID)).toBe(`https://www.youtube.com/watch?v=${ID}`);
  });
  it('refuses to build a URL from an invalid id', () => {
    expect(() => youtubeEmbedUrl('"><script>')).toThrow();
    expect(() => youtubeWatchUrl('short')).toThrow();
  });
  it('validates ids', () => {
    expect(isValidYouTubeId(ID)).toBe(true);
    expect(isValidYouTubeId('short')).toBe(false);
    expect(isValidYouTubeId(undefined)).toBe(false);
  });
});
