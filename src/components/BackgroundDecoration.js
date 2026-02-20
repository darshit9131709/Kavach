export default function BackgroundDecoration() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40 overflow-hidden">
      <div className="absolute -top-24 -right-24 size-96 bg-[#8b47eb]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-24 size-64 bg-[#2ecc71]/5 rounded-full blur-3xl"></div>
    </div>
  );
}
