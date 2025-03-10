import React, { useMemo } from 'react'
import SideBar from '../../common/SideBar'

const AdminBar = ({adminProfile}) => {
    const titles = useMemo(()=>[
     {
        key:'product',
        icon:'layout',
        main: 'Product',
        // path:'/product'
        sub: [{
            name: 'Add Product',
            path: '/add-product'
        }, {
            name: 'Manage products',
            path: '/manage-products'
        }]
        },
        {
            key:'orders',
            icon: 'layout',
            main: 'Order',
            path:'/order',
            // sub: [ {
            //     name: 'Manage Orders',
            //     path: '/order'
            // }]
        },
        {
            key:'sales',
            icon: 'layout',
            main: 'Sale',
            path:'/sale',
        },
    ],[])

    return (
        <SideBar titles={titles} adminProfile={adminProfile}/>
    )
}

export default (AdminBar)
