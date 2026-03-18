interface FullScreenLoaderProps {
  message?: string;
}

export function FullScreenLoader({
  message = 'Carregando...',
}: FullScreenLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
