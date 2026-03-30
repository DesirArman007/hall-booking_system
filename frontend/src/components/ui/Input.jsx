export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
          error 
            ? 'border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300' 
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
