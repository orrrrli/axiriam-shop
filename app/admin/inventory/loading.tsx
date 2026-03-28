export default function InventoryLoading(): React.ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        width: '100%',
      }}
      role="status"
      aria-label="Cargando..."
    >
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        style={{ animation: 'inventorySpinRotate 1s linear infinite' }}
      >
        <circle
          cx={20}
          cy={20}
          r={16}
          stroke="#101010"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="100.53"
          strokeDashoffset="75.4"
          style={{ animation: 'inventorySpinDash 1.5s ease-in-out infinite' }}
        />
      </svg>
      <style>{`
        @keyframes inventorySpinRotate { 100% { transform: rotate(360deg); } }
        @keyframes inventorySpinDash {
          0%   { stroke-dashoffset: 90; }
          50%  { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 90; }
        }
      `}</style>
    </div>
  );
}
