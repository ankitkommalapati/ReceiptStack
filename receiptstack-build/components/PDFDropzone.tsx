'use client'

import { useUser } from "@clerk/nextjs";
import {DndContext, useSensor, useSensors, PointerSensor} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { userAgent } from "next/server";
import React, { useCallback, useRef, useState } from "react";
import {useSchematicEntitlement} from "@schematichq/schematic-react";
import { uploadPDF } from "@/actions/uploadPDF";


function PDFDropzone(){
    const [isUploading, setIsUploading]=useState(false);
    const [uploadedFiles, setUploadedFiles]=useState<string[]>([]);
    const [isDraggingOver, setIsDraggingOver]=useState(false);
    const fileInputRef=useRef<HTMLInputElement>(null);
    const {user}=useUser();
    const router=useRouter();
    // const {
    //     value: isFeatureEnabled,
    //     featureUsageExceeded, 
    //     featureUsage,
    //     featureAllocation
    // }=useSchematicEntitlement("scans");

    const sensors=useSensors(useSensor(PointerSensor));

    const handleUpload=useCallback(
        async (files: FileList | File[])=>{
            if (!user){
                alert("Please sign in to upload files");
                return;
            }
            const fileArray=Array.from(files);
            const pdfFiles=fileArray.filter(
                (file)=>
                    file.type==="application/pdf" ||
                file.name.toLowerCase().endsWith(".pdf"),
            );
            if (pdfFiles.length===0){
                alert("Please drop only pdf files.");
                return;
            }
            setIsUploading(true);
            try {
                const newUploadedFiles: string[]=[];
                for (const file of pdfFiles){
                    const formData=new FormData();
                    formData.append("file", file);
                    const result=await uploadPDF(formData);
                    if (!result.success){
                        throw new Error(result.error);
                    }
                    newUploadedFiles.push(file.name);
                }
                setUploadedFiles((prev)=>[...prev, ...newUploadedFiles]);
                setTimeout(()=>{
                    setUploadedFiles([]);
                }, 5000);
                router.push("/receipts");
            } catch (error) {
                console.error("Upload failed:", error);
                alert(
                    `Upload failed: ${error instanceof Error ? error.message:"Unknown error"}`,
                );
            } finally {
                setIsUploading(false);
            }
        },
        [user, router],
    )

    const handleDragOver=useCallback((e: React.DragEvent)=>{
        e.preventDefault();
        setIsDraggingOver(true);
    }, []);

    const handleDragLeave=useCallback((e: React.DragEvent)=>{
        e.preventDefault();
        setIsDraggingOver(true);
    }, []);
    
    const handleDrop=useCallback((e: React.DragEvent)=>{
        e.preventDefault();
        setIsDraggingOver(false);
        if (!user){
            alert("Please sign in to upload files");
            return;
        }
        if (e.dataTransfer.files && e.dataTransfer.files.length>0){
            handleUpload(e.dataTransfer.files);
        }
    }, [user, handleUpload]);

    const isUserSignedIn=!!user;
    const canUpload=isUserSignedIn;

    return (
        <DndContext sensors={sensors}>
            <div className="w-full max-w-md mx-auto">
                <div
                    onDragOver={canUpload?handleDragOver:undefined}
                    onDragLeave={canUpload?handleDragLeave:undefined}
                    onDrop={canUpload?handleDrop:(e)=>e.preventDefault()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDraggingOver?"border-green-500 bg-green-50":"border-gray-300"
                    } ${!canUpload?"opacity-70 cursor-not-allowed":""}`}
                >
                </div>
            </div>
        </DndContext>
    );
}

export default PDFDropzone;