import React, { useEffect, useState } from 'react'

export type DataListOption = { text: string; value: number }

export type DatalistProps = {
    options: DataListOption[]
    handleSelectedOption: (val: DataListOption['value']) => void
}

export const Datalist: React.FC<DatalistProps> = ({ options = [], handleSelectedOption }) => {
    const [shouldDisplay, setShouldDisplay] = useState(false)

    const handleOnClick = (value: number) => () => {
        handleSelectedOption(value)
        setShouldDisplay(false)
    }

    useEffect(() => {
        if (options.length === 0) {
            setShouldDisplay(false)
        } else {
            setShouldDisplay(true)
        }
    }, [options.length])

    if (!shouldDisplay) return null

    return (
        <div className="text-xs absolute border border-gray-100 rounded bg-white">
            {options.map((opt, idx) => (
                <div
                    key={JSON.stringify({ ...opt, idx })}
                    onClick={handleOnClick(opt.value)}
                    className="hover:bg-blue-100 p-2 cursor-pointer transition-all duration-200 ease-in-out"
                >
                    {opt.text}
                </div>
            ))}
        </div>
    )
}

export default Datalist
