export default function LoadingSpinner({ fullscreen, size = 32 }) {
  const spinner = (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid rgba(124,106,247,0.2)`,
      borderTopColor: '#7c6af7',
      animation: 'spin 0.7s linear infinite',
    }} />
  );

  if (fullscreen) return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0a0a0f',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {spinner}
        <span style={{ color: '#8b89a8', fontSize: 14 }}>Loading TaskSphere...</span>
      </div>
    </div>
  );

  return spinner;
}
