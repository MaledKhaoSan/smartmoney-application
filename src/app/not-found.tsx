"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconGhost, IconSearch } from "@tabler/icons-react"

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />

            <div className="relative flex flex-col items-center text-center max-w-md w-full">
                {/* Icon Section */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    <div className="relative size-32 md:size-40 bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex items-center justify-center group transition-transform hover:scale-105 duration-500">
                        <IconGhost className="size-16 md:size-20 text-primary animate-bounce-slow" />
                        <div className="absolute -bottom-2 -right-2 p-3 bg-white rounded-xl shadow-lg border border-slate-50">
                            <IconSearch className="size-6 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
                    404
                </h1>
                <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-3">
                    ไม่พบหน้าที่คุณต้องการ
                </h2>
                <p className="text-slate-500 mb-10 leading-relaxed">
                    ดูเหมือนว่าคุณจะเข้ามาผิดทาง หรือหน้าที่คุณกำลังตามหาอยู่ <br className="hidden md:block" />
                    <span className="font-medium text-slate-600">ยังอยู่ในระหว่างการพัฒนา</span> หรือถูกย้ายไปแล้ว
                </p>

                {/* Actions */}
                <div className="w-full flex flex-col gap-3">
                    <Button asChild className="h-14 rounded-2xl text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                        <Link href="/organization" className="flex items-center gap-2">
                            <IconArrowLeft className="size-5" />
                            กลับสู่หน้าหลัก
                        </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest font-bold opacity-50">
                        Smart Money Management
                    </p>
                </div>
            </div>

        </div>
    )
}
