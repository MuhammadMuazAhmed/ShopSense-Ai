export default function LoadingSpinner({ text = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent 
                      rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  )
}