export default function ProductBox3D() {
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  return (
    <div className="css3d-wrap">
      <div className="css3d-cube">
        {faces.map((f) => (
          <div key={f} className={`css3d-face css3d-${f}`}>
            <span className="css3d-label">PAKLIPPIN</span>
          </div>
        ))}
      </div>
    </div>
  );
}
