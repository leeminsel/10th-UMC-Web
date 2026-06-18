interface LanguageOption {
    value: string;
    label:string;
}

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    options: LanguageOption[];
    className?: string;
}
export const LanguageSelector = ({
    value,
    onChange,
    options,
    className="",
}: LanguageSelectorProps) => {
  return (
    <select
    value={value}
    onChange={(e)=>onChange(e.target.value)}
    className= {`w-full rouned-lg border border-gray-300 px-4 py-2 ${className}`}>
        {options.map((options) =>(
            <option key={options.value} value={options.value}>
                {options.label}
            </option>
        ))}
    </select>
  )
}
