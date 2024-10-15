"use client"
import React from "react";
import { useSearchParams } from "next/navigation";

export default function ID(props: any) {
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    React.useEffect(()=>{
    if(search){
     props.handler(search)
     console.log({search})
    }
    else{
     props.handler("none")
    }
    },[search])
    
    return (
        <div>
        </div>
    )
}
