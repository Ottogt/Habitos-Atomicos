/** Ilustración tipo imagen 2: checklist, bandera con llama, planta */
export function AuthIllustration() {
  return (
    <div className="relative flex items-end justify-center h-48">
      {/* Checklist con checkmarks */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-28 h-24 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-center pl-4 gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-lg">✓</span>
          <span className="w-12 h-1.5 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-lg">✓</span>
          <span className="w-14 h-1.5 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-lg">✓</span>
          <span className="w-10 h-1.5 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Bandera con llama */}
      <div className="absolute left-1/2 top-14 -translate-x-1/2 flex flex-col items-center">
        <div className="w-1 h-8 bg-amber-800 rounded-full" />
        <div className="w-10 h-6 bg-amber-500 rounded-sm -mt-0.5" />
        <div className="w-3 h-4 -mt-2 text-orange-500 flex items-center justify-center text-xl">🔥</div>
      </div>
      {/* Maceta con planta */}
      <div className="absolute right-1/4 bottom-0 flex flex-col items-center">
        <div className="flex gap-0.5">
          <span className="text-green-600 text-2xl">🌿</span>
          <span className="text-green-500 text-2xl">🌿</span>
          <span className="text-green-600 text-2xl">🌿</span>
        </div>
        <div className="w-10 h-6 bg-amber-700 rounded-b-lg border-2 border-amber-800" />
      </div>
      {/* Hojitas sueltas */}
      <div className="absolute left-1/4 bottom-4 text-green-500 text-lg opacity-80">🍃</div>
      <div className="absolute right-1/3 bottom-8 text-green-600 text-sm opacity-70">🍃</div>
    </div>
  );
}
