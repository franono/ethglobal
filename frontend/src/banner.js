import React from 'react'
import Banner from 'react-banner'
import 'react-banner/dist/style.css'
 
export default function TopMenu(){
    return (
        <Banner
        logo="SecretPay"
        url={ window.location.pathname }
        items={[
            { "content": "Create Listing", "url": "/create" },
            { "content": "Active Listings", "url": "/verify" },
            {
                "content": "About",
                "url": "/about",
                "children": [
                    { "content": "SecretPay", "url": "/about/SecretPay" },
                    { "content": "Chainlink", "url": "/about/chainlink" }
                ]
            }
        ]} />
    )
}