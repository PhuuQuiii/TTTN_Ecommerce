import React from 'react'
import Layout from '../../core/Layout'
import LayoutLiveStream from './LiveStream'

const LiveStream = () => {
    return (
        <Layout>
            <LayoutLiveStream/>
        </Layout>
    )
}


export default React.memo(LiveStream)
