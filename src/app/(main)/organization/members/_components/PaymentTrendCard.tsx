"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { IconChartBar } from "@tabler/icons-react"
import { CartesianGrid, Dot, Line, LineChart, XAxis } from "recharts"

interface PaymentTrendCardProps {
    chartData: any[]
    chartConfig: ChartConfig
}

export function PaymentTrendCard({ chartData, chartConfig }: PaymentTrendCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconChartBar className="h-5 w-5 text-primary" />
                    แนวโน้มการชำระ
                </CardTitle>
                <CardDescription>ยอดชำระสะสมตามเวลา</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="var(--color-amount)"
                            strokeWidth={2}
                            dot={({ cx, cy, payload }) => {
                                return (
                                    <Dot
                                        key={payload.date}
                                        r={4}
                                        cx={cx}
                                        cy={cy}
                                        fill="var(--color-amount)"
                                        stroke="var(--color-amount)"
                                    />
                                )
                            }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
