"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { IconCrown } from "@tabler/icons-react"

interface MemberGradeCardProps {
    grade: string
    percentile: number
    paidPercent: number
}

export function MemberGradeCard({ grade, percentile, paidPercent }: MemberGradeCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconCrown className="h-5 w-5 text-yellow-500" />
                    เกรดลูกหนี้
                </CardTitle>
                <CardDescription>การประเมินความน่าเชื่อถือ</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center gap-4 py-6">
                <div className="relative flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center">
                        <span className="text-5xl font-black text-primary">{grade}</span>
                    </div>
                    <div className="absolute -bottom-2 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-xs shadow-lg">
                        TOP {100 - percentile}%
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <p className="text-xl font-bold">ดีเยี่ยม</p>
                    <p className="text-xs text-muted-foreground">อันดับที่ {percentile}% ของทั้งหมด</p>
                </div>

                <div className="w-full space-y-3 pt-3 border-t">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-medium">
                            <span>ความคืบหน้าการชำระ</span>
                            <span>{paidPercent.toFixed(1)}%</span>
                        </div>
                        <Progress value={paidPercent} className="h-1.5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
