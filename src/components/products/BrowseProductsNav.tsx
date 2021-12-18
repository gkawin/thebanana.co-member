import { useState } from 'react'

const categoriesNavbar = [
    { text: 'แนะนำ', value: 'Recommened', selected: true },
    { text: 'ป 6', value: 'P6' },
    { text: 'ป 5', value: 'P5' },
    { text: 'ป 4', value: 'P4' },
    { text: 'ม 1', value: 'M1' },
    { text: 'ม 2', value: 'M2' },
    { text: 'ม 3', value: 'M3' },
]

export type BrowseProductsNavProps = { className?: string }

export const BrowseProductsNav: React.VFC<BrowseProductsNavProps> = ({ className = '' }) => {
    const [categoryList] = useState<typeof categoriesNavbar>(categoriesNavbar)
    return (
        <ul className={className}>
            {categoryList.map(({ value, text, selected = false }) => (
                <li
                    key={value}
                    className={`inline-block py-4 px-2 text-gray-700 cursor-pointer ${
                        selected ? 'font-semibold text-lg' : 'text-sm'
                    }`}
                >
                    {text}
                </li>
            ))}
        </ul>
    )
}
