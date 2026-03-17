interface AuthLayoutProps {
  leftTitle: string;
  rightHeadline: string;
  rightDescription: string;
  children: React.ReactNode;
}

/** Imagen a la izquierda, formulario a la derecha (inicio de sesión / crear cuenta) */
export function AuthLayout({
  leftTitle,
  rightHeadline,
  rightDescription,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-full flex flex-1 bg-gray-100">
      {/* Columna izquierda: imagen motivacional */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white border-r border-gray-200">
        <img
          src="/login-illustration.png"
          alt="Lista de verificación, racha y crecimiento"
          className="max-h-[70vh] w-auto object-contain"
        />
      </div>
      {/* Columna derecha: formulario */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            {rightHeadline}
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-sm">
            {rightDescription}
          </p>
          <h1 className="text-xl font-bold text-gray-800 mb-6">{leftTitle}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
