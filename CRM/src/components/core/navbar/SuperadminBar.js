import React, { useMemo } from 'react'
import SideBar from '../../common/SideBar'

const SuberadminBar = ({}) => {
    const titles = useMemo(()=>[
    //     {
    //     key:'dashboars',
    //     icon:'sliders',
    //     main: 'Dashboard',
    //     sub:[{
    //         name:'Default',
    //         path:'/'
    //     },{
    //     name: 'Default',
    //     path: '/'
    // }]
    // }, 
    {
        key:'admin',
        icon:'layout',
        main: 'Shop',
        sub: [ {
            name: 'Manage Shop',
            path: '/manage-admins'
        }]
        },
        {
            key:'product',
            icon: 'layout',
            main: 'Product',
            sub: [
            // {
            //     name: 'Add Prodcut',
            //     path: '/add-product'
            // },
            {
                name: 'Manage Product',
                path: '/superadmin/manage-products'
            }]
        },
        {
            key:'user',
            icon: 'layout',
            main: 'User',
            sub: [{
                name: 'Manage User',
                path: '/users'
            }, 
        ]
        },
        {
            key:'category',
            icon: 'layout',
            main: 'Category',
            sub: [{
                name: 'Manage Category',
                path: '/manage-category'
            }, {
                name: 'Create Category',
                path: '/create-category'
            }
        ]
        },
        {
            key:'brand',
            icon: 'layout',
            main: 'Brand',
            sub: [{
                name: 'Manage Brand',
                path: '/manage-brand'
            }, {
                name: 'Create Brand',
                path: '/create-brand'
            }
        ]
        }
    ],[])

    return (
        <SideBar titles={titles}/>
    )
}

export default (SuberadminBar)
