import React from 'react'

export type ShippingAddressPanelProps = {
    shippingAddress: string
}

export const ShippingAddressPanel: React.FC<ShippingAddressPanelProps> = ({ shippingAddress }) => {
    return (
        <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50 space-y-1">
            <h2>ข้อมูลการจัดส่งหนังสือ</h2>
            <div className="text-sm">
                <h3 className="text-gray-500 text-xs">จัดส่งไปที่</h3>
                <span>{shippingAddress}</span>
            </div>
        </div>
    )
}
