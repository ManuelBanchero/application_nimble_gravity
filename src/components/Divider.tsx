export default function Divider({ className }: { className?: string}) {
    return (
        <div className={`w-full h-[.5px] bg-gray-400 ${className || ''}`}/>
    )
}