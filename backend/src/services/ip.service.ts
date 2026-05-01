import { prisma } from '../config/prisma.js';

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export const getGeoData = async (ip?: string) => {
  if (!ip) return null;

  const normalizedIp = ip === '::1' ? '8.8.8.8' : ip;

  const cached = await prisma.ipCache.findUnique({
    where: { ip: normalizedIp },
  });

  if (cached) {
    const isExpired =
      Date.now() - new Date(cached.updatedAt).getTime() > THIRTY_DAYS;

    if (!isExpired) {
      return cached;
    }
  }

  try {
    const geo = await getGeoFromIP(normalizedIp);

    if (!geo) return null;

    return await prisma.ipCache.upsert({
      where: { ip: normalizedIp },
      update: {
        country: geo.country,
        city: geo.city,
        lat: geo.lat,
        lon: geo.lon,
      },
      create: {
        ip: normalizedIp,
        country: geo.country,
        city: geo.city,
        lat: geo.lat,
        lon: geo.lon,
      },
    });
  } catch (error) {
    console.error('Geo lookup failed:', error);
    return null;
  }
};

export const getGeoFromIP = async (ip?: string) => {
  if (!ip) return null;

  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await res.json();

  return {
    country: data.country,
    city: data.city,
    lat: data.lat,
    lon: data.lon,
  };
};
