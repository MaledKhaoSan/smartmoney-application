"use client"

import { useMemo } from "react"
import { Pie, PieChart, Area, AreaChart, CartesianGrid, XAxis, Label, Cell } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUp, TrendingDown } from "lucide-react"

// --- Pie Chart Components ---

const pieChartConfig = {
    collected: {
        label: "ได้รับแล้ว",
        color: "var(--primary)",
    },
    pending: {
        label: "ยังไม่ได้รับ",
        color: "var(--chart-5)", // Red-ish
    },
} satisfies ChartConfig

export function PaymentStatusPieChart({ collected, pending }: { collected: number, pending: number }) {
    const chartData = [
        { status: "collected", amount: collected, fill: "var(--color-collected)" },
        { status: "pending", amount: pending, fill: "var(--color-pending)" },
    ]

    const total = collected + pending
    const percentage = total > 0 ? Math.round((collected / total) * 100) : 0

    return (
        <Card className="flex flex-col border-none shadow-none bg-transparent md:bg-white md:border md:shadow-sm">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-base font-bold">สัดส่วนการเก็บเงิน</CardTitle>
                <CardDescription>ภาพรวมลูกหนี้ทั้งหมด</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={pieChartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="status"
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
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {percentage}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-xs"
                                                >
                                                    เก็บได้แล้ว
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {percentage >= 80 ? "การเก็บเงินอยู่ในเกณฑ์ดี" : "ควรติดตามยอดค้างชำระเพิ่ม"} 
                    {percentage >= 80 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
                <div className="leading-none text-muted-foreground text-xs">
                    ยอดรวมทั้งหมด ฿{total.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    )
}

// --- Area Chart Components ---

const areaChartConfig = {
    actual: {
        label: "ได้รับจริง",
        color: "var(--primary)",
    },
    expected: {
        label: "เป้าหมายที่ควรได้",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function IncomeTrendAreaChart() {
    // Mock Monthly Data
    const chartData = [
        { month: "ม.ค.", expected: 45000, actual: 42000 },
        { month: "ก.พ.", expected: 52000, actual: 48000 },
        { month: "มี.ค.", expected: 48000, actual: 46500 },
        { month: "เม.ย.", expected: 61000, actual: 59000 },
        { month: "พ.ค.", expected: 55000, actual: 54000 },
        { month: "มิ.ย.", expected: 67000, actual: 65000 },
    ]

    return (
        <Card className="border-none shadow-none bg-transparent md:bg-white md:border md:shadow-sm">
            <CardHeader className="px-0 md:px-6">
                <CardTitle className="text-base font-bold text-slate-800">แนวโน้มรายได้รายเดือน</CardTitle>
                <CardDescription>
                    เปรียบเทียบยอดที่คาดหวังกับยอดที่ได้รับจริง 6 เดือนล่าสุด
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 md:px-6">
                <ChartContainer config={areaChartConfig} className="aspect-[4/3] md:aspect-auto md:h-[250px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-actual)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-actual)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillExpected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-expected)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-expected)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="expected"
                            type="natural"
                            fill="url(#fillExpected)"
                            fillOpacity={0.4}
                            stroke="var(--color-expected)"
                            stackId="a"
                        />
                        <Area
                            dataKey="actual"
                            type="natural"
                            fill="url(#fillActual)"
                            fillOpacity={0.4}
                            stroke="var(--color-actual)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            รายได้เพิ่มขึ้น 5.2% เดือนนี้ <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground text-xs">
                            มกราคม - มิถุนายน 2024
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
