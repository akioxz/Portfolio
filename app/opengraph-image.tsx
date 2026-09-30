import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'Axel Villanueva - Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #171717 0%, #0a0a0a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Subtle Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 80px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 20px 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Axel Villanueva
          </h1>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', color: '#a3a3a3', fontSize: '24px', fontWeight: 500 }}>
              Full-Stack Developer
            </div>
            <div style={{ display: 'flex', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', color: '#a3a3a3', fontSize: '24px', fontWeight: 500 }}>
              React & Next.js
            </div>
            <div style={{ display: 'flex', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', color: '#a3a3a3', fontSize: '24px', fontWeight: 500 }}>
              Supabase
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
