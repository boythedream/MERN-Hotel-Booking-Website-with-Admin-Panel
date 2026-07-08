const Loader = ({ label = "Loading" }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-3">
    <div className="w-8 h-8 border-2 border-ink-900/20 border-t-brass rounded-full animate-spin" />
    <span className="eyebrow">{label}</span>
  </div>
);

export default Loader;
