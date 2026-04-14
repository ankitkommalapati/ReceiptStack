"use client";

import { useParams } from "next/navigation";

function Receipt(){
    const params=useParams<{id:string}>();
    return <div></div>;
}

export default Receipt;