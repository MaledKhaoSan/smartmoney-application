"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { IconChartBar } from "@tabler/icons-react"
import { Label, Pie, PieChart } from "recharts"

interface DebtRatioCardProps {
    pieData: any[]
    totalPayable: number
    remainingAmount: number
    chartConfig: ChartConfig
}

export function DebtRatioCard({ pieData, totalPayable, remainingAmount, chartConfig }: DebtRatioCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2">
                    <IconChartBar className="h-5 w-5 text-blue-500" />
                    อัตราส่วนการชำระ
                </CardTitle>
                <CardDescription>สัดส่วนต้นและดอกเบี้ย</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[200px] [&_.recharts-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent nameKey="label" hideLabel />}
                        />
                        <Pie 
                            data={pieData} 
                            dataKey="value" 
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    ฿{remainingAmount.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 20}
                                                    className="fill-muted-foreground text-[10px]"
                                                >
                                                    ยอดคงค้าง
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-col gap-1 text-[10px] text-muted-foreground pb-4 px-2">
                    <div className="flex justify-between w-full">
                        <span>ชำระแล้ว:</span>
                        <span className="font-bold text-primary">฿{totalPayable > 0 ? (totalPayable - remainingAmount).toLocaleString() : 0}</span>
                    </div>
                    <div className="flex justify-between w-full">
                        <span>คงเหลือ:</span>
                        <span className="font-bold text-red-600">฿{remainingAmount.toLocaleString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
