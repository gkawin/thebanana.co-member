import React, { useEffect, useState } from 'react'

export type DataListOption = { text: string; value: unknown }

export type DatalistProps = {
    options: DataListOption[]
    handleSelectedOption: (val: DataListOption['value']) => void
}

function isEqualsWith(arr: DataListOption[], Δarr: DataListOption[]) {
    var isEquals = false
    if (arr.length !== Δarr.length) return false

    for (let idx in arr) {
        if (arr[idx].text === Δarr[idx].text && arr[idx].value === Δarr[idx].value) {
            isEquals = true
            break
        }
    }
    return isEquals
}

export const Datalist: React.VFC<DatalistProps> = ({ options = [], handleSelectedOption }) => {
    const [shouldDisplay, setShouldDisplay] = useState(false)
    const [currentOptions, setCurrentOptions] = useState([])

    const handleOnClick = (value: unknown) => () => {
        handleSelectedOption(value)
        setShouldDisplay(false)
    }

    useEffect(() => {
        if (!isEqualsWith(options, currentOptions)) {
            setCurrentOptions(options)
            setShouldDisplay(true)
        }
        if (options.length === 0) {
            setShouldDisplay(false)
        }
    }, [currentOptions, options, shouldDisplay])

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
