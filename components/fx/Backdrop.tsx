import ParticleField from "./ParticleField";

/**
 * The fixed background stack. Everything except the particle canvas is static markup
 * styled entirely in CSS off the shared --sx/--sy pointer variables, so this renders
 * on the server and never re-renders.
 */
export default function Backdrop() {
  return (
    <div className="bg-layers" aria-hidden="true">
      <div className="bg-aurora" />
      <div className="bg-grid" />
      <div className="bg-grid-hot" />
      <ParticleField />
      <div className="bg-spotlight" />
      <div className="bg-vignette" />
      <div className="bg-grain" />
    </div>
  );
}
